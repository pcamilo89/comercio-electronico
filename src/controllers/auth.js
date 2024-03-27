const { ResponseMessage } = require('../utils/message')

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
  const message = new ResponseMessage({ message: 'This is the login route.' })
  res.send(message)
}

module.exports = { register, login }
