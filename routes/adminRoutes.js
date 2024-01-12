// routes/adminRoutes.js
const express = require('express')
const router = express.Router()
const {getAdminDashboard, getAllProjects, reviewFreelancers, handleProjectsDisputes, getClientProfile, updateClientProfile, getClientProjects} = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')

// Protected route requiring authentication
router.get('/dashboard', authMiddleware, getAdminDashboard);

// Route to get all projects for admin to manage
router.get('/projects', authMiddleware, getAllProjects);

// Route to review and manage freelancer profiles
router.post('/review-freelancers', authMiddleware, reviewFreelancers);

// Route to handle project disputes
router.post('/handle-projects-disputes', authMiddleware, handleProjectsDisputes);

// Route to get client profile
router.get('/client-profile/:clientId', authMiddleware, getClientProfile);

// Route to update client profile
router.put('/update-client-profile/:clientId', authMiddleware, updateClientProfile);

// Route to get client projects
router.get('/client-projects/:clientId', authMiddleware, getClientProjects);

// Additional routes as needed...

module.exports = router;
