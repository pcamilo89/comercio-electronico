const { Product } = require('../models/product')
const { ProductError } = require('../errors/ProductError')
const { DATABASE_ERROR } = require('../utils/constants')

/**
 * Create one product with the provided information in the database.
 * @param {string} name - Product name.
 * @param {string} description - Product description.
 * @param {number} price - Product price.
 * @param {number} quantity - Product quantity available in stock.
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
 * @param {number} [object.limit] - Limit amount of results to be returned.
 * @param {number} [object.page] - Page to be returned.
 * @returns {Promise<object>}
 */
async function findProducts({ filterBy, filterOut = undefined, limit, page }) {
  const skip = (page - 1) * limit

  try {
    return await Product.find(filterBy, filterOut)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
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

/**
 * Search all the Id in the provided array and return an array of Products.
 * @param {[object]} products - Array of objects with _id to fetch from database.
 * @returns {[object]} - Array of Products.
 */
async function findProductsFromArray(products) {
  return await Promise.all(
    products.map(async (product) => {
      return findOneProduct(
        { _id: product._id },
        { name: 1, price: 1, quantity: 1 }
      )
    })
  )
}

/**
 * Update quantity of all products in the provided array.
 * @param {[object]} products - Array of objects with _id and quantity to update.
 * @param {[object]} stock - Array of objects with original values from database.
 * @param {string} [option] - Can be either 'increment', 'decrement' or 'change'.
 */
async function updateProductQuantityFromArray(
  products,
  stock,
  option = 'decrement'
) {
  const updateResult = await Promise.all(
    products.map(async (product, index) => {
      const { quantity } = stock.find(
        (element) => product._id.toString() === element._id.toString()
      )
      let value = 0
      if (option === 'increment') {
        value = quantity + product.quantity
      } else if (option === 'decrement') {
        value = quantity - product.quantity
      } else if (option === 'change') {
        value = product.quantity
      }

      try {
        return await updateOneProduct({ _id: product._id }, { quantity: value })
      } catch (CastError) {
        throw new ProductError({
          message: DATABASE_ERROR.CAST_ERROR
        })
      }
    })
  )

  return updateResult.every((obj) => obj.acknowledged === true)
}

module.exports = {
  createOneProduct,
  findOneProduct,
  findProducts,
  countProducts,
  updateOneProduct,
  deleteOneProduct,
  findProductsFromArray,
  updateProductQuantityFromArray
}
