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
  videoProgress: {
    type: Map, // videoId(string) -> phần trăm đã xem (0..100)
    of: Number,
    default: {}
  },
  videoScores: {
    type: Map, // videoId(string) -> { raw, max } điểm đạt được (vd H5P)
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
