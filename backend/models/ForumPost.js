const mongoose = require('mongoose');

// Trả lời (reply) dưới mỗi bài diễn đàn — lưu kèm trong ForumPost để F5 không mất
const ReplySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userName: {
    type: String,
    required: true
  },
  avatarLetter: {
    type: String,
    default: 'A'
  },
  role: {
    type: String,
    default: 'Học viên'
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

// General discussion board posts (separate from per-video reviews in Comment.js)
const ForumPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userName: {
    type: String,
    required: true
  },
  avatarLetter: {
    type: String,
    default: 'A'
  },
  role: {
    type: String,
    default: 'Học viên'
  },
  rating: {
    type: Number, // 1 to 5 stars
    default: 5
  },
  content: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  replies: {
    type: [ReplySchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('ForumPost', ForumPostSchema);
