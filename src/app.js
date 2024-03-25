const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')

const { connectToDB } = require('./utils/database')
const { DATABASE_URL } = require('./utils/constants')

const { ResponseMessage } = require('./utils/message')
const { errorHandler } = require('./middlewares/errorHandling')
const { HttpError } = require('./errors/HttpError')

/**
 * Load libraries, plugins, routes and general middleware and start listening for requests.
 * @param {number} port - Port to listen to incoming request.
 */
function startServer(port) {
  console.log('Starting Server.')
  app.use(cors())
  app.use(express.json())

  connectToDB(DATABASE_URL)

  app.get('/', async (req, res) => {
    const message = new ResponseMessage({ message: 'The server is working.' })
    res.send(message)
  })

  app.get('/error', async (req, res) => {
    throw new HttpError({ message: 'Test HTTP error is working.' })
  })

  app.use(errorHandler)

  app.listen(port)
}

startServer(process.env.SERVER_PORT)
