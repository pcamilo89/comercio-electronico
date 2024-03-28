const Product = require('../models/product')

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
 * @param {object} data - Filter search by any parameter specified or a combination.
 * @param {object} [filter=undefined] - Filter out any atribute specified or a combination.
 * @returns {object} Product if successful.
 */
async function findOneProduct(data, filter = undefined) {
  return await Product.findOne(data, filter)
}

/**
 * Search all products with the provided information in the database.
 * @param {{ data?: object; filter?: object; limit?: number; page?: number; }} object
 * @param {object} [object.data] - Filter search by any parameter specified or a combination.
 * @param {object} [object.filter=undefined] - Filter out any atribute specified or a combination.
 * @param {number} [object.limit] - Limit amount of results to be returned, default is 10.
 * @param {number} [object.page] - Page to be returned, default is 1.
 * @returns {Promise<object>}
 */
async function findProducts({ data, filter = undefined, limit, page }) {
  const skip = (page - 1) * limit
  return await Product.find(data, filter).limit(limit).skip(skip)
}

/**
 * Count products with the provided information in the database.
 * @param {object} data - Find by any atribute of product or a combination.
 * @returns {object} List of products if successful.
 */

/**
 * Update one product with the provided information  in the database.
 * @param {object} filterBy - Find by any parameter of product or a combination.
 * @param {object} update - Update information.
 * @returns {object} Status of the operation.
 */
async function updateOneProduct(filterBy, update) {
  return await Product.updateOne(filterBy, {
    $set: {
      name: update.name,
      description: update.description,
      price: update.price,
      quantity: update.quantity
    }
  })
}

module.exports = {
  createOneProduct,
  findOneProduct,
  findProducts,
  countProducts,
  updateOneProduct
}
