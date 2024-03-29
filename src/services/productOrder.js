const { ProductOrder } = require('../models/productOrder')

/**
 * Create one product order with the provided information in the database.
 * @param {string} userId - User Id.
 * @param {array} products - Array of products to order.
 * @param {string} status - Status of the order.
 * @returns {object} Product order if successful.
 */
async function createOneProductOrder(userId, products, status) {
  const productOrder = new ProductOrder({
    userId,
    products,
    status
  })
  return await productOrder.save()
}

module.exports = {
  createOneProductOrder
}
