/** Represents a custom HTTP error to be returned on any route. */
class HttpError extends Error {
  /**
   * Creates an HttpError.
   * @param {{ httpStatusCode?: number; message?: string; hasStack?: boolean; }} data - Information to send in the error message.
   * @param {number} [data.httpStatusCode] - HTTP Status Code of the error.
   * @param {string} [data.message] - Error message to send in response.
   * @param {boolean} [data.hasStack] - Enable stack of the error.
   */
  constructor({
    httpStatusCode = 500,
    message = 'Internal Server Error.',
    hasStack = false
  }) {
    super(message)
    this.name = 'HttpError'
    this.httpStatusCode = httpStatusCode
    Error.captureStackTrace(this, this.constructor)
    if (!hasStack) this.stack = ''
  }
}

module.exports = { HttpError }
