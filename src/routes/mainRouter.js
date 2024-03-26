const express = require('express')
/**
 * Main router to manage diferent children routes.
 * @module mainRouter
 */
const mainRouter = express.Router()

const { authRouter } = require('./auth')
const { productsRouter } = require('./products')
const { productOrdersRouter } = require('./productOrders')

mainRouter.use('/api/auth', authRouter)
mainRouter.use('/api/products', productsRouter)
mainRouter.use('/api/product-orders', productOrdersRouter)

const { ResponseMessage } = require('../utils/message')
const { HttpError } = require('../errors/HttpError')

mainRouter.get('/api', async (req, res) => {
  const message = new ResponseMessage({ message: 'The server is working.' })
  res.send(message)
})

mainRouter.get('/api/error', async (req, res) => {
  throw new HttpError({ message: 'Test HTTP error is working.' })
})

module.exports = { mainRouter }
