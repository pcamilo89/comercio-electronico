const express = require('express')
/**
 * Product orders router to manage product orders routes.
 * @module productOrdersRouter
 */
const productOrdersRouter = express.Router()

const {
  createProductOrder,
  getProductOrders,
  getProductOrdersByUser,
  getProductOrderById,
  updateProductOrder,
  deleteProductOrder
} = require('../controllers/productOrders')

productOrdersRouter.post('/', createProductOrder)
productOrdersRouter.get('/', getProductOrders)
productOrdersRouter.get('/:user', getProductOrdersByUser)
productOrdersRouter.get('/:id', getProductOrderById)
productOrdersRouter.patch('/:id', updateProductOrder)
productOrdersRouter.delete('/:id', deleteProductOrder)

module.exports = { productOrdersRouter }
