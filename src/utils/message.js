/** Represents an structured response to be returned on any route. */
class ResponseMessage {
  /**
   * Create message response.
   * @param {{message?: string, status?: string}} data - Information to send in the response.
   * @param {string} [data.message] - String with information to be send.
   * @param {string} [data.status] - Status of the response.
   */
  constructor({ message = undefined, status = 'ok' }) {
    this.message = message
    this.timestamp = new Date().toISOString()
    this.status = status
  }
}

module.exports = { ResponseMessage }
