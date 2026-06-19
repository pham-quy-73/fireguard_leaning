const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  videoId: {
    type: Number, // Map to video IDs (1 to 6)
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  avatarLetter: {
    type: String,
    default: 'A'
  },
  rating: {
    type: Number, // 1 to 5 stars
    required: true,
    default: 5
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
