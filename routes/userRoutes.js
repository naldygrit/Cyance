// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, registerUser, loginUser, updateUserProfile, deleteUser, getUserById, getUserProfile, validateUserInput, handleUserErrors } = require('../controllers/userController');
const { getAllUsers } = require('../controllers/adminController'); // Correct import statement
const roleMiddleware = require('../middleware/roleMiddleware');

// Get all users - Assuming this is an admin function
router.get('/getUsers', roleMiddleware(['admin']), getAllUsers);

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Update user profile
router.put('/updateProfile/:userId', roleMiddleware(['client', 'freelancer', 'admin']), updateUserProfile);

// Delete a user
router.delete('/delete/:userId', roleMiddleware(['admin']), deleteUser);

// Get user by ID - For admin and the user themselves
router.get('/user/:userId', roleMiddleware(['client', 'freelancer', 'admin']), getUserById);

// Get user profile by ID - Accessible to both clients and freelancers
router.get('/profile/:userId', roleMiddleware(['client', 'freelancer']), getUserProfile);

module.exports = router;
