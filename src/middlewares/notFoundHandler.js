const { ResponseMessage } = require('../utils/message')

/**
 * Middleware to handle '404 Not Found' response to be returned on any invalid route.
 * @param {Request} [req] - Request object.
 * @param {Response} res - Response object.
 * @param {function} [next] - Function to pass to the next middleware.
 */
async function notFoundHandler(req, res, next) {
  const message = new ResponseMessage({
    message: '404 Not Found.',
    status: 'error'
  })
  res.status(404).send(message)
}

module.exports = { notFoundHandler }
