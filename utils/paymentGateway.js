// utils/paymentGateway.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Project = require('../models/projectModel'); // Import the Project model

// Process payment for a project
const processPayment = async (projectId, amount, currency) => {
  try {
    // Retrieve the project
    const project = await Project.findById(projectId);
    if (!project) {
      return { error: 'Project not found' };
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // For escrow, we hold the funds until project completion
      capture_method: 'manual'
    });

    // Update project with payment details
    project.escrow = {
      amount,
      status: 'funded',
      paymentIntentId: paymentIntent.id
    };
    await project.save();

    return {
      success: true,
      clientSecret: paymentIntent.client_secret // Send client secret to frontend for payment confirmation
    };
  } catch (error) {
    console.error('Error processing payment:', error.message);
    return { error: error.message };
  }
};

// Release funds from escrow upon project completion
const releaseEscrow = async (projectId) => {
  try {
    const project = await Project.findById(projectId);
    if (!project || project.escrow.status !== 'funded') {
      return { error: 'Project not found or escrow not funded' };
    }

    // Capture the payment intent to release funds
    await stripe.paymentIntents.capture(project.escrow.paymentIntentId);

    // Update project escrow status
    project.escrow.status = 'released';
    await project.save();

    return { success: true };
  } catch (error) {
    console.error('Error releasing escrow:', error.message);
    return { error: error.message };
  }
};

module.exports = { processPayment, releaseEscrow };
