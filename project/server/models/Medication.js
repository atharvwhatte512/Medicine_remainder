const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  initialSupply: {
    type: Number,
    required: true,
    default: 30
  },
  currentSupply: {
    type: Number,
    required: true
  },
  refillAt: {
    type: Number,
    required: true,
    default: 10
  },
  instructions: {
    type: String
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: '#4A90E2'
  }
}, {
  timestamps: true
});

// Index for faster queries
medicationSchema.index({ user: 1, isActive: 1 });
medicationSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Medication', medicationSchema);