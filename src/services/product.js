const { Product } = require('../models/product')
const { ProductError } = require('../errors/ProductError')
const { DATABASE_ERROR } = require('../utils/constants')

/**
 * Insert one product with the provided information in the database.
 * @param {string} name - Product name.
 * @param {string} description - Product description.
 * @param {number} price - Product price.
 * @param {number} quantity - Product quantity avaiable in stock.
 * @returns {object} Product if successful.
 */
async function createOneProduct(name, description, price, quantity) {
  const product = new Product({
    name,
    description,
    price,
    quantity
  })
  return await product.save()
}

/**
 * Search one product with the provided information in the database.
 * @param {object} filterBy - Filter search by any parameter specified or a combination.
 * @param {object} [filterOut=undefined] - Filter out any parameter specified or a combination.
 * @returns {object} Product if successful.
 */
async function findOneProduct(filterBy, filterOut = undefined) {
  try {
    return await Product.findOne(filterBy, filterOut)
  } catch (CastError) {
    throw new ProductError({
      message: DATABASE_ERROR.CAST_ERROR
    })
  }
}

/**
 * Search all products with the provided information in the database.
 * @param {{ filterBy?: object; filterOut?: object; limit?: number; page?: number; }} object
 * @param {object} [object.filterBy] - Filter search by any parameter specified or a combination.
 * @param {object} [object.filterOut=undefined] - Filter out any parameter specified or a combination.
 * @param {number} [object.limit] - Limit amount of results to be returned, default is 10.
 * @param {number} [object.page] - Page to be returned, default is 1.
 * @returns {Promise<object>}
 */
async function findProducts({ filterBy, filterOut = undefined, limit, page }) {
  const skip = (page - 1) * limit

  try {
    return await Product.find(filterBy, filterOut).limit(limit).skip(skip)
  } catch (CastError) {
    throw new ProductError({
      message: DATABASE_ERROR.CAST_ERROR
    })
  }
}

/**
 * Count products with the provided information in the database.
 * @param {object} filterBy - Find by any parameter of product or a combination.
 * @returns {object} List of products if successful.
 */
async function countProducts(filterBy) {
  try {
    return await Product.countDocuments(filterBy)
  } catch (CastError) {
    throw new ProductError({
      message: DATABASE_ERROR.CAST_ERROR
    })
  }
}

/**
 * Update one product with the provided information  in the database.
 * @param {object} filterBy - Find by any parameter of product or a combination.
 * @param {object} update - Update information.
 * @returns {object} Status of the operation.
 */
async function updateOneProduct(filterBy, update) {
  try {
    return await Product.updateOne(filterBy, {
      $set: {
        name: update.name,
        description: update.description,
        price: update.price,
        quantity: update.quantity
      }
    })
  } catch (CastError) {
    throw new ProductError({
      message: DATABASE_ERROR.CAST_ERROR
    })
  }
}

/**
 * Delete one product with the provided information in the database.
 * @param {object} filterBy - Find by any parameter of product or a combination.
 * @returns {object} Status of the operation.
 */
async function deleteOneProduct(filterBy) {
  try {
    return await Product.deleteOne(filterBy)
  } catch (CastError) {
    throw new ProductError({
      message: DATABASE_ERROR.CAST_ERROR
    })
  }
}

module.exports = {
  createOneProduct,
  findOneProduct,
  findProducts,
  countProducts,
  updateOneProduct,
  deleteOneProduct
}
