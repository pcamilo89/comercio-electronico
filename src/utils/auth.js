const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { AuthError } = require('../errors/AuthError')

/**
 * Hash password with salt.
 * @param {string} password - Password to hash.
 * @returns {string} Hashed password.
 */
async function hashPassword(password) {
  const salt = await bcryptjs.genSalt(10)
  return await bcryptjs.hash(password, salt)
}

/**
 * Compare password and hashedPassword.
 * @param {string} password - Password to hash.
 * @param {string} hashedPassword - Hashed Password.
 * @returns {boolean} True if matching.
 */
async function comparePasswords(password, hashedPassword) {
  return await bcryptjs.compare(password, hashedPassword)
}

/**
 * Create a signed token with the received payload
 * @param {{ _id: string; username: string; }} object - Object with the payload to sign.
 * @param {string} object._id - id of the User.
 * @param {string} object.username - Username.
 * @returns {string} JWT as a string.
 */
function createJWT({ _id, username }) {
  return jwt.sign({ _id, username }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_TIME
  })
}

/**
 * Verify JWT with the server secret.
 * @param {string} tokenString - JWT string.
 * @returns Decoded payload.
 */
function verifyJWT(tokenString) {
  try {
    return jwt.verify(tokenString, process.env.JWT_TOKEN_SECRET)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AuthError({
        httpStatusCode: 401,
        message: 'Access denied, access token has expired.'
      })
    } else {
      throw new AuthError({
        httpStatusCode: 401,
        message: 'Access denied, access token validation failed.'
      })
    }
  }
}

/**
 * Verify if Authorization header has a JWT.
 * @param {string} header - Authorization header content.
 * @returns {string} JWT string.
 */
function hasJWT(header) {
  if (!header?.startsWith('Bearer ')) {
    throw new AuthError({
      httpStatusCode: 400,
      message: 'Access denied, access token not found.'
    })
  }
  return header.split(' ')[1]
}

module.exports = {
  hashPassword,
  comparePasswords,
  createJWT,
  hasJWT,
  verifyJWT
}
