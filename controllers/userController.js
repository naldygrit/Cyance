// controllers/userController.js
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt-config');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');

// Validate user input
const validateUserInput = (inputData) => {
  const errors = [];
  const { email, password, role } = inputData;

  if (!validator.isEmail(email)) {
    errors.push('Invalid email format');
  }

  if (!validator.isLength(password, { min: 6 })) {
    errors.push('Password should be at least 6 characters long');
  }

  const validRoles = ['freelancer', 'client', 'admin'];
  if (!validRoles.includes(role)) {
    errors.push('Invalid role specified');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Middleware to authenticate and authorize
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await User.findOne({ _id: decoded.id, role: decoded.role });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: `Authentication failed: ${error.message}` });
  }
};

// Handle user errors
const handleUserErrors = (res, status, message, error) => {
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(val => val.message);
    return res.status(400).json({ message: 'Validation error', errors: messages });
  } else if (error.name === 'MongoNetworkError') {
    return res.status(503).json({ message: 'Database connection error' });
  } else {
    return res.status(status).json({ message, error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    handleUserErrors(res, 500, 'Error fetching users', error);
  }
};

// Create a new user with role-specific logic
const createUser = async (req, res) => {
  try {
    const { email, password, role, name, businessName, businessType } = req.body;
    const validation = validateUserInput({ email, password, role });

    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      role,
      name, // Optional, can be added in profile update
      businessName, // For clients, optional
      businessType  // For clients, optional
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    handleUserErrors(res, 500, 'Error creating user', error);
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    handleUserErrors(res, 500, 'Error during login', error);
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    handleUserErrors(res, 500, 'Error updating user', error);
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    handleUserErrors(res, 500, 'Error deleting user', error);
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    handleUserErrors(res, 500, 'Error fetching user', error);
  }
};

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Adjust based on how you're passing the user ID
    const user = await User.findById(userId).select('-password'); // Exclude password from the result

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Adjust the response as needed for your application
  } catch (error) {
    handleUserErrors(res, 500, 'Error fetching user profile', error);
  }
};

module.exports = {
  authMiddleware,
  getAllUsers,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserProfile,
  validateUserInput,
  handleUserErrors
};
