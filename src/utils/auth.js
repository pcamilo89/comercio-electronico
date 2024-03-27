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

module.exports = {
  hashPassword,
}
