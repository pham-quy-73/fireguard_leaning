const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true
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

const UserModel = mongoose.model('User', UserSchema);

// Migrate index: drop old email index if Schema was compiled with required
UserModel.collection.dropIndex('email_1').catch((err) => {
  // Ignore error if index doesn't exist
});

module.exports = UserModel;
