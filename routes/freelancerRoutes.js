// routes/freelancerRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, updateProfile, searchProjects, getAllFreelancers, getFreelancerProfile } = require('../controllers/freelancerController');
const freelancerController = require('../controllers/freelancerController');
const {sendMessage, getMessages} = require('../controllers/messageController');
const roleMiddleware = require('../middleware/roleMiddleware');

// Routes for freelancers
router.put('/updateProfile/:userId', roleMiddleware(['freelancer']), updateProfile);
router.get('/search', roleMiddleware(['freelancer']), searchProjects);

// Routes for clients
router.get('/getFreelancers', roleMiddleware(['client']), getAllFreelancers);
router.get('/profile/:freelancerId', roleMiddleware(['client']), getFreelancerProfile);

// Routes for freelancer messaging
router.post('/sendMessage', roleMiddleware(['freelancer']), sendMessage);
router.get('/getMessages', roleMiddleware(['freelancer']), getMessages);

module.exports = router;
