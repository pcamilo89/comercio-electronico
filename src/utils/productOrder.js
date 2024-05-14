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
 * Compare if elements in first array exist in the second array.
 * @param {[object]} array1 - Array to be evaluated.
 * @param {[object]} array2 - Array to search for matches.
 */
function compareArrays(array1, array2) {
  const set2 = new Set(array2.map((obj) => obj._id.toString()))
  const missingElement = array1.find((element) => !set2.has(element._id))
  if (missingElement) {
    throw new ProductOrderError({
      message: 'One or more product id were not found in stock'
    })
  }
}

/**
 * Copy missing product attributes to first array from second array.
 * @param {[object]} array1 - Array to copy to.
 * @param {[object]} array2 - Array to copy from.
 * @returns {[object]} Array with attributes copied.
 */
function copyProductAttributes(array1, array2) {
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
    const element = stock.find(
      (element) => product._id.toString() === element._id.toString()
    )
    if (product.quantity > element.quantity) {
      throw new ProductOrderError({
        message: `Not Enough stock of "${product._id}" to create the order`
      })
    }
  })
}

/**
 * Check if authenticated user is the owner of product order.
 * @param {[object]} productUser - User id in the product order.
 * @param {[object]} authUser - User id authenticated.
 */
function checkOwner(productUser, authUser) {
  if (productUser !== authUser) {
    throw new ProductOrderError({
      httpStatusCode: 401,
      message: 'You are not the owner of this product order'
    })
  }
}

/**
 * Check if all elements of the first array are not in the second array.
 * @param {[object]} array1 - Array to be evaluated.
 * @param {[object]} array2 - Array to search for matches.
 * @returns {boolean} - True if no element is found in the second array.
 */
function NoMatchingElements(array1, array2) {
  return array1.every(
    (element1) =>
      !array2.some(
        (element2) => element1._id.toString() === element2._id.toString()
      )
  )
}

/**
 * Check if any object in array has quantity value equal to 0.
 * @param {[object]} array - Array to be evaluated.
 * @returns {boolean} True if at least one quantity equal to 0.
 */
function hasZeroQuantity(array) {
  return array.some((obj) => obj.quantity === 0)
}

module.exports = {
  removeRepeats,
  compareArrays,
  copyProductAttributes,
  checkStock,
  checkOwner,
  NoMatchingElements,
  hasZeroQuantity
}
