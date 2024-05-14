const { ResponseMessage } = require('../utils/message')
const { ProductOrderError } = require('../errors/ProductOrderError')
const { createProductOrderValidation } = require('../validators/productOrder')
const {
  findProductsFromArray,
  updateProductQuantityFromArray,
  updateOneProduct
} = require('../services/product')
const {
  createOneProductOrder,
  findOneProductOrder,
  countProductOrders,
  findProductOrders,
  deleteOneProductOrder
} = require('../services/productOrder')
const {
  removeRepeats,
  copyProductAttributes,
  checkStock,
  compareArrays,
  checkOwner,
  NoMatchingElements,
  hasZeroQuantity
} = require('../utils/productOrder')

/**
 * Create a new product order with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function createProductOrder(req, res) {
  const { status, products } = req.body
  const { _id: userId } = req.user

  const { error } = createProductOrderValidation({
    status,
    products
  })
  if (error) {
    throw new ProductOrderError({ message: error.message })
  }

  let uniqueProducts = removeRepeats(products)
  let stock = await findProductsFromArray(uniqueProducts)
  stock = stock.filter((item) => item !== null)

  compareArrays(uniqueProducts, stock)
  uniqueProducts = copyProductAttributes(uniqueProducts, stock)
  checkStock(uniqueProducts, stock)

  const updateResult = await updateProductQuantityFromArray(
    uniqueProducts,
    stock
  )
  if (!updateResult) {
    throw new ProductOrderError({
      message: 'Could not update all product quantities on database'
    })
  }

  const productOrder = await createOneProductOrder(
    userId,
    uniqueProducts,
    status
  )
  if (productOrder) {
    const message = new ResponseMessage({
      message: `Product order "${productOrder._id}" has been created`
    })
    res.send(message)
  }
}

/**
 * Get the product orders list.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProductOrders(req, res) {
  const { query } = req

  let page = 1
  if (query.page) {
    page = Number(query.page)
  }

  let limit = Number(process.env.FIND_PAGE_LIMIT)
  if (query.limit) {
    limit = Number(query.limit)
  }

  let count, productOrderList
  if (query.userId) {
    count = await countProductOrders({ userId: query.userId })
    productOrderList = await findProductOrders({
      filterBy: { userId: query.userId },
      limit,
      page
    })
  } else {
    count = await countProductOrders()
    productOrderList = await findProductOrders({ limit, page })
  }

  const message = new ResponseMessage()
  message.products = productOrderList
  message.count = count
  message.limit = limit
  message.page = page
  res.send(message)
}

/**
 * Get a product order with provided id.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProductOrderById(req, res) {
  const { id } = req.params

  const product = await findOneProductOrder({ _id: id })
  if (!product) {
    throw new ProductOrderError({
      message: "Product order doesn't exist"
    })
  }

  const message = new ResponseMessage()
  message.product = product
  res.send(message)
}

/**
 * Update a product order with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function updateProductOrder(req, res) {
  const { id } = req.params
  const { _id: userId } = req.user
  const { status, action, products } = req.body

  const productOrder = await findOneProductOrder({ _id: id })
  if (!productOrder) {
    throw new ProductOrderError({
      message: "Product order doesn't exist"
    })
  }
  checkOwner(productOrder.userId.toString(), userId)

  if (!(action && products) && !status) {
    throw new ProductOrderError({
      message: 'No information available to update product order'
    })
  }

  if ((action && !products) || (!action && products)) {
    throw new ProductOrderError({
      message: 'Both action and product must be present to update the order'
    })
  }

  if (status === 'approved' && status !== productOrder.status) {
    productOrder.status = status
    await productOrder.save()
  } else if (productOrder.status === 'approved') {
    throw new ProductOrderError({
      message: "Product order can't be modified if it's already approved"
    })
  }

  let uniqueProducts
  let stock

  if (products) {
    uniqueProducts = removeRepeats(products)
    stock = await findProductsFromArray(uniqueProducts)
    stock = stock.filter((item) => item !== null)
    compareArrays(uniqueProducts, stock)
    uniqueProducts = copyProductAttributes(uniqueProducts, stock)
  }

  if (action === 'remove') {
    for (const element of uniqueProducts) {
      const index = productOrder.products.findIndex(
        (product) => product._id.toString() === element._id
      )
      if (index === -1) {
        throw new ProductOrderError({
          message: 'One or more products not found in product order'
        })
      }
    }

    if (uniqueProducts.length === productOrder.products.length) {
      throw new ProductOrderError({
        message:
          "Product order can't be empty, it needs to have at least one product left"
      })
    }

    for (const element of uniqueProducts) {
      const index = productOrder.products.findIndex(
        (product) => product._id.toString() === element._id
      )
      const current = productOrder.products[index]
      const stockItem = stock.find(
        (obj) => current._id.toString() === obj._id.toString()
      )

      const value = stockItem.quantity + current.quantity
      const { acknowledged } = await updateOneProduct(
        { _id: current._id },
        { quantity: value }
      )
      if (acknowledged) productOrder.products.splice(index, 1)
    }
    await productOrder.save()
  }

  if (action === 'add') {
    checkStock(uniqueProducts, stock)
    if (!NoMatchingElements(uniqueProducts, productOrder.products)) {
      throw new ProductOrderError({
        message: 'Add action can only add new products, to modify change action'
      })
    }

    const updateResult = await updateProductQuantityFromArray(
      uniqueProducts,
      stock
    )
    if (!updateResult) {
      throw new ProductOrderError({
        message: 'Could not update all product quantities on database'
      })
    }

    for (const element of uniqueProducts) {
      productOrder.products.push(element)
    }
    await productOrder.save()
  }

  if (action === 'modify') {
    compareArrays(uniqueProducts, productOrder.products)
    if (hasZeroQuantity(uniqueProducts)) {
      throw new ProductOrderError({
        message: "Product order can't have a product with 0 quantity"
      })
    }

    const toAdd = []
    const toRemove = []

    for (const element of uniqueProducts) {
      const orderIndex = productOrder.products.findIndex(
        (product) => product._id.toString() === element._id
      )

      const tempObj = {
        _id: element._id,
        quantity: element.quantity - productOrder.products[orderIndex].quantity
      }

      if (element.quantity > productOrder.products[orderIndex].quantity) {
        toAdd.push(tempObj)
      } else if (
        element.quantity < productOrder.products[orderIndex].quantity
      ) {
        toRemove.push(tempObj)
      }
    }
    checkStock(toAdd, stock)
    const toProcess = [...toAdd, ...toRemove]

    const updateResult = await updateProductQuantityFromArray(toProcess, stock)
    if (!updateResult) {
      throw new ProductOrderError({
        message: 'Could not update all product quantities on database'
      })
    }

    for (const element of toProcess) {
      const index = productOrder.products.findIndex(
        (product) => product._id.toString() === element._id
      )
      productOrder.products[index].quantity =
        productOrder.products[index].quantity + element.quantity
    }
    await productOrder.save()
  }

  const message = new ResponseMessage({
    message: 'Product order updated successfully'
  })
  res.send(message)
}

/**
 * Delete a product order with provided id.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function deleteProductOrder(req, res) {
  const { id } = req.params
  const { _id: userId } = req.user

  const productOrder = await findOneProductOrder({ _id: id })
  if (!productOrder) {
    throw new ProductOrderError({
      message: "Product order doesn't exist"
    })
  }
  checkOwner(productOrder.userId.toString(), userId)

  if (productOrder.status === 'approved') {
    throw new ProductOrderError({
      message: "Can't delete an approved product order"
    })
  }

  let stock = await findProductsFromArray(productOrder.products)
  stock = stock.filter((item) => item !== null)

  const updateResult = await updateProductQuantityFromArray(
    productOrder.products,
    stock,
    'increment'
  )
  if (!updateResult) {
    throw new ProductOrderError({
      message: 'Could not update all product quantities on database'
    })
  }

  const { deletedCount } = await deleteOneProductOrder({ _id: id })

  const message = new ResponseMessage({
    message: deletedCount
      ? 'Product order deleted successfully'
      : 'Product order was not deleted'
  })
  res.send(message)
}

module.exports = {
  createProductOrder,
  getProductOrders,
  getProductOrderById,
  updateProductOrder,
  deleteProductOrder
}
