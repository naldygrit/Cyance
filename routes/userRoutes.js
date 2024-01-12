// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const roleMiddleware = require('../middleware/roleMiddleware');

// Get all users - Assuming this is an admin function
router.get('/getUsers', roleMiddleware(['admin']), userController.getAllUsers);

// Create a new user
router.post('/', userController.createUser);

// Login user
router.post('/login', userController.loginUser);

// User profile route - Accessible to both clients and freelancers
// Note: This route should include a dynamic parameter to identify the user by ID or username
router.get('/profile/:userId', roleMiddleware(['client', 'freelancer']), userController.getUserProfile);

module.exports = router;
