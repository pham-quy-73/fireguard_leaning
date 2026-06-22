const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Graceful exit or skip crash depending on preference, but here we can just log or throw
    // To be safe, we will log the error so it doesn't crash the server if mongo isn't active
    console.log("Continuing without active MongoDB service...");
  }
};

module.exports = connectDB;
