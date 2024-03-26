const express = require('express')
/**
 * Product orders router to manage product orders routes.
 * @module productOrdersRouter
 */
const productOrdersRouter = express.Router()

const {
  createProductOrder,
  getProductOrders,
  updateProductOrder,
  deleteProductOrder
} = require('../controllers/productOrders')

productOrdersRouter.post('/', createProductOrder)
productOrdersRouter.get('/', getProductOrders)
productOrdersRouter.patch('/:id', updateProductOrder)
productOrdersRouter.delete('/:id', deleteProductOrder)

module.exports = { productOrdersRouter }
