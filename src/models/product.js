const { model, Schema } = require('mongoose')

/**
 * Product Schema
 * @type {Schema}
 */
const productSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 50
  },
  description: {
    type: String,
    required: true,
    maxLength: 100
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('Product', productSchema)
