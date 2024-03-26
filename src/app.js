const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')

const { DATABASE_URL } = require('./utils/constants')
const { connectToDB } = require('./utils/database')
const { mainRouter } = require('./routes/mainRouter')

/**
 * Load libraries, plugins, routes and general middleware and start listening for requests.
 * @param {number} port - Port to listen to incoming request.
 */
function startServer(port) {
  console.log('Starting Server.')
  app.use(cors())
  app.use(express.json())

  connectToDB(DATABASE_URL)
  app.use(mainRouter)
  app.listen(port)
}

startServer(process.env.SERVER_PORT)
