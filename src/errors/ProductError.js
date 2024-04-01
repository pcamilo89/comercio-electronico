const { HttpError } = require('./HttpError')

/** Represents a custom HTTP error to be returned on any route. */
class ProductError extends HttpError {
  /**
   * Creates a Product related Error.
   * @param {{ httpStatusCode?: number; message?: string; hasStack?: boolean; }} object - Information to send in the error message.
   * @param {number} [object.httpStatusCode] - HTTP Status Code of the error.
   * @param {string} [object.message] - Error message to send in response.
   * @param {boolean} [object.hasStack] - Enable stack of the error.
   */
  constructor({
    httpStatusCode = 400,
    message = 'Product related Error',
    hasStack = false
  } = {}) {
    super({ httpStatusCode, message, hasStack })
    this.name = 'ProductError'
  }
}

module.exports = { ProductError }
