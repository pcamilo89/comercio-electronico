const Joi = require('joi')

/**
 * Validate fields needed to add a product.
 * @param {{ name: string; description: string; price: number; quantity: number; }} data - Object that contains needed fields.
 * @param {string} data.name - Product name.
 * @param {string} data.description - Product description.
 * @param {number} data.price - Product price.
 * @param {number} data.quantity - Product quantity avaiable in stock.
 * @returns {Object} Validation result.
 */
function createProductValidation({ name, description, price, quantity }) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required()
  })
  return schema.validate({ name, description, price, quantity })
}

module.exports = {
  createProductValidation
}
