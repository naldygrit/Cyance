// middleware/roleMiddleware.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, jwtConfig.secret);

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token has expired' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

module.exports = roleMiddleware;
