const express = require('express')
/**
 * Auth router to manage authentication routes.
 * @module authRouter
 */
const authRouter = express.Router()
const { register, login } = require('../controllers/auth')

authRouter.post('/register', register)
authRouter.post('/login', login)

module.exports = { authRouter }
