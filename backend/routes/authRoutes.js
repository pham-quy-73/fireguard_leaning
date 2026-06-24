const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  watchVideo,
  saveProgress,
  getVideoComments,
  createVideoComment,
  getAdminStats,
  updateUserProfile,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/authController');

// Routes mapping for Auth, user state, and interactive reviews endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);
router.post('/profile/update', updateUserProfile);
router.post('/watch', watchVideo);
router.post('/progress', saveProgress);

// Video CRUD routes
router.get('/videos', getVideos);
router.post('/videos', createVideo);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', deleteVideo);

// Comments & rating endpoints
router.get('/comments/:videoId', getVideoComments);
router.post('/comments', createVideoComment);

// Admin stats endpoint
router.get('/admin/stats', getAdminStats);

module.exports = router;
