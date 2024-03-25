const express = require('express')
/**
 * Product router to manage product routes.
 * @module productsRouter
 */
const productsRouter = express.Router()

const { ResponseMessage } = require('../utils/message')

productsRouter.get('/', async (req, res) => {
  const message = new ResponseMessage({
    message: 'This is the products route.'
  })
  res.send(message)
})

module.exports = { productsRouter }
