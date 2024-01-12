// models/billingModel.js
const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    clientDetails: {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        contactEmail: String,
        // Additional client-specific details can be included here
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    
    method: {
        type: String,
        enum: ['credit_card', 'bank_transfer', 'paypal', 'crypto'], // Add more as needed
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    details: {
        type: String // Additional details or notes about the payment
    },
    dueDate: {
        type: Date
    },
    paymentDate: {
        type: Date
    },
    notes: {
        type: String
    },
    // Additional fields like payment method, transaction details, etc. can be added here
    // You can add more fields as needed, like billing address, tax information, etc.
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
