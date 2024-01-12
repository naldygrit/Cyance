// controllers/freelancerController.js
const User = require('../models/userModel');
const Project = require('../models/projectModel');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');

// Middleware to authenticate and authorize freelancers
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, jwtConfig.secret);

        const user = await User.findOne({ _id: decoded.id, role: decoded.role });
        if (!user || user.role !== 'freelancer') {
            throw new Error('Unauthorized access');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed for freelancers' });
    }
};

// Update freelancer profile
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this profile' });
        }

        const updatedFreelancer = await User.findByIdAndUpdate(userId, updateData, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedFreelancer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating freelancer profile', error: error.message });
    }
};

// Search for projects based on various criteria
const searchProjects = async (req, res) => {
    try {
        const { skills, budgetMin, budgetMax, duration, clientRating } = req.query;
        let query = {};

        if (skills) {
            query.skillsRequired = { $in: skills.split(',') };
        }
        if (budgetMin && budgetMax) {
            query.budget = { $gte: budgetMin, $lte: budgetMax };
        }
        if (duration) {
            query.duration = duration;
        }
        if (clientRating) {
            query.clientRating = { $gte: clientRating };
        }

        const projects = await Project.find(query);
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for projects', error: error.message });
    }
};

module.exports = {
    authMiddleware,
    updateProfile,
    searchProjects
};

