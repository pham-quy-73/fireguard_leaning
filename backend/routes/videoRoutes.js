const express = require('express');
const router = express.Router();
const { getVideos } = require('../controllers/videoController');

// Danh sách video bài học (đọc trực tiếp từ MongoDB)
router.get('/', getVideos);

module.exports = router;
