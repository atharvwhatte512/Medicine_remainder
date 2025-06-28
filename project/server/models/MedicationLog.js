const mongoose = require('mongoose');

const medicationLogSchema = new mongoose.Schema({
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication',
    required: true
  },
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
  status: {
    type: String,
    enum: ['taken', 'missed', 'skipped'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  scheduledTime: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
medicationLogSchema.index({ user: 1, timestamp: -1 });
medicationLogSchema.index({ medication: 1, timestamp: -1 });

module.exports = mongoose.model('MedicationLog', medicationLogSchema);