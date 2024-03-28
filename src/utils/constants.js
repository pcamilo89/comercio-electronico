const DATABASE_URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_IP}:${process.env.DB_PORT}/${process.env.DB_NAME}`

const DATABASE_ERROR = {
  CAST_ERROR: 'Could not find a match with provided information.'
}

module.exports = {
  DATABASE_URL,
  DATABASE_ERROR
}
