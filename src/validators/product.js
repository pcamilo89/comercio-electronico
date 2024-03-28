const Joi = require('joi')

/**
 * Validate fields needed to add a product.
 * @param {{ name: string; description: string; price: number; quantity: number; }} object - Object that contains needed fields.
 * @param {string} object.name - Product name.
 * @param {string} object.description - Product description.
 * @param {number} object.price - Product price.
 * @param {number} object.quantity - Product quantity avaiable in stock.
 * @returns {object} Validation result.
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

/**
 * Validate fields needed to update a product.
 * @param {{ name?: string; description?: string; price?: number; quantity?: number; }} object - Object that contains needed fields.
 * @param {string} [object.name] - Product name.
 * @param {string} [object.description] - Product description.
 * @param {number} [object.price] - Product price.
 * @param {number} [object.quantity] - Product quantity avaiable in stock.
 * @returns {object} Validation result.
 */
function updateProductValidation({ name, description, price, quantity }) {
  const schema = Joi.object({
    name: Joi.string().min(3),
    description: Joi.string().min(3),
    price: Joi.number().min(0),
    quantity: Joi.number().min(0)
  }).min(1)
  return schema.validate({ name, description, price, quantity })
}

module.exports = {
  createProductValidation,
  updateProductValidation
}
