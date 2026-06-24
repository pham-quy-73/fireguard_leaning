const Video = require('../models/Video');

// @desc    Lấy toàn bộ danh sách video bài học từ MongoDB
// @route   GET /api/videos
// @access  Public
exports.getVideos = async (req, res) => {
  try {
    // Sắp xếp theo id tăng dần để thứ tự hiển thị ổn định, thêm/xóa trong DB phản ánh ngay
    const videos = await Video.find({}).sort({ id: 1 });
    res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Lỗi lấy danh sách video:", error);
    res.status(500).json({ success: false, message: "Không thể nạp danh sách bài học từ Máy chủ!" });
  }
};
