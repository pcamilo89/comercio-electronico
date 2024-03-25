const express = require('express')
/**
 * Product router to manage product routes.
 * @module productsRouter
 */
const productsRouter = express.Router()
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/products')

productsRouter.post('/', createProduct)
productsRouter.get('/', getProducts)
productsRouter.get('/:id', getProductById)
productsRouter.patch('/:id', updateProduct)
productsRouter.delete('/:id', deleteProduct)

module.exports = { productsRouter }
