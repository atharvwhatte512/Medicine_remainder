const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Medication = require('../models/Medication');
const MedicationLog = require('../models/MedicationLog');

// Get all medications for a user
router.get('/', protect, async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.user._id });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get medications for today
router.get('/today', protect, async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.user._id });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get medications for a specific date
router.get('/date/:date', protect, async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.user._id });
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new medication
router.post('/', protect, async (req, res) => {
  try {
    const { name, dosage, frequency, initialSupply, currentSupply, refillAt } = req.body;
    
    const medication = await Medication.create({
      name,
      dosage,
      frequency,
      initialSupply: initialSupply || 30,
      currentSupply: currentSupply || initialSupply || 30,
      refillAt: refillAt || 10,
      user: req.user._id,
    });
    
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a medication
router.put('/:id', protect, async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a medication
router.delete('/:id', protect, async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    // Also delete all logs for this medication
    await MedicationLog.deleteMany({
      medication: req.params.id,
      user: req.user._id
    });
    
    res.json({ message: 'Medication deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark medication as taken
router.post('/:id/take', protect, async (req, res) => {
  try {
    const medication = await Medication.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    // Create a log entry
    await MedicationLog.create({
      medication: medication._id,
      user: req.user._id,
      name: medication.name,
      dosage: medication.dosage,
      status: 'taken',
      timestamp: new Date(),
    });
    
    // Update medication supply
    medication.currentSupply = Math.max(0, medication.currentSupply - 1);
    await medication.save();
    
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark medication as missed
router.post('/:id/miss', protect, async (req, res) => {
  try {
    const medication = await Medication.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    // Create a log entry
    await MedicationLog.create({
      medication: medication._id,
      user: req.user._id,
      name: medication.name,
      dosage: medication.dosage,
      status: 'missed',
      timestamp: new Date(),
    });
    
    res.json({ message: 'Medication marked as missed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get medication history
router.get('/history', protect, async (req, res) => {
  try {
    let filter = { user: req.user._id };
    
    if (req.query.type && req.query.type !== 'all') {
      filter.status = req.query.type;
    }
    
    const logs = await MedicationLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear medication history
router.delete('/history', protect, async (req, res) => {
  try {
    await MedicationLog.deleteMany({ user: req.user._id });
    res.json({ message: 'Medication history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;