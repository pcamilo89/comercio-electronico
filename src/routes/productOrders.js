const express = require('express')
/**
 * Product orders router to manage product orders routes.
 * @module productOrdersRouter
 */
const productOrdersRouter = express.Router()

const { ResponseMessage } = require('../utils/message')

productOrdersRouter.get('/', async (req, res) => {
  const message = new ResponseMessage({
    message: 'This is the product orders route.'
  })
  res.send(message)
})

module.exports = { productOrdersRouter }
