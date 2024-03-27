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

const { ResponseMessage } = require('../utils/message')
const { HttpError } = require('../errors/HttpError')
const { authHandler } = require('../middlewares/authHandler')

mainRouter.get('/api', async (req, res) => {
  const message = new ResponseMessage({ message: 'The server is working.' })
  res.send(message)
})

mainRouter.get('/api/error', async (req, res) => {
  throw new HttpError({ message: 'Test HTTP error is working.' })
})

mainRouter.get('/api/test', authHandler, async (req, res) => {
  const message = new ResponseMessage({
    message: 'This is a protected route, access successful.'
  })
  res.send(message)
})

mainRouter.use(notFoundHandler)
mainRouter.use(errorHandler)

module.exports = { mainRouter }
