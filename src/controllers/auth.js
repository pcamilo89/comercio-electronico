const { ResponseMessage } = require('../utils/message')

/**
 * Register user with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function register(req, res) {
  const message = new ResponseMessage({
    message: 'This is the register route.'
  })
  res.send(message)
}

/**
 * Login user with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function login(req, res) {
  const message = new ResponseMessage({ message: 'This is the login route.' })
  res.send(message)
}

module.exports = { register, login }
