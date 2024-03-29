const { ProductError } = require('../errors/ProductError')
const {
  createOneProduct,
  findOneProduct,
  findProducts,
  countProducts,
  updateOneProduct,
  deleteOneProduct
} = require('../services/product')
const { ResponseMessage } = require('../utils/message')
const {
  createProductValidation,
  updateProductValidation
} = require('../validators/product')

/**
 * Create a new product with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function createProduct(req, res) {
  const { name, description, price, quantity } = req.body

  const { error } = createProductValidation({
    name,
    description,
    price,
    quantity
  })
  if (error) {
    throw new ProductError({ httpStatusCode: 400, message: error.message })
  }

  const result = await findOneProduct({ name })
  if (result) {
    throw new ProductError({
      httpStatusCode: 400,
      message: 'Product already exists.'
    })
  }

  const product = await createOneProduct(name, description, price, quantity)
  if (product) {
    res.send(
      new ResponseMessage({
        message: `Product "${product.name}" has been created.`
      })
    )
  }
}

/**
 * Get the products list.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProducts(req, res) {
  const { query } = req

  let page = 1
  if (query.page) {
    page = Number(query.page)
  }

  let limit = Number(process.env.FIND_PAGE_LIMIT)
  if (query.limit) {
    limit = Number(query.limit)
  }

  const count = await countProducts()

  const productList = await findProducts({ limit, page })

  const message = new ResponseMessage()
  message.products = productList
  message.count = count
  message.limit = limit
  message.page = page
  res.send(message)
}

/**
 * Get a product with provided id.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProductById(req, res) {
  const { id } = req.params

  const product = await findOneProduct({ _id: id })
  if (!product) {
    throw new ProductError({
      httpStatusCode: 400,
      message: "Product doesn't exist."
    })
  }

  const message = new ResponseMessage()
  message.product = product
  res.send(message)
}

/**
 * Update a product with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function updateProduct(req, res) {
  const { id } = req.params
  const { name, description, price, quantity } = req.body

  const { error } = updateProductValidation({
    name,
    description,
    price,
    quantity
  })
  if (error) {
    throw new ProductError({ httpStatusCode: 400, message: error.message })
  }

  const { modifiedCount } = await updateOneProduct(
    { _id: id },
    { name, description, price, quantity }
  )

  const message = new ResponseMessage({
    message: modifiedCount
      ? 'The product with the provided id, was updated.'
      : 'The product with the provided id, was not updated.'
  })
  res.send(message)
}

/**
 * Delete a product with provided id.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function deleteProduct(req, res) {
  const { id } = req.params

  const { deletedCount } = await deleteOneProduct({ _id: id })

  const message = new ResponseMessage({
    message: deletedCount
      ? 'The product with the provided id, was deleted.'
      : 'The product with the provided id, was not deleted.'
  })
  res.send(message)
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
}
