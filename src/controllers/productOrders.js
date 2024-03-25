const { ResponseMessage } = require('../utils/message')

/**
 * Create a new product order with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function createProductOrder(req, res) {
  const message = new ResponseMessage({
    message: 'This is the create product order route.'
  })
  res.send(message)
}

/**
 * Get the product orders list.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProductOrders(req, res) {
  const message = new ResponseMessage({
    message: 'This is the get product orders list route.'
  })
  res.send(message)
}

/**
 * Get the product orders list by provided user.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProductOrdersByUser(req, res) {
  const message = new ResponseMessage({
    message: 'This is the get product orders list by user route.'
  })
  res.send(message)
}

/**
 * Get a product order with provided id.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProductOrderById(req, res) {
  const message = new ResponseMessage({
    message: 'This is the get product order by Id route.'
  })
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
  const message = new ResponseMessage({
    message: 'This is the delete product order route.'
  })
  res.send(message)
}

module.exports = {
  createProductOrder,
  getProductOrders,
  getProductOrdersByUser,
  getProductOrderById,
  updateProductOrder,
  deleteProductOrder
}
