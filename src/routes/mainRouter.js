const express = require('express')
/**
 * Main router to manage diferent children routes, and middleware.
 * @module mainRouter
 */
const mainRouter = express.Router()

const { authRouter } = require('./auth')
const { productsRouter } = require('./products')
const { productOrdersRouter } = require('./productOrders')

const { notFoundHandler } = require('../middlewares/notFoundHandler')
const { errorHandler } = require('../middlewares/errorHandler')

mainRouter.use('/api/auth', authRouter)
mainRouter.use('/api/products', productsRouter)
mainRouter.use('/api/product-orders', productOrdersRouter)

mainRouter.use(notFoundHandler)
mainRouter.use(errorHandler)

module.exports = { mainRouter }
