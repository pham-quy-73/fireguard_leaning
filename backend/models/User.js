const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  watchedVideos: {
    type: [Number], // Store list of watched video IDs
    default: []
  },
  progress: {
    type: [{
      videoId: { type: Number, required: true },
      percentage: { type: Number, default: 0 },
      score: { type: Number, default: 0 },
      maxScore: { type: Number, default: 0 },
      completed: { type: Boolean, default: false }
    }],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
