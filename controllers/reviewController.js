// controllers/reviewController.js
const jwt = require('jsonwebtoken');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const { verifyToken } = require('../utils/tokenUtils');

// Middleware to authenticate and authorize requests
exports.authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = verifyToken(token);

    // Fetch the user from the database based on the decoded token information
    const user = await User.findOne({ _id: decoded.id, role: decoded.role });

    if (!user) {
        // If the user is not found, authentication fails
        throw new Error();
    }

    // Attach the user object to the request for future use in route handlers
    req.user = user;
    next();
};

// Create a review for a freelancer
exports.createReview = async (req, res) => {
    try {
        const { rating, comment, freelancerId } = req.body;

        // Check if essential review details are provided
        if (!rating || !comment || !freelancerId) {
            return res.status(400).json({ message: 'Missing review details' });
        }

        // Fetch the freelancer from the database based on the provided freelancerId
        const freelancer = await User.findById(freelancerId);

        if (!freelancer || freelancer.role !== 'freelancer') {
            // If the freelancer is not found or is not a freelancer, return a 404 response
            return res.status(404).json({ message: 'Freelancer not found' });
        }

        // Ensure that the reviewer has worked with the freelancer
    // Ensure that the reviewer has worked with the freelancer
const hasWorkedWithFreelancer = checkIfWorkedWithFreelancer(req.user._id, freelancerId);

if (!hasWorkedWithFreelancer) {
    return res.status(403).json({ message: 'You must work with the freelancer before submitting a review' });
}

        if (!freelancer || freelancer.role !== 'freelancer') {
      return res.status(404).send({ message: 'Freelancer not found' });
    }

        // Create a new review and save it to the database
        const review = new Review({ rating, comment, reviewerId: req.user._id, freelancerId });
        await review.save();

        // Update freelancer's average rating
        freelancer.averageRating = await calculateAverageRating(freelancerId);
        await freelancer.save();

        // Return a 201 response with the created review
        res.status(201).json(review);
    } catch (error) {
        // If any error occurs, send a 500 response with an error message
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all reviews for a freelancer
exports.getReviews = async (req, res) => {
    try {
        const { freelancerId } = req.params;
        const reviews = await Review.find({ freelancerId });

        // Return a 200 response with the fetched reviews
        res.status(200).json(reviews);
    } catch (error) {
        // If any error occurs, send a 500 response with an error message
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// View details of a specific review
exports.viewReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            // If the review is not found, return a 404 response
            return res.status(404).json({ message: 'Review not found' });
        }

        // Return a 200 response with the fetched review
        res.status(200).json(review);
    } catch (error) {
        // If any error occurs, send a 500 response with an error message
        res.status(500).json({ message: 'Error viewing review', error: error.message });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        // Find and update the review in the database
        const review = await Review.findByIdAndUpdate(
            reviewId,
            { $set: { rating, comment } },
            { new: true }
        );

        if (!review) {
            // If the review is not found, return a 404 response
            return res.status(404).json({ message: 'Review not found' });
        }

        // Return a 200 response with the updated review
        res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
        // If any error occurs, send a 500 response with an error message
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        // Find and delete the review in the database
        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) {
            // If the review is not found, return a 404 response
            return res.status(404).json({ message: 'Review not found' });
        }

        // Return a 200 response with a success message
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        // If any error occurs, send a 500 response with an error message
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};

// Function to calculate average rating for a freelancer
const calculateAverageRating = async (freelancerId) => {
    try {
        const reviews = await Review.find({ freelancerId });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return reviews.length === 0 ? 0 : totalRating / reviews.length;
    } catch (error) {
        // If any error occurs, throw the error
        throw error;
    }
};

module.exports = {
  createReview,
  getReviews,
  viewReview,
  updateReview,
  deleteReview,
  authMiddleware
};

