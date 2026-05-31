const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  watchVideo,
  getVideoComments,
  createVideoComment,
  getAdminStats
} = require('../controllers/authController');

// Routes mapping for Auth, user state, and interactive reviews endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);
router.post('/watch', watchVideo);

// Comments & rating endpoints
router.get('/comments/:videoId', getVideoComments);
router.post('/comments', createVideoComment);

// Admin stats endpoint
router.get('/admin/stats', getAdminStats);

module.exports = router;
