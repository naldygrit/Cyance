/ controllers/projectController.js
const Project = require('../models/projectModel');
const User = require('../models/userModel'); // Ensure User model is imported
const speakeasy = require('speakeasy');
const { verifyToken } = require('../utils/tokenUtils');

// Middleware to authenticate and authorize requests
exports.authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = verifyToken(token);
    const user = await User.findOne({ _id: decoded.id, role: decoded.role });

    if (!user) {
        throw new Error();
    }

    req.user = user;
    next();
};

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { title, description, skillsRequired, deadline, budget } = req.body;
        const client = req.user._id; // Ensure the client is creating the project

        const newProject = new Project({
            title,
            description,
            skillsRequired,
            deadline,
            budget,
            client,
            interestedFreelancers: [], // Initialize as empty
            escrow: { status: 'pending', amount: 0 } // Initialize escrow details
        });

        await newProject.save();
        res.status(201).json({ message: 'Project created successfully', project: newProject });
    } catch (error) {
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

// Get projects for a specific client
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ client: req.user._id });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving projects', error: error.message });
    }
};

// View details of a specific project
exports.viewProject = async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
};

// Accept a proposal for a project
exports.acceptProposal = async (req, res) => {
  try {
    const { projectId, freelancerId } = req.body;

    // Custom logic to validate the proposal acceptance
    // Check if the project exists and is in a state where it can accept proposals
    const project = await Project.findById(projectId);

    if (!project || project.status !== 'open') {
      return res.status(400).json({ message: 'Invalid project or project not open for proposals' });
    }

    // Additional logic to check if the user accepting the proposal has the authority
    // In a cybersecurity context, you may verify credentials or permissions

    // Implement logic to handle the acceptance of the proposal
    project.assignedTo = freelancerId;
    project.status = 'assigned';
    await project.save();

    res.status(200).json({ message: 'Proposal accepted', project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error accepting proposal', error: error.message });
  }
};

// Reject a proposal for a project
exports.rejectProposal = async (req, res) => {
  try {
    const { projectId, freelancerId } = req.body;

    // Custom logic to validate the proposal rejection
    // Check if the project exists and is in a state where it can reject proposals
    const project = await Project.findById(projectId);

    if (!project || project.status !== 'open') {
      return res.status(400).json({ message: 'Invalid project or project not open for proposals' });
    }

    // Additional logic to check if the user rejecting the proposal has the authority
    // In a cybersecurity context, you may verify credentials or permissions

    // Implement logic to handle the rejection of the proposal
    // This can include updating the project status or notifying the freelancer

    res.status(200).json({ message: 'Proposal rejected', project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error rejecting proposal', error: error.message });
  }
};

// Enable two-factor authentication for a client
exports.enable2FA = async (req, res) => {
  try {
    // Custom logic to enable two-factor authentication for the authenticated client
    // In a cybersecurity context, you may generate a unique secret and provide it to the client

    const secret = speakeasy.generateSecret();
    req.user.twoFactorSecret = secret.base32;
    await req.user.save();

    res.status(200).json({ secret: secret.base32 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error enabling 2FA', error: error.message });
  }
};

// Verify two-factor authentication for a client
exports.verify2FA = async (req, res) => {
  try {
    // Custom logic to verify the two-factor authentication code for the authenticated client
    // In a cybersecurity context, you may use speakeasy to verify the provided code against the stored secret

    const { token } = req.body;
    const verified = speakeasy.totp.verify({
      secret: req.user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    res.status(verified ? 200 : 401).json({ valid: verified });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying 2FA', error: error.message });
  }
};

// Add more functions as needed based on your project requirements

module.exports = {
    createProject,
    getProjects,
    viewProject,
    acceptProposal,
    rejectProposal,
    enable2FA,
    verify2FA,
    authMiddleware
};
