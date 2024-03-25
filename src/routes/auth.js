const express = require('express')
/**
 * Auth router to manage authentication routes.
 * @module authRouter
 */
const authRouter = express.Router()
const { register, login } = require('../controllers/auth')

authRouter.get('/register', register)
authRouter.get('/login', login)

module.exports = { authRouter }
