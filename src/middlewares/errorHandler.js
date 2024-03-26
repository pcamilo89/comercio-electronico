const { ResponseMessage } = require('../utils/message')

/**
 * Middleware to handle the error response to be returned on any route.
 * @param {Error} err - Error to be sent in response.
 * @param {Request} [req] - Request object.
 * @param {Response} res - Response object.
 * @param {function} next - Function to pass to the next middleware.
 */
async function errorHandler(err, req, res, next) {
  const message = new ResponseMessage({ message: err.message, status: 'error' })
  const httpCode = err.httpStatusCode ?? 500

  res.status(httpCode).send(message)

  return next(err)
}

module.exports = { errorHandler }
