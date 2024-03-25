const express = require('express')
/**
 * Auth router to manage authentication routes.
 * @module authRouter
 */
const authRouter = express.Router()

const { ResponseMessage } = require('../utils/message')

authRouter.get('/', async (req, res) => {
  const message = new ResponseMessage({ message: 'This is the auth route.' })
  res.send(message)
})

module.exports = { authRouter }
