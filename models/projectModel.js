// models/projectModel.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'closed', 'in progress', 'completed'], default: 'open' },
  postedDate: { type: Date, default: Date.now },
  deadline: { type: Date },
  skillsRequired: [{ type: String }], // Array of required skills for the project
  interestedFreelancers: [{
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }], // Freelancers who have shown interest
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Freelancer selected by the client
  escrow: {
    amount: { type: Number },
    status: { type: String, enum: ['funded', 'released', 'disputed'], default: 'funded' },
    releaseConditions: String, // Conditions under which the escrow will be released
    disputeResolution: String, // Details on how disputes will be resolved
  },
  // Additional fields as required...
});

module.exports = mongoose.model('Project', projectSchema);