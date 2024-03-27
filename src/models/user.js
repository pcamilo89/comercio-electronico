const { model, Schema } = require('mongoose')

/**
 * User Schema
 * @type {Schema}
 */
const userSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 4
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 6
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('User', userSchema)
