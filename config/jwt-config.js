// config/jwt-config.js
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret'

module.exports = {
  secret: jwtSecret, // Use the variable here, not the string
  expiresIn: '1d' // Token expiration time
}
