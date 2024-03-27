const { ProductError } = require('../errors/ProductError')
const {
  createOneProduct,
  findOneProduct,
  findProducts
} = require('../services/product')
const { ResponseMessage } = require('../utils/message')
const { createProductValidation } = require('../validators/product')

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
  const productList = await findProducts()
  const message = new ResponseMessage()
  message.products = productList
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
  const message = new ResponseMessage({
    message: 'This is the update product route.'
  })
  res.send(message)
}

/**
 * Delete a product with provided id.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function deleteProduct(req, res) {
  const message = new ResponseMessage({
    message: 'This is the delete product route.'
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
