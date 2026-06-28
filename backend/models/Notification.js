const mongoose = require('mongoose');

// Thông báo gửi tới 1 học viên cụ thể (vd admin nhắc học) — lưu DB để học viên nhận
const NotificationSchema = new mongoose.Schema({
  userId: {
    type: String, // học viên nhận thông báo
    required: true
  },
  icon: {
    type: String,
    default: '🔔'
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'reminder'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
