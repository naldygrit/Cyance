// models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['freelancer', 'client', 'admin'], required: true },
  businessName: { type: String, default: '' }, // Business name for clients
  businessType: { type: String, default: '' }, // Type of business for clients
  bio: { type: String, default: '' }, // Brief bio or description, relevant for freelancers
  skills: { type: [String], default: [] }, // Relevant for freelancers
  priceRange: { // For freelancers to set their charge rates
    min: { type: Number, default: 0 },
    max: { type: Number }
  },
  profileCompleted: { type: Boolean, default: false }, // To track if the user completed their profile setup
  // Additional fields as required...
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
