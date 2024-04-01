const Joi = require('joi')

/**
 * Validate fields needed for user registration.
 * @param {{ username: string; email: string; password: string; }} object - Object that contains needed fields.
 * @param {string} object.username - Username.
 * @param {string} object.email - Email.
 * @param {string} object.password - Password.
 * @returns {object} Validation result.
 */
function registerValidation({ username, email, password }) {
  const schema = Joi.object({
    username: Joi.string().min(4).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  })
  return schema.validate({ username, email, password })
}

/**
 * Validate fields needed for user login.
 * @param {{ username: string; password: string; }} object - Object that contains needed fields.
 * @param {string} object.username - Username.
 * @param {string} object.password - Password.
 * @returns {object} Validation result.
 */
function loginValidation({ username, password }) {
  const schema = Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string().min(6).required()
  })
  return schema.validate({ username, password })
}

module.exports = {
  registerValidation,
  loginValidation
}
