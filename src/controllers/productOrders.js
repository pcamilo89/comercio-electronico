const { ResponseMessage } = require('../utils/message')
const { HttpError } = require('../errors/HttpError')

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
 * TODO: Add productOrdersService method calls and proper responses
 * TODO: Change HttpError to a more Appropriate one
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function getProductOrders(req, res) {
  const { query } = req
  let result = null
  if (Object.keys(query).length === 0) {
    result = 'This is the get all product orders list route.'
  } else if (query.id) {
    result = 'This is the get product orders list by Id route.'
  } else if (query.userid) {
    result = 'This is the get product orders list by userId route.'
  } else {
    throw new HttpError({
      httpStatusCode: 400,
      message: 'The query parameter provided is invalid.'
    })
  }

  const message = new ResponseMessage({
    message: result
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
  updateProductOrder,
  deleteProductOrder
}
