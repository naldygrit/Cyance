// routes/clientRoutes.js
const express = require('express')
const router = express.Router()
const clientController = require('../controllers/clientController')
const messageController = require('../controllers/messageController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// Protected route requiring authentication to get client profile
router.get('/profile', authMiddleware, clientController.getClientProfile)

// Update client profile
router.put('/profile', authMiddleware, clientController.updateClientProfile)

// Get projects posted by the client
router.get('/projects', authMiddleware, clientController.getClientProjects)

// Routes for client messaging
router.post('/sendMessage', roleMiddleware(['client']), messageController.sendMessage)
router.get('/getMessages', roleMiddleware(['client']), messageController.getMessages)

// Additional routes for cybersecurity-related functionalities
// ...

module.exports = router
