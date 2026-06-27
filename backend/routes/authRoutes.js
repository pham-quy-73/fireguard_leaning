const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  watchVideo,
  getVideoComments,
  createVideoComment,
  getForumPosts,
  createForumPost,
  getAnnouncements,
  createAnnouncement,
  getAdminStats,
  createNotification,
  getUserNotifications
} = require('../controllers/authController');

// Routes mapping for Auth, user state, and interactive reviews endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);
router.post('/watch', watchVideo);

// Comments & rating endpoints
router.get('/comments/:videoId', getVideoComments);
router.post('/comments', createVideoComment);

// Forum (general discussion board) endpoints
router.get('/forum', getForumPosts);
router.post('/forum', createForumPost);

// Announcements (admin-posted) endpoints
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);

// Admin stats endpoint
router.get('/admin/stats', getAdminStats);

// Thông báo gửi tới học viên (admin nhắc học)
router.post('/notifications', createNotification);
router.get('/notifications/:userId', getUserNotifications);

module.exports = router;
