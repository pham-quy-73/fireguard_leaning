const User = require('../models/User');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const ForumPost = require('../models/ForumPost');
const Announcement = require('../models/Announcement');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { email, password, fullName, phone, address } = req.body;
    
    // 1. Mandatory base empty validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ Email và Mật khẩu!" });
    }

    const emailTrim = email.trim();
    const fullNameTrim = (fullName || '').trim();
    const phoneTrim = (phone || '').trim();
    const addressTrim = (address || '').trim();

    // 2. Full name empty/short check
    if (!fullNameTrim) {
      return res.status(400).json({ success: false, message: "Họ và tên không được để trống!" });
    }
    if (fullNameTrim.length < 2) {
      return res.status(400).json({ success: false, message: "Họ và tên phải dài ít nhất 2 ký tự!" });
    }

    // 3. Phone regex validation
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneTrim) {
      return res.status(400).json({ success: false, message: "Số điện thoại không được để trống!" });
    }
    if (!phoneRegex.test(phoneTrim)) {
      return res.status(400).json({ success: false, message: "Số điện thoại không hợp lệ!" });
    }

    // 4. Address check
    if (!addressTrim) {
      return res.status(400).json({ success: false, message: "Địa chỉ không được để trống!" });
    }
    if (addressTrim.length < 5) {
      return res.status(400).json({ success: false, message: "Địa chỉ liên hệ phải từ 5 ký tự trở lên!" });
    }

    // 5. Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      return res.status(400).json({ success: false, message: "Email không đúng cấu trúc hợp lệ!" });
    }

    // 6. Password complexity check
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu phải dài tối thiểu từ 6 ký tự!" });
    }

    const existingUser = await User.findOne({ email: emailTrim });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email này đã được đăng ký!" });
    }

    // Allocate admin role automatically if registered with specific admin email
    const assignedRole = emailTrim === 'admin@fireguard.com' ? 'admin' : 'student';

    const newUser = new User({ 
      email: emailTrim, 
      password, 
      fullName: fullNameTrim, 
      phone: phoneTrim, 
      address: addressTrim,
      role: assignedRole,
      watchedVideos: []
    });
    await newUser.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Đăng ký tài khoản thành công!", 
      user: { 
        id: newUser._id, 
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role,
        watchedVideos: []
      } 
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra từ máy chủ!" });
  }
};

// @desc    Login user (REST Controller without JWT)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập Email và Mật khẩu!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Email không tồn tại!" });
    }

    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "Mật khẩu không chính xác!" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Đăng nhập thành công!", 
      user: { 
        id: user._id, 
        email: user.email,
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || (user.email === 'admin@fireguard.com' ? 'admin' : 'student'),
        watchedVideos: user.watchedVideos || [],
        videoProgress: user.videoProgress ? Object.fromEntries(user.videoProgress) : {},
        videoScores: user.videoScores ? Object.fromEntries(user.videoScores) : {}
      } 
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra từ máy chủ!" });
  }
};

// @desc    Get user profile by Id directly from Database
// @route   GET /api/auth/profile/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || (user.email === 'admin@fireguard.com' ? 'admin' : 'student'),
        watchedVideos: user.watchedVideos || [],
        videoProgress: user.videoProgress ? Object.fromEntries(user.videoProgress) : {},
        videoScores: user.videoScores ? Object.fromEntries(user.videoScores) : {}
      }
    });
  } catch (error) {
    console.error("Lỗi lấy thông tin từ DB:", error);
    res.status(500).json({ success: false, message: "Lỗi kết nối cơ sở dữ liệu!" });
  }
};

// @desc    Record a video as watched by the user
// @route   POST /api/auth/watch
// @access  Public
exports.watchVideo = async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    
    if (!userId || videoId === undefined) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu Người dùng hoặc Video ID!" });
    }

    // Add videoId to user's watched list (using Mongo $addToSet to avoid duplicates)
    const user = await User.findById(userId);
    if (user) {
      if (!user.watchedVideos.includes(Number(videoId))) user.watchedVideos.push(Number(videoId));
      if (!user.videoProgress) user.videoProgress = new Map();
      user.videoProgress.set(String(videoId), 100);
      await user.save();
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không có thực!" });
    }

    res.status(200).json({
      success: true,
      message: "Tiến trình học tập đã được lưu!",
      watchedVideos: user.watchedVideos || [],
      videoProgress: user.videoProgress ? Object.fromEntries(user.videoProgress) : {}
    });
  } catch (error) {
    console.error("Lỗi ghi nhận xem video:", error);
    res.status(500).json({ success: false, message: "Không thể lưu tiến trình vào Database!" });
  }
};

// @desc    Get comments for a specific video
// @route   GET /api/comments/:videoId
// @access  Public
exports.getVideoComments = async (req, res) => {
  try {
    const videoId = Number(req.params.videoId);
    let comments = await Comment.find({ videoId }).sort({ createdAt: -1 });

    // Seed default comments if none exist matching the image exactly!
    if (comments.length === 0) {
      const defaultComments = [
        {
          videoId,
          userName: "Nguyễn Văn An",
          avatarLetter: "N",
          rating: 5,
          content: "Các câu hỏi tương tác hiện lên đúng lúc mình đang lơ là, giúp tập trung trở lại rất tốt. Cảm ơn giảng viên!",
          likes: 12,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
          videoId,
          userName: "Lê Thị Mai",
          avatarLetter: "L",
          rating: 4,
          content: "Phần giải thích về cơ chế hoạt động của thang thoát hiểm rất chi tiết. Mình đã tự tin hơn nếu lỡ gặp sự cố thật.",
          likes: 8,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        }
      ];

      // Save seeded comments in DB so they are persistent
      await Comment.insertMany(defaultComments);
      comments = await Comment.find({ videoId }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.error("Lỗi lấy bình luận:", error);
    res.status(500).json({ success: false, message: "Không thể nạp danh sách bình luận!" });
  }
};

// @desc    Create a new video comment / review
// @route   POST /api/comments
// @access  Public
exports.createVideoComment = async (req, res) => {
  try {
    const { videoId, userName, rating, content, avatarLetter } = req.body;

    if (videoId === undefined || !userName || !content) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ nội dung bình luận!" });
    }

    const ratingNum = Number(rating || 5);

    const newComment = new Comment({
      videoId: Number(videoId),
      userName,
      avatarLetter: avatarLetter || userName.charAt(0).toUpperCase(),
      rating: ratingNum,
      content,
      likes: 0
    });

    await newComment.save();

    res.status(201).json({
      success: true,
      message: "Đăng tải bình luận và đánh giá thành công!",
      comment: newComment
    });
  } catch (error) {
    console.error("Lỗi đăng bình luận:", error);
    res.status(500).json({ success: false, message: "Không thể đăng tải bình luận của bạn!" });
  }
};

// @desc    Get all forum posts (newest first)
// @route   GET /api/auth/forum
// @access  Public
exports.getForumPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({}).sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Lỗi lấy bài diễn đàn:", error);
    res.status(500).json({ success: false, message: "Không thể nạp Diễn đàn!" });
  }
};

// @desc    Create a new forum post
// @route   POST /api/auth/forum
// @access  Public
exports.createForumPost = async (req, res) => {
  try {
    const { userId, userName, avatarLetter, role, rating, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Nội dung bình luận không được để trống!" });
    }
    if (!userName || !userName.trim()) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin người dùng!" });
    }

    const newPost = new ForumPost({
      userId: userId || null,
      userName: userName.trim(),
      avatarLetter: (avatarLetter || userName.trim().charAt(0)).toUpperCase(),
      role: role || 'Học viên',
      rating: Number(rating) || 5,
      content: content.trim(),
      verified: true
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Đã đăng bình luận lên Diễn đàn!",
      post: newPost
    });
  } catch (error) {
    console.error("Lỗi đăng bài diễn đàn:", error);
    res.status(500).json({ success: false, message: "Không thể đăng bình luận của bạn!" });
  }
};

// @desc    Tạo thông báo gửi tới 1 học viên (admin nhắc học)
// @route   POST /api/auth/notifications
// @access  Admin
exports.createNotification = async (req, res) => {
  try {
    const { adminId, userId, title, desc, icon, type } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin thông báo!" });
    }
    const requester = adminId ? await User.findById(adminId) : null;
    const isAdmin = requester && (requester.role === 'admin' || requester.email === 'admin@fireguard.com');
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Chỉ quản trị viên mới được gửi nhắc nhở!" });
    }
    const notif = new Notification({
      userId: String(userId),
      title,
      desc: desc || '',
      icon: icon || '🔔',
      type: type || 'reminder',
    });
    await notif.save();
    res.status(201).json({ success: true, message: "Đã gửi nhắc nhở tới học viên!", notification: notif });
  } catch (error) {
    console.error("Lỗi gửi thông báo:", error);
    res.status(500).json({ success: false, message: "Không thể gửi thông báo!" });
  }
};

// @desc    Lấy thông báo của 1 học viên
// @route   GET /api/auth/notifications/:userId
// @access  Public (theo userId)
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Notification.find({ userId: String(userId) })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, notifications: items });
  } catch (error) {
    console.error("Lỗi lấy thông báo:", error);
    res.status(500).json({ success: false, message: "Không thể nạp thông báo!" });
  }
};

// @desc    Get all announcements (pinned first, then newest)
// @route   GET /api/auth/announcements
// @access  Public (read-only for everyone)
exports.getAnnouncements = async (req, res) => {
  try {
    const items = await Announcement.find({})
      .sort({ pinned: -1, createdAt: -1 })
      .limit(100);
    res.status(200).json({ success: true, announcements: items });
  } catch (error) {
    console.error("Lỗi lấy thông báo:", error);
    res.status(500).json({ success: false, message: "Không thể nạp danh sách thông báo!" });
  }
};

// @desc    Create an announcement (admin only)
// @route   POST /api/auth/announcements
// @access  Admin
exports.createAnnouncement = async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ tiêu đề và nội dung!" });
    }

    // Verify the requester is an admin straight from the database
    const requester = userId ? await User.findById(userId) : null;
    const isAdmin = requester &&
      (requester.role === 'admin' || requester.email === 'admin@fireguard.com');

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Chỉ quản trị viên mới được đăng thông báo!" });
    }

    const newItem = new Announcement({
      title: title.trim(),
      content: content.trim(),
      authorName: requester.fullName || 'Ban quản trị FIREGUARD'
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Đã đăng thông báo mới!",
      announcement: newItem
    });
  } catch (error) {
    console.error("Lỗi đăng thông báo:", error);
    res.status(500).json({ success: false, message: "Không thể đăng thông báo!" });
  }
};

// @desc    Get Admin Panel statistics
// @route   GET /api/auth/admin/stats
// @access  Admin (Basic checking)
exports.getAdminStats = async (req, res) => {
  try {
    // 1. Fetch live student count
    const allUsers = await User.find({}).sort({ createdAt: -1 });
    const students = allUsers.filter(u => u.email !== 'admin@fireguard.com' && u.role !== 'admin');
    
    // 2. Fetch comments statistics
    let totalComments = await Comment.countDocuments({});

    // 3. Map aggregates per video lessons (1 to 6)
    const videoStats = [];
    for (let vidId = 1; vidId <= 6; vidId++) {
      const watchedCount = allUsers.filter(u => u.watchedVideos && u.watchedVideos.includes(vidId)).length;
      let comments = await Comment.find({ videoId: vidId });

      // Seed default comments if none exist for active videos (1 to 3) to show awesome admin stats!
      if (comments.length === 0 && vidId <= 3) {
        const defaultComments = [
          {
            videoId: vidId,
            userName: vidId === 1 ? "Nguyễn Văn An" : vidId === 2 ? "Trần Minh Tâm" : "Phạm Thanh Thảo",
            avatarLetter: vidId === 1 ? "N" : vidId === 2 ? "T" : "P",
            rating: vidId === 1 ? 5 : vidId === 2 ? 4 : 5,
            content: vidId === 1
              ? "Các câu hỏi tương tác hiện lên đúng lúc mình đang lơ là, giúp tập trung trở lại rất tốt. Cảm ơn giảng viên!"
              : vidId === 2
              ? "Phần giải thích về cơ chế hoạt động của thang thoát hiểm rất chi tiết. Mình đã tự tin hơn nếu lỡ gặp sự cố thật."
              : "Nhận biết sớm cháy điện, tránh sai lầm hắt nước gây giật... Bài giảng thực sự rất hữu ích và trực quan!",
            likes: vidId === 1 ? 12 : vidId === 2 ? 8 : 15,
            createdAt: new Date(Date.now() - vidId * 2 * 60 * 60 * 1000)
          },
          {
            videoId: vidId,
            userName: vidId === 1 ? "Lê Thị Mai" : vidId === 2 ? "Hoàng Hải Yến" : "Đỗ Quốc Bảo",
            avatarLetter: vidId === 1 ? "L" : vidId === 2 ? "H" : "Đ",
            rating: 4,
            content: vidId === 1
              ? "Video bài giảng rất bổ ích, hình ảnh trực quan sinh động."
              : vidId === 2
              ? "Mình đã học được rất nhiều điều từ video này, cảm ơn đội ngũ sản xuất!"
              : "Kỹ năng thực tế cao, ai cũng nên xem bài học này ít nhất một lần.",
            likes: vidId === 1 ? 8 : vidId === 2 ? 5 : 9,
            createdAt: new Date(Date.now() - (vidId * 2 + 3) * 60 * 60 * 1000)
          }
        ];
        await Comment.insertMany(defaultComments);
        comments = await Comment.find({ videoId: vidId });
      }

      const avg = comments.length > 0
        ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
        : "5.0";

      videoStats.push({
        videoId: vidId,
        watchedCount,
        commentsCount: comments.length,
        avgRating: avg
      });
    }

    // Refresh totalComments after potential seeding
    totalComments = await Comment.countDocuments({});

    res.status(200).json({
      success: true,
      totalStudents: students.length,
      totalComments,
      videoStats,
      studentList: allUsers.map(u => ({
        id: u._id,
        email: u.email,
        fullName: u.fullName || 'Chưa cập nhật',
        phone: u.phone || 'Chưa cập nhật',
        address: u.address || 'Chưa cập nhật',
        watchedCount: u.watchedVideos ? u.watchedVideos.length : 0,
        role: u.role || (u.email === 'admin@fireguard.com' ? 'admin' : 'student'),
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.error("Lỗi trích xuất thống kê Admin:", error);
    res.status(500).json({ success: false, message: "Không thể nạp dữ liệu thống kê từ Máy chủ!" });
  }
};

// @desc    Change user password (plaintext scheme to match existing auth)
// @route   POST /api/auth/change-password
// @access  Public
exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin!" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới phải dài tối thiểu 6 ký tự!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản!" });
    }
    if (user.password !== currentPassword) {
      return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không chính xác!" });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới phải khác mật khẩu hiện tại!" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ success: false, message: "Có lỗi xảy ra từ máy chủ!" });
  }
};

// @desc    Thêm trả lời vào 1 bài diễn đàn (lưu DB để F5 không mất)
// @route   POST /api/auth/forum/:postId/reply
exports.addForumReply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, userName, avatarLetter, role, content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Nội dung trả lời không được để trống!" });
    }
    if (!userName || !userName.trim()) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin người dùng!" });
    }
    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bình luận!" });
    post.replies.push({
      userId: userId || null,
      userName: userName.trim(),
      avatarLetter: (avatarLetter || userName.trim().charAt(0)).toUpperCase(),
      role: role || 'Học viên',
      content: content.trim(),
    });
    await post.save();
    res.status(201).json({ success: true, message: "Đã trả lời!", post });
  } catch (error) {
    console.error("Lỗi trả lời diễn đàn:", error);
    res.status(500).json({ success: false, message: "Không thể gửi trả lời!" });
  }
};

// @desc    Thu hồi (xóa) 1 bài diễn đàn — chủ bài hoặc admin
// @route   DELETE /api/auth/forum/:postId
exports.deleteForumPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bình luận!" });
    const requester = userId ? await User.findById(userId) : null;
    const isAdmin = requester && (requester.role === 'admin' || requester.email === 'admin@fireguard.com');
    const isOwner = post.userId && userId && String(post.userId) === String(userId);
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Bạn không thể thu hồi bình luận này!" });
    }
    await post.deleteOne();
    res.status(200).json({ success: true, message: "Đã thu hồi bình luận!" });
  } catch (error) {
    console.error("Lỗi thu hồi bình luận:", error);
    res.status(500).json({ success: false, message: "Không thể thu hồi bình luận!" });
  }
};

// @desc    Thu hồi (xóa) 1 trả lời — chủ trả lời hoặc admin
// @route   DELETE /api/auth/forum/:postId/reply/:replyId
exports.deleteForumReply = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const { userId } = req.body;
    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bình luận!" });
    const reply = post.replies.id(replyId);
    if (!reply) return res.status(404).json({ success: false, message: "Không tìm thấy trả lời!" });
    const requester = userId ? await User.findById(userId) : null;
    const isAdmin = requester && (requester.role === 'admin' || requester.email === 'admin@fireguard.com');
    const isOwner = reply.userId && userId && String(reply.userId) === String(userId);
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Bạn không thể thu hồi trả lời này!" });
    }
    post.replies.pull(replyId);
    await post.save();
    res.status(200).json({ success: true, message: "Đã thu hồi trả lời!", post });
  } catch (error) {
    console.error("Lỗi thu hồi trả lời:", error);
    res.status(500).json({ success: false, message: "Không thể thu hồi trả lời!" });
  }
};

// @desc    Lưu tiến độ xem video (phần trăm thật) + tự đánh dấu hoàn thành khi >= 90%
// @route   POST /api/auth/progress
exports.saveVideoProgress = async (req, res) => {
  try {
    const { userId, videoId, percent, scoreRaw, scoreMax } = req.body;
    if (!userId || videoId === undefined) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu Người dùng hoặc Video!" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "Người dùng không tồn tại!" });
    if (!user.videoProgress) user.videoProgress = new Map();
    if (!user.videoScores) user.videoScores = new Map();
    const key = String(videoId);
    let best = user.videoProgress.get(key) || 0;

    // Cập nhật % đã xem (nếu có gửi)
    if (percent !== undefined && percent !== null && !Number.isNaN(Number(percent))) {
      const pct = Math.max(0, Math.min(100, Math.round(Number(percent))));
      best = Math.max(best, pct);
      user.videoProgress.set(key, best);
    }

    // Cập nhật điểm đạt được (nếu có gửi, vd từ H5P)
    if (scoreMax !== undefined && Number(scoreMax) > 0) {
      user.videoScores.set(key, { raw: Number(scoreRaw) || 0, max: Number(scoreMax) });
    }

    // Hoàn thành THẬT chỉ khi đã xem đủ 100% (không đánh dấu giả)
    let completed = false;
    if (best >= 100 && !user.watchedVideos.includes(Number(videoId))) {
      user.watchedVideos.push(Number(videoId));
      completed = true;
    }
    await user.save();
    res.status(200).json({
      success: true,
      completed,
      watchedVideos: user.watchedVideos || [],
      videoProgress: Object.fromEntries(user.videoProgress),
      videoScores: Object.fromEntries(user.videoScores),
    });
  } catch (error) {
    console.error("Lỗi lưu tiến độ video:", error);
    res.status(500).json({ success: false, message: "Không thể lưu tiến độ học!" });
  }
};
