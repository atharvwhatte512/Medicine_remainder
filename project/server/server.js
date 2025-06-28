require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const medicationRoutes = require('./routes/medications');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:19006', 'exp://localhost:19000'],
  credentials: true
}));

app.use(express.json());

// Connect to database without crashing the server on connection failure
(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Continue running the server even if DB connection fails
  }
})();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);

// Default route with better error handling
app.get('/', (req, res) => {
  res.send('MedTrack API is running');
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  // Handle specific types of errors
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    return res.status(503).json({ 
      message: 'Database service unavailable. Please try again later.'
    });
  }
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong on the server!'
  });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;