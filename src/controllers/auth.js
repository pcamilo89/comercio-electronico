const { HttpError } = require('../errors/HttpError')
const { ResponseMessage } = require('../utils/message')
const { hashPassword, comparePasswords, createJWT } = require('../utils/auth')
const { findOneUser, createOneUser } = require('../services/user')
const { registerValidation, loginValidation } = require('../validators/auth')

/**
 * Register user with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function register(req, res) {
  const { username, password, email } = req.body

  const { error } = registerValidation({ username, password, email })
  if (error) {
    throw new HttpError({ httpStatusCode: 400, message: error.message })
  }

  const result = await findOneUser({ $or: [{ username }, { email }] })
  if (result) {
    throw new HttpError({
      httpStatusCode: 400,
      message: 'Username or Email aready exists.'
    })
  }

  const hashedPassword = await hashPassword(password)
  const user = await createOneUser(username, hashedPassword, email)
  if (user) {
    res.send(
      new ResponseMessage({
        message: `User ${user.username} has been created.`
      })
    )
  }
}

/**
 * Login user with provided information.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object.
 */
async function login(req, res) {
  const { username, password } = req.body

  const { error } = loginValidation({ username, password })
  if (error) {
    throw new HttpError({ httpStatusCode: 400, message: error.message })
  }

  const user = await findOneUser({ username })
  if (!user) {
    throw new HttpError({
      httpStatusCode: 400,
      message: "Username and password don't match, please try again."
    })
  }

  const match = await comparePasswords(password, user.password)
  if (!match) {
    throw new HttpError({
      httpStatusCode: 400,
      message: "Username and password don't match, please try again."
    })
  }

  const { _id } = user
  const response = new ResponseMessage({ message: 'Login was successful.' })
  response.token = createJWT({ _id, username })
  res.send(response)
}

module.exports = { register, login }
