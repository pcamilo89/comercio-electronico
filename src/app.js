const express = require('express')
const app = express()
const cors = require('cors')

const { connectToDB } = require('./utils/database')
const { DATABASE_URL } = require('./utils/constants')

/**
 * Load libraries, plugins, routes and general middleware and start listening for requests.
 * @param {string} port - Port to listen to incoming request.
 */
function startServer(port) {
  console.log('Starting Server.')
  app.use(cors())
  app.use(express.json())

  connectToDB(DATABASE_URL)

  app.get('/', (req, res) => {
    res.send({ message: 'The server is up.' })
  })

  app.listen(port)
}

startServer(process.env.SERVER_PORT)
