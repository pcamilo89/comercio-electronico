const bcryptjs = require('bcryptjs')

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


module.exports = {
  hashPassword,
  comparePasswords,
}
