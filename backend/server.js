require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB and seed default videos

app.use(cors());
app.use(express.json());

// Routes layer connecting URL to MVC structure
app.use('/api/auth', require('./routes/authRoutes'));

// App Metadata
app.get('/api/metadata', (req, res) => {
  res.json({
    message: "Backend is successfully connected!",
    version: "1.0.0",
    databaseStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();