const User = require('../models/user')

/**
 * Insert one user with the provided information in the database.
 * @param {string} username - Username.
 * @param {string} hashedPassword - Hashed password.
 * @param {string} email - Email.
 * @returns {Object} User if successful.
 */
async function createOneUser(username, hashedPassword, email) {
  const user = new User({
    username,
    email,
    password: hashedPassword
  })
  return await user.save()
}

/**
 * Search one user with the provided information in the database.
 * @param {Object} data - Find by any atribute of user or a combination.
 * @param {Object} [filter=undefined] - Filter any atribute of user or a combination.
 * @returns {Object} User if successful.
 */
async function findOneUser(data, filter = undefined) {
  return await User.findOne(data, filter)
}

module.exports = { createOneUser, findOneUser }
