const { ProductOrderError } = require('../errors/ProductOrderError')

/**
 * Removes repeated values from an array of objects with _id.
 * @param {array} data - Array of objects with _id.
 * @returns {array} Array without repeated values.
 */
function removeRepeats(data) {
  return [...new Map(data.map((item) => [item._id, item])).values()]
}

/**
 * Compare elements in first array if they exist in the second array.
 * @param {[object]} array1 - Array to be evaluated.
 * @param {[object]} array2 - Array to search for matches.
 */
function compareArrays(array1, array2) {
  const set2 = new Set(array2.map((obj) => obj._id))
  const missingElement = array1.find((element) => !set2.has(element._id))
  if (missingElement) {
    throw new ProductOrderError({
      message: 'One or more valid product id were not found.'
    })
  }
}

/**
 * Copy missing product atributes to first array from second array.
 * @param {[object]} array1 - Array to copy to.
 * @param {[object]} array2 - Array to copy from.
 * @returns {[object]} Array with atributes copied.
 */
function copyProductAtributes(array1, array2) {
  return array1.map((element1, index) => {
    element1.name = array2[index].name
    element1.price = array2[index].price
    return element1
  })
}

/**
 * Check if products in order are available in stock
 * @param {[object]} order - Array of products to check if available.
 * @param {[object]} stock - Array with products in stock to be checked.
 */
function checkStock(order, stock) {
  order.forEach((product, index) => {
    if (product.quantity > stock[index].quantity) {
      throw new ProductOrderError({
        message: `Not Enough stock of "${product._id}" to create the order.`
      })
    }
  })
}

module.exports = {
  removeRepeats,
  compareArrays,
  copyProductAtributes,
  checkStock
}
