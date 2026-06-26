const mongoose = require('mongoose');

// Admin-posted announcements (the "Thông báo" channel of the forum)
const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    default: 'Ban quản trị FIREGUARD'
  },
  pinned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
