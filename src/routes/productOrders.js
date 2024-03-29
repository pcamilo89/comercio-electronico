const express = require('express')
/**
 * Product orders router to manage product orders routes.
 * @module productOrdersRouter
 */
const productOrdersRouter = express.Router()

const {
  createProductOrder,
  getProductOrders,
  getProductOrderById,
  updateProductOrder,
  deleteProductOrder
} = require('../controllers/productOrders')
const { authHandler } = require('../middlewares/authHandler')

productOrdersRouter.post('/', authHandler, createProductOrder)
productOrdersRouter.get('/', getProductOrders)
productOrdersRouter.get('/:id', getProductOrderById)
productOrdersRouter.patch('/:id', updateProductOrder)
productOrdersRouter.delete('/:id', deleteProductOrder)

module.exports = { productOrdersRouter }
