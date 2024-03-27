const User = require('../models/user')

/**
 * Insert one user with the provided information in the database.
 * @param {string} username - Username.
 * @param {string} hashedPassword - Hashed password.
 * @param {string} email - Email.
 * @returns {object} User if successful.
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
 * @param {object} data - Filter search by any parameter specified or a combination.
 * @param {object} [filter=undefined] - FFilter out any atribute specified or a combination.
 * @returns {object} User if successful.
 */
async function findOneUser(data, filter = undefined) {
  return await User.findOne(data, filter)
}

module.exports = { createOneUser, findOneUser }
