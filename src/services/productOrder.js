const { ProductOrderError } = require('../errors/ProductOrderError')
const { ProductOrder } = require('../models/productOrder')
const { DATABASE_ERROR } = require('../utils/constants')

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

/**
 * Search one product order with the provided information in the database.
 * @param {object} filterBy - Filter search by any parameter specified or a combination.
 * @param {object} [filterOut=undefined] - Filter out any parameter specified or a combination.
 * @returns {object} Product order if successful.
 */
async function findOneProductOrder(filterBy, filterOut = undefined) {
  try {
    return await ProductOrder.findOne(filterBy, filterOut)
  } catch (CastError) {
    throw new ProductOrderError({
      message: DATABASE_ERROR.CAST_ERROR
    })
  }
}

/**
 * Search all product orders with the provided information in the database.
 * @param {{ filterBy?: object; filterOut?: object; limit?: number; page?: number; }} object
 * @param {object} [object.filterBy] - Filter search by any parameter specified or a combination.
 * @param {object} [object.filterOut=undefined] - Filter out any parameter specified or a combination.
 * @param {number} [object.limit] - Limit amount of results to be returned.
 * @param {number} [object.page] - Page to be returned.
 * @returns {Promise<object>}
 */
async function findProductOrders({
  filterBy,
  filterOut = undefined,
  limit,
  page
}) {
  const skip = (page - 1) * limit

  try {
    return await ProductOrder.find(filterBy, filterOut)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
  } catch (CastError) {
    throw new ProductOrderError({
      message: DATABASE_ERROR.CAST_ERROR
    })
  }
}

module.exports = {
  createOneProductOrder,
  findOneProductOrder,
  findProductOrders
}
