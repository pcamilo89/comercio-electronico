const { HttpError } = require('../errors/HttpError')
const { findOneUser } = require('../services/user')
const { hasJWT, verifyJWT } = require('../utils/auth')

/**
 * Middleware to handle verification of authentication credentials.
 * @param {Request} req - Request object.
 * @param {Response} [res] - Response object.
 * @param {function} next - Function to pass to the next middleware.
 */
async function authHandler(req, res, next) {
  const { authorization } = req.headers
  const token = hasJWT(authorization)
  req.user = verifyJWT(token)

  const { username } = req.user
  const user = await findOneUser({ username })
  if (!user) {
    throw new HttpError({
      httpStatusCode: 401,
      message: 'Access denied, access token validation failed.'
    })
  }

  return next()
}

module.exports = { authHandler }
