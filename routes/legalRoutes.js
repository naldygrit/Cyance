// routes/legalRoutes.js

const express = require('express');
const router = express.Router();
const legalController = require('../controllers/legalController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware
router.use(authMiddleware);

// Route for users to agree to terms of service
router.post('/agree-to-terms', legalController.agreeToTerms);

// Route for users to agree to the privacy policy
router.post('/agree-to-privacy-policy', legalController.agreeToPrivacyPolicy);

// Route for users to manage their privacy settings
router.put('/manage-privacy-settings', legalController.managePrivacySettings);

module.exports = router;
