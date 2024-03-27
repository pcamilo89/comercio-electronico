const Product = require('../models/product')

/**
 * Insert one product with the provided information in the database.
 * @param {string} name - Product name.
 * @param {string} description - Product description.
 * @param {number} price - Product price.
 * @param {number} quantity - Product quantity avaiable in stock.
 * @returns {Object} Product if successful.
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
 * @param {Object} data - Find by any atribute of user or a combination.
 * @param {Object} [filter=undefined] - Filter any atribute of user or a combination.
 * @returns {Object} Product if successful.
 */
async function findOneProduct(data, filter = undefined) {
  return await Product.findOne(data, filter)
}

module.exports = {
  createOneProduct,
  findOneProduct
}
