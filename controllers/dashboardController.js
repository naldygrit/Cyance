// controllers/dashboardController.js
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
const Billing = require('../models/billingModel');

// Function to get dashboard overview data
const getDashboardOverview = async (user) => {
    const totalProjects = await Project.countDocuments();
    const ongoingProjects = await Project.countDocuments({ status: 'ongoing' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const availableProjects = await Project.countDocuments({ status: 'open' });
    return { totalProjects, ongoingProjects, completedProjects, availableProjects };
};

// Function to get user's profile section
const getProfileSection = (user) => {
    return {
        name: user.name,
        profilePicture: user.profilePicture,
        expertise: user.expertise,
    };
};

// Function to get notifications for the user
const getNotifications = async (userId) => {
    // Logic to fetch notifications relevant to the user
    return []; // Replace with actual notifications logic
};

// Function to get recent messages
const getRecentMessages = async (userId) => {
    return await Message.find({ receiver: userId }).limit(5); // Last 5 messages
};

// Function to get project history
const getProjectHistory = async (user) => {
    const query = user.role === 'freelancer' ? { assignedTo: user._id } : { client: user._id };
    return await Project.find(query);
};

// Function to calculate security score
const getSecurityScore = (user) => {
    // Logic to calculate security score based on user's profile, certifications, etc.
    return user.securityScore || 0; // Placeholder
};

// Functions specific to freelancers
const getFreelancerSpecificFunctions = async (user) => {
    return {
        expressInterest: await getAvailableProjects(user.skills),
        qualificationsExperiences: user.qualifications,
        rateManagement: user.rateDetails,
        availabilityStatus: user.availability,
        workPortfolio: await getWorkPortfolio(user._id),
        billingPayments: await getBillingDetails(user._id),
    };
};

const getAvailableProjects = async (skills) => {
    return await Project.find({
        skillsRequired: { $in: skills },
        status: 'open'
    });
};

const getBillingDetails = async (userId) => {
    return await Billing.find({ userId });
};

const getWorkPortfolio = async (freelancerId) => {
    return await Project.find({
        assignedTo: freelancerId,
        status: 'completed'
    }).populate('client', 'name');
};

// Functions specific to clients
const getClientSpecificFunctions = async () => {
    return {
        postProject: {}, // Post a project (to be implemented)
        freelancerDiscovery: await discoverFreelancers(),
        projectProposals: await getProjectProposals(),
        securePayments: await getSecurePaymentDetails(),
        projectCollaboration: {} // Tools for collaboration (to be implemented)
    };
};

// Method to update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

// Method for a freelancer to express interest in a project
exports.expressInterestInProject = async (req, res) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        project.interestedFreelancers.push(req.user._id);
        await project.save();
        res.status(200).json({ message: 'Expressed interest in project successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error expressing interest', error: error.message });
    }
};

// Method to view billing details
exports.viewBillingDetails = async (req, res) => {
    try {
        const billingDetails = await Billing.find({ userId: req.user._id });
        res.status(200).json(billingDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching billing details', error: error.message });
    }
};

// Additional implemented methods for client-specific functionalities
const discoverFreelancers = async () => {
    return await User.find({ role: 'freelancer' });
};

const getProjectProposals = async () => {
    return await Project.find({ client: req.user._id, status: 'proposed' });
};

const getSecurePaymentDetails = async () => {
    return await Billing.find({ client: req.user._id });
};

exports.getUserDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const dashboardData = {
            overview: await getDashboardOverview(user),
            profileSection: getProfileSection(user),
            notificationCenter: await getNotifications(user._id),
            messagingSystem: await getRecentMessages(user._id),
            projectHistory: await getProjectHistory(user),
            securityScore: getSecurityScore(user),
        };

        if (user.role === 'freelancer') {
            Object.assign(dashboardData, await getFreelancerSpecificFunctions(user));
        } else if (user.role === 'client') {
            Object.assign(dashboardData, getClientSpecificFunctions());
        }

        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
};

module.exports = {
  getUserDashboard,
  updateUserProfile,
  expressInterestInProject,
  viewBillingDetails
};