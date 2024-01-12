// routes/reviewRoutes.js
const express = require('express')
const reviewController = require('../controllers/reviewController')
const roleMiddleware = require('../middleware/roleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

// Route for users to leave a review
router.post('/create', roleMiddleware(['client']), authMiddleware, reviewController.createReview)

// Route for users to view reviews (could be public or role-restricted)
// Note: Adjust this route based on your application's specific requirements
router.get('/view/:freelancerId', reviewController.viewReviews)

// Additional review-related routes...

module.exports = router
