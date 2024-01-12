// middleware/roleMiddleware.js
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt-config')

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, jwtConfig.secret)

      // Check if the token has expired
      if (decoded.exp <= Date.now() / 1000) {
        return res.status(401).json({ message: 'Token has expired' })
      }

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' })
      }

      req.user = decoded
      next()
    } catch (error) {
      // Handle various JWT verification errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' })
      }
      res.status(401).json({ message: 'Not authorized' })
    }
  }
}

module.exports = roleMiddleware
