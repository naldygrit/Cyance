// routes/adminRoutes.js
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const authMiddleware = require('../middleware/authMiddleware')

// Protected route requiring authentication
router.get('/dashboard', authMiddleware, adminController.getAdminDashboard)

// Route to get all projects for admin to manage
router.get('/projects', authMiddleware, adminController.getAllProjects)

// Route to review and manage freelancer profiles
router.post('/review-freelancer-profile', authMiddleware, adminController.reviewFreelancerProfile)

// Route to handle project disputes
router.post('/handle-project-disputes', authMiddleware, adminController.handleProjectDisputes)

// Additional routes as needed...

module.exports = router
