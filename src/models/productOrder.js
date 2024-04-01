const { model, Schema } = require('mongoose')

/**
 * Product Schema
 * @type {Schema}
 */
const productSchema = Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50
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
  }
})

/**
 * ProductOrder Schema
 * @type {Schema}
 */
const productOrderSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: {
    type: [productSchema],
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = {
  ProductOrder: model('ProductOrder', productOrderSchema),
  productOrderSchema
}
