// controllers/clientController.js
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt-config')
const User = require('../models/userModel')
const validator = require('validator')

// Middleware to authenticate and authorize clients
const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract the token from the request headers
    const token = req.header('Authorization').replace('Bearer ', '')

    // 2. Verify the token using the secret key from jwt-config.js
    const decoded = jwt.verify(token, jwtConfig.secret)

    // 3. Retrieve the user from the database based on the decoded token information
    const user = await User.findOne({ _id: decoded.id, role: decoded.role })

    if (!user || user.role !== 'client') {
      // 4. If the user is not found or is not a client, throw an error
      throw new Error()
    }

    // 5. Attach the user object to the request for future use in route handlers
    req.user = user

    // 6. Call next() to proceed to the next middleware or route handler
    next()
  } catch (error) {
    // 7. If any error occurs or the user is unauthorized, send a 401 response
    res.status(401).json({ message: 'Authentication failed for clients' })
  }
}

// Get client profile
const getClientProfile = async (req, res) => {
  try {
    // Access the authenticated client user through req.user
    const clientProfile = {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role
      // Add additional client-specific properties as needed
    }

    res.status(200).json(clientProfile)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client profile', error: error.message })
  }
}

// Update client profile
const updateClientProfile = async (req, res) => {
  try {
    const { clientId } = req.params
    const updateData = req.body

    // Ensure that the update is applied to the authenticated client's profile
    if (clientId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update other client profiles' })
    }

    const updatedClient = await User.findByIdAndUpdate(clientId, updateData, { new: true })

    res.status(200).json({ message: 'Client profile updated successfully', client: updatedClient })
  } catch (error) {
    res.status(500).json({ message: 'Error updating client profile', error: error.message })
  }
}

// Get projects associated with the authenticated client
const getClientProjects = async (req, res) => {
  try {
    // Access the authenticated client user through req.user
    const clientProjects = [
      // Sample projects associated with the client
      // Replace this with logic to fetch actual client projects from the database
    ]

    res.status(200).json(clientProjects)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client projects', error: error.message })
  }
}

// Export other functions as needed...
module.exports = {
  authMiddleware,
  getClientProfile,
  updateClientProfile,
  getClientProjects
}
