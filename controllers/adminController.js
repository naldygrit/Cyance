// controllers/adminController.js
const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt-config')
const User = require('../models/userModel')
const Project = require('../models/projectModel')
const logger = require('../utils/logger') // Ensure logger utility is set up
const { ValidationError, AuthenticationError, AuthorizationError, DatabaseError } = require('../utils/customErrors') // Custom error classes

// Validation functions
const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Middleware to authenticate and authorize admins
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    if (!token) throw new AuthenticationError('No token provided')

    const decoded = jwt.verify(token, jwtConfig.secret)
    const user = await User.findOne({ _id: decoded.id, role: 'admin' })
    if (!user) {
      throw new AuthorizationError('Admin access required')
    }

    req.user = user
    next()
  } catch (error) {
    logger.error(`Auth Middleware Error: ${error.message}`)
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

// Get admin dashboard information
const getAdminDashboard = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments()
    const activeProjects = await Project.countDocuments({ status: 'active', category: 'cybersecurity' })
    const totalFreelancers = await User.countDocuments({ role: 'freelancer', skills: 'cybersecurity' })
    const totalClients = await User.countDocuments({ role: 'client' })

    res.status(200).json({
      totalProjects,
      activeProjects,
      totalFreelancers,
      totalClients
    })
  } catch (error) {
    const dbError = new DatabaseError('Failed to fetch admin dashboard information')
    logger.error(dbError.message)
    res.status(dbError.statusCode || 500).json({ message: dbError.message })
  }
}

// Get all cybersecurity projects
const getAllProjects = async (req, res) => {
  try {
    const cybersecurityProjects = await Project.find({ status: 'active', category: 'cybersecurity' })
      .populate('freelancer', 'name email skills')
    res.status(200).json(cybersecurityProjects)
  } catch (error) {
    const dbError = new DatabaseError('Failed to fetch cybersecurity projects')
    logger.error(dbError.message)
    res.status(dbError.statusCode || 500).json({ message: dbError.message })
  }
}

// Review cybersecurity freelancers
const reviewFreelancers = async (req, res) => {
  try {
    const cybersecurityFreelancers = await User.find({ role: 'freelancer', skills: 'cybersecurity' })
      .select('name email rating skills')
    res.status(200).json(cybersecurityFreelancers)
  } catch (error) {
    const dbError = new DatabaseError('Error reviewing cybersecurity freelancers')
    logger.error(dbError.message)
    res.status(dbError.statusCode || 500).json({ message: dbError.message })
  }
}

// Handle cybersecurity projects disputes
const handleProjectsDisputes = async (req, res) => {
  try {
    // Implement logic to handle cybersecurity projects disputes
    const disputeHandlingResults = {
      message: 'Cybersecurity projects disputes handled successfully'
    }

    res.status(200).json(disputeHandlingResults)
  } catch (error) {
    const dbError = new DatabaseError('Error handling cybersecurity projects disputes')
    logger.error(dbError.message)
    res.status(dbError.statusCode || 500).json({ message: dbError.message })
  }
}

// Get client profile
const getClientProfile = async (req, res) => {
  try {
    const { clientId } = req.params
    if (!validateObjectId(clientId)) {
      throw new ValidationError('Invalid client ID')
    }

    const clientProfile = await User.findById(clientId).where({ role: 'client' })
    if (!clientProfile) {
      throw new DatabaseError('Client profile not found')
    }

    res.status(200).json(clientProfile)
  } catch (error) {
    logger.error(`Get Client Profile Error: ${error.message}`)
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

// Update client profile
const updateClientProfile = async (req, res) => {
  try {
    const { clientId } = req.params
    const updateData = req.body

    if (!validateObjectId(clientId)) {
      throw new ValidationError('Invalid client ID')
    }

    if (clientId !== req.user._id.toString()) {
      throw new AuthorizationError('Unauthorized to update other client profiles')
    }

    const updatedClient = await User.findByIdAndUpdate(clientId, updateData, { new: true })
    res.status(200).json({ message: 'Client profile updated successfully', client: updatedClient })
  } catch (error) {
    logger.error(`Update Client Profile Error: ${error.message}`)
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

// Get client cybersecurity projects
const getClientProjects = async (req, res) => {
  try {
    const clientCybersecurityProjects = await Project.find({ client: req.user._id, category: 'cybersecurity' })
      .populate('freelancer', 'name email skills')

    res.status(200).json(clientCybersecurityProjects)
  } catch (error) {
    const dbError = new DatabaseError('Error fetching client cybersecurity projects')
    logger.error(dbError.message)
    res.status(dbError.statusCode || 500).json({ message: dbError.message })
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find()
    res.status(200).json(allUsers)
  } catch (error) {
    const dbError = new DatabaseError('Error fetching all users')
    logger.error(dbError.message)
    res.status(dbError.statusCode || 500).json({ message: dbError.message })
  }
}

module.exports = {
  authMiddleware,
  getAdminDashboard,
  getAllProjects,
  reviewFreelancers,
  handleProjectsDisputes,
  getClientProfile,
  updateClientProfile,
  getClientProjects,
  getAllUsers
}
