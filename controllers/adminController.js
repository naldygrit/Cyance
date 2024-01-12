// controllers/adminController.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const validator = require('validator');

// Middleware to authenticate and authorize admins
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await User.findOne({ _id: decoded.id, role: decoded.role });

    if (!user || user.role !== 'admin') {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed for admins' });
  }
};

// Get admin dashboard information
const getAdminDashboard = async (req, res) => {
  try {
    // Fetch cybersecurity-specific statistics for the admin dashboard
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active', category: 'cybersecurity' });
    const totalFreelancers = await User.countDocuments({ role: 'freelancer', skills: 'cybersecurity' });
    const totalClients = await User.countDocuments({ role: 'client' });

    const adminDashboardInfo = {
      totalProjects,
      activeProjects,
      totalFreelancers,
      totalClients,
    };

    res.status(200).json(adminDashboardInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin dashboard information', error: error.message });
  }
};

// Get all cybersecurity projects
const getAllProjects = async (req, res) => {
  try {
    // Fetch all active cybersecurity projects with additional details
    const cybersecurityProjects = await Project.find({ status: 'active', category: 'cybersecurity' }).populate('freelancer', 'name email skills');

    res.status(200).json(cybersecurityProjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cybersecurity projects', error: error.message });
  }
};

// Review cybersecurity freelancers
const reviewFreelancers = async (req, res) => {
  try {
    // Retrieve cybersecurity freelancers and their performance metrics for review
    const cybersecurityFreelancers = await User.find({ role: 'freelancer', skills: 'cybersecurity' }).select('name email rating skills');

    res.status(200).json(cybersecurityFreelancers);
  } catch (error) {
    res.status(500).json({ message: 'Error reviewing cybersecurity freelancers', error: error.message });
  }
};

// Handle cybersecurity projects disputes
const handleProjectsDisputes = async (req, res) => {
  try {
    // Implement logic to handle cybersecurity projects disputes (e.g., mediation or resolution process)
    const disputeHandlingResults = {
      message: 'Cybersecurity projects disputes handled successfully',
    };

    res.status(200).json(disputeHandlingResults);
  } catch (error) {
    res.status(500).json({ message: 'Error handling cybersecurity projects disputes', error: error.message });
  }
};

// Get client profile
const getClientProfile = async (req, res) => {
  try {
    // Retrieve client profile details
    const clientProfile = {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      // Add additional client-specific properties as needed
    };

    res.status(200).json(clientProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client profile', error: error.message });
  }
};

// Update client profile
const updateClientProfile = async (req, res) => {
  try {
    const { clientId } = req.params;
    const updateData = req.body;

    // Ensure that the update is applied to the authenticated client's profile
    if (clientId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update other client profiles' });
    }

    const updatedClient = await User.findByIdAndUpdate(clientId, updateData, { new: true });

    res.status(200).json({ message: 'Client profile updated successfully', client: updatedClient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating client profile', error: error.message });
  }
};

// Get client cybersecurity projects
const getClientProjects = async (req, res) => {
  try {
    // Fetch cybersecurity projects associated with the authenticated client
    const clientCybersecurityProjects = await Project.find({ client: req.user._id, category: 'cybersecurity' }).populate('freelancer', 'name email skills');

    res.status(200).json(clientCybersecurityProjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client cybersecurity projects', error: error.message });
  }
};

// Export other functions as needed...
module.exports = {
  authMiddleware,
  getAdminDashboard,
  getAllProjects,
  reviewFreelancers,
  handleProjectsDisputes,
  getClientProfile,
  updateClientProfile,
  getClientProjects,
};
