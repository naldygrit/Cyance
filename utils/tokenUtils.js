// utils/tokenUtils.js
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt-config') // Adjust the path based on your actual directory structure

/**
 * Generates a JWT token for a user.
 * @param {Object} user - The user object for which to generate the token.
 * @returns {String} - The generated JWT token.
 */
const generateToken = (user) => {
  const payload = {
    id: user.id, // Use user's unique identifier
    email: user.email // Additional user info can be included if needed
  }

  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn // Token expiration time from jwtConfig
  })
}

module.exports = {
  generateToken
}
