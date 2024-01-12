// routes/freelancerRoutes.js
const express = require('express')
const router = express.Router()
const {authMiddleware, updateProfile, searchProjects } = require('../controllers/freelancerController')
const messageController = require('../controllers/messageController')
const roleMiddleware = require('../middleware/roleMiddleware')

// Routes for freelancers
router.put('/updateProfile/:userId', roleMiddleware(['freelancer']), updateProfile)
router.get('/search', roleMiddleware(['client']), searchProjects)

// Routes for freelancer messaging
router.post('/sendMessage', roleMiddleware(['freelancer']), messageController.sendMessage)
router.get('/getMessages', roleMiddleware(['freelancer']), messageController.getMessages)

module.exports = router
