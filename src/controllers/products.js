const { ResponseMessage } = require('../utils/message')

/**
 * Create a new product with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function createProduct(req, res) {
  const message = new ResponseMessage({
    message: 'This is the create product route.'
  })
  res.send(message)
}

/**
 * Get the product list.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProducts(req, res) {
  const message = new ResponseMessage({
    message: 'This is the get products route.'
  })
  res.send(message)
}

/**
 * Get a product with provided id.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProductById(req, res) {
  const message = new ResponseMessage({
    message: 'This is the get product by Id route.'
  })
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
