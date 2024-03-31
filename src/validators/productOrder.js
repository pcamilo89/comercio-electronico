const Joi = require('joi')

/**
 * Validate fields needed to add a product order.
 * @param {{ status: string; products: [{_id: string; quantity: number;}]; }} object - Object that contains needed fields.
 * @param {string} object.status - Product order status.
 * @param {array} object.products - Array of products to order.
 * @returns {object} Validation result.
 */
function createProductOrderValidation({ status, products }) {
  const product = Joi.object({
    _id: Joi.string().required(),
    quantity: Joi.number().min(1).required()
  })
  const schema = Joi.object({
    status: Joi.string()
      .pattern(/^(pending|approved)$/, {
        name: 'pending|approved'
      })
      .required(),
    products: Joi.array().items(product).min(1).required()
  })
  return schema.validate({ status, products })
}

module.exports = {
  createProductOrderValidation
}
