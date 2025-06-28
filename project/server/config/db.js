const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Using the provided Atlas connection string
    const dbUrl = 'mongodb+srv://atharv:12345whatte@cluster0.7fx5gde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit the process, let the application handle the error gracefully
    throw error;
  }
};

module.exports = connectDB;