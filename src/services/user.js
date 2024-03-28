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
 * @param {object} filterBy - Filter search by any parameter specified or a combination.
 * @param {object} [filterOut=undefined] - Filter out any parameter specified or a combination.
 * @returns {object} User if successful.
 */
async function findOneUser(filterBy, filterOut = undefined) {
  return await User.findOne(filterBy, filterOut)
}

module.exports = { createOneUser, findOneUser }
