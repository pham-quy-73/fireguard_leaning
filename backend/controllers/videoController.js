const Video = require('../models/Video');
const User = require('../models/User');

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

// @desc    Thêm một video bài học mới (chỉ quản trị viên)
// @route   POST /api/videos
// @access  Admin
exports.createVideo = async (req, res) => {
  try {
    const { userId, title, category, categoryKey, videoUrl, thumbnail, description, isNew, duration } = req.body;

    // Xác thực người gửi yêu cầu là admin (giống luồng đăng thông báo)
    const requester = userId ? await User.findById(userId) : null;
    const isAdmin = requester &&
      (requester.role === 'admin' || requester.email === 'admin@fireguard.com');

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Chỉ quản trị viên mới được thêm bài học!" });
    }

    // Validate các trường bắt buộc
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập tiêu đề bài học!" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: "Vui lòng chọn danh mục bài học!" });
    }
    if (!videoUrl || !videoUrl.trim()) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đường dẫn (URL) video!" });
    }

    // Tự sinh id tăng dần dựa trên video có id lớn nhất hiện tại
    const lastVideo = await Video.findOne({}).sort({ id: -1 });
    const newId = lastVideo ? lastVideo.id + 1 : 1;

    const newVideo = new Video({
      id: newId,
      title: title.trim(),
      category: category.trim(),
      // Nếu không truyền categoryKey thì suy ra từ category (slug đơn giản, có dấu -> không dấu)
      categoryKey: (categoryKey && categoryKey.trim()) || category.trim().toLowerCase().replace(/\s+/g, '-'),
      videoUrl: videoUrl.trim(),
      thumbnail: (thumbnail && thumbnail.trim()) || '/anhdemo.png',
      description: (description || '').trim(),
      isNew: isNew === undefined ? true : Boolean(isNew),
      duration: (duration || '').trim()
    });

    await newVideo.save();

    res.status(201).json({
      success: true,
      message: "Đã thêm bài học mới vào kho khóa học!",
      video: newVideo
    });
  } catch (error) {
    console.error("Lỗi thêm video:", error);
    res.status(500).json({ success: false, message: "Không thể thêm bài học vào Database!" });
  }
};
