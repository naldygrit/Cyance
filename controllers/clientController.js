// controllers/clientController.js
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt-config')
const User = require('../models/userModel')
const Project = require('../models/projectModel') // Adjust the path as needed

// Middleware to authenticate and authorize clients
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, jwtConfig.secret)

    const user = await User.findOne({ _id: decoded.id, role: decoded.role })

    if (!user || user.role !== 'client') {
      throw new Error()
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed for clients' })
  }
}

// Get client profile
const getClientProfile = async (req, res) => {
  try {
    const clientProfile = await User.findOne({ _id: req.user._id, role: 'client' })

    if (!clientProfile) {
      return res.status(404).json({ message: 'Client profile not found' })
    }

    res.status(200).json(clientProfile)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client profile', error: error.message })
  }
}

// Update client profile
const updateClientProfile = async (req, res) => {
  try {
    const { firstName, lastName, email /* other fields */ } = req.body

    const updatedClientProfile = await User.findOneAndUpdate(
      { _id: req.user._id, role: 'client' },
      { $set: { firstName, lastName, email /* other fields */ } },
      { new: true }
    )

    if (!updatedClientProfile) {
      return res.status(404).json({ message: 'Client profile not found' })
    }

    res.status(200).json({ message: 'Client profile updated successfully', clientProfile: updatedClientProfile })
  } catch (error) {
    res.status(500).json({ message: 'Error updating client profile', error: error.message })
  }
}

// Get projects associated with the client
const getClientProjects = async (req, res) => {
  try {
    const clientProjects = await Project.find({ client: req.user._id })

    res.status(200).json(clientProjects)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client projects', error: error.message })
  }
}

module.exports = {
  authMiddleware,
  getClientProfile,
  updateClientProfile,
  getClientProjects
}
