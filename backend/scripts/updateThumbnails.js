// Cập nhật thumbnail của từng video trong MongoDB bằng 1 khung hình trích từ chính video gốc.
// Cloudinary tự sinh ảnh .jpg từ video (so_4 = khung hình ở giây thứ 4).
// Chạy: node scripts/updateThumbnails.js   (từ thư mục backend)
require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/Video');

// Map theo id video -> frame .jpg trích từ video gốc trên Cloudinary
const VIDEO_FRAME_THUMBS = {
  1: 'https://res.cloudinary.com/dzasig10l/video/upload/so_4,w_640,h_360,c_fill,q_auto/v1782234076/sources-6a1af9db9c0aa_ls6wjr.jpg',
  2: 'https://res.cloudinary.com/dzasig10l/video/upload/so_4,w_640,h_360,c_fill,q_auto/v1782235450/files-6a353f5a413e0_cwbln4.jpg',
  3: 'https://res.cloudinary.com/dzasig10l/video/upload/so_4,w_640,h_360,c_fill,q_auto/v1782231998/sources-6a3533e05595d_mr24j4.jpg',
  4: 'https://res.cloudinary.com/dzasig10l/video/upload/so_4,w_640,h_360,c_fill,q_auto/v1782235650/sources-6a1a9d24d11b2_afpqin.jpg',
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Đã kết nối MongoDB. Đang cập nhật thumbnail...');

    let updated = 0;
    for (const [id, thumbnail] of Object.entries(VIDEO_FRAME_THUMBS)) {
      const res = await Video.updateOne({ id: Number(id) }, { $set: { thumbnail } });
      if (res.matchedCount > 0) {
        updated++;
        console.log(`✓ Video id=${id} -> ${thumbnail}`);
      } else {
        console.log(`• Không tìm thấy video id=${id} (bỏ qua)`);
      }
    }

    console.log(`Hoàn tất: đã cập nhật ${updated} video.`);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi cập nhật thumbnail:', err.message);
    process.exit(1);
  }
})();
