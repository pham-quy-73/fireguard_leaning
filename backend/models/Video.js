const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  categoryKey: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: '/anhdemo.png'
  },
  videoUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  isNew: {
    type: Boolean,
    default: false
  },
  defaultPercentage: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
