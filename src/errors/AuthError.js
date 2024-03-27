const { HttpError } = require('./HttpError')

/** Represents a custom HTTP error to be returned on any route. */
class AuthError extends HttpError {
  /**
   * Creates an Authentication Error.
   * @param {{ httpStatusCode?: number; message?: string; hasStack?: boolean; }} data - Information to send in the error message.
   * @param {number} [data.httpStatusCode] - HTTP Status Code of the error.
   * @param {string} [data.message] - Error message to send in response.
   * @param {boolean} [data.hasStack] - Enable stack of the error.
   */
  constructor({
    httpStatusCode = 400,
    message = 'Authentication Error.',
    hasStack = false
  } = {}) {
    super({ httpStatusCode, message, hasStack })
    this.name = 'AuthError'
  }
}

module.exports = { AuthError }
