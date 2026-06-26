const express = require('express');
const router = express.Router();
const { getVideos, createVideo } = require('../controllers/videoController');

// Danh sách video bài học (đọc trực tiếp từ MongoDB)
router.get('/', getVideos);

// Thêm bài học mới (chỉ quản trị viên — xác thực bằng userId)
router.post('/', createVideo);

module.exports = router;
