const mongoose = require('mongoose');
const dns = require('dns');

// Force a reliable public DNS resolver for Node's c-ares.
// Some network adapters (e.g. Ethernet/VPN) advertise broken DNS servers that
// refuse SRV lookups, which makes `mongodb+srv://` fail with ECONNREFUSED even
// though the system DNS client (Windows) resolves fine.
dns.setServers(['8.8.8.8', '8.8.4.4']);

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
