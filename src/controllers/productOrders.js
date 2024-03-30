const { ResponseMessage } = require('../utils/message')
const { ProductOrderError } = require('../errors/ProductOrderError')
const { createProductOrderValidation } = require('../validators/productOrder')
const {
  findProductsFromArray,
  updateProductQuantityFromArray
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
  copyProductAtributes,
  checkStock,
  compareArrays
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
    throw new ProductOrderError({ httpStatusCode: 400, message: error.message })
  }

  let uniqueProducts = removeRepeats(products)
  let stock = await findProductsFromArray(uniqueProducts)
  stock = stock.filter((item) => item !== null)

  compareArrays(uniqueProducts, stock)
  uniqueProducts = copyProductAtributes(uniqueProducts, stock)
  checkStock(uniqueProducts, stock)

  const updateResult = await updateProductQuantityFromArray(
    uniqueProducts,
    stock
  )
  const allAcknowledged = updateResult.every((obj) => obj.acknowledged === true)
  if (!allAcknowledged) {
    throw new ProductOrderError({
      httpStatusCode: 400,
      message: 'Could not update all product quantities on database.'
    })
  }

  const productOrder = await createOneProductOrder(
    userId,
    uniqueProducts,
    status
  )
  if (productOrder) {
    const message = new ResponseMessage({
      message: `Product order "${productOrder._id}" has been created.`
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
      httpStatusCode: 400,
      message: "Product order doesn't exist."
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
  const message = new ResponseMessage({
    message: 'This is the update product order route.'
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

  const { deletedCount } = await deleteOneProductOrder({ _id: id })

  const message = new ResponseMessage({
    message: deletedCount
      ? 'The product order with the provided id, was deleted.'
      : 'The product order with the provided id, was not deleted.'
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
