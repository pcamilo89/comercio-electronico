const Joi = require('joi')

/**
 * Validate fields needed for user registration.
 * @param {{ username: string; email: string; password: string; }} data - Object that contains needed fields.
 * @param {string} data.username - Username.
 * @param {string} data.email - Email.
 * @param {string} data.password - Password.
 * @returns {Object} Validation result.
 */
function registerValidation({ username, email, password }) {
  const schema = Joi.object({
    username: Joi.string().min(4).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  })
  return schema.validate({ username, email, password })
}

module.exports = {
  registerValidation,
}
