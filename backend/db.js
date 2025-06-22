const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB connection URL with fallback
const mongoURL = 'mongodb://localhost:27017/';

// Set up MongoDB connection with proper options
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Connected to MongoDB server successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};

// Get the default connection
const db = mongoose.connection;

// Define event listeners for database connection
db.on('connected', () => {
    console.log('🟢 MongoDB connected');
});

db.on('error', (err) => {
    console.error('🔴 MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('🟡 MongoDB disconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

// Export both the connection and the connect function
module.exports = { db, connectDB };