const mongoose = require('mongoose')

/**
 * Function to stablish a conection with the database.
 * @param {string} dbUrl - URL to stablish a connection to.
 */
async function connectToDB(dbUrl) {
  try {
    await mongoose.connect(dbUrl)
    console.log('Connected to DB.')
  } catch (error) {
    console.error(error)
  }
}

module.exports = { connectToDB }
