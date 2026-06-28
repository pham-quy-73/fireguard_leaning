// Chỉ cập nhật ĐƯỜNG DẪN VIDEO (link H5P mới) cho 4 bài học, GIỮ NGUYÊN tên/ảnh/dữ liệu khác.
// Map theo id (vị trí) đúng với ảnh trên trang:
//   id1 = ảnh 1 (chung cư mini), id2 = ảnh 2 (bình nóng lạnh),
//   id3 = ảnh 3 (chung cư),      id4 = ảnh 4 (ấm đun nước)
// Chạy:  node scripts/updateVideos.js   (từ thư mục backend)
require('dotenv').config();
const mongoose = require('mongoose');
const Video = require('../models/Video');

const VIDEO_URL_BY_ID = {
  1: 'https://fireguard.h5p.com/content/1292933141119135919/embed',
  2: 'https://fireguard.h5p.com/content/1292933146469393139/embed',
  3: 'https://fireguard.h5p.com/content/1292933165577314319/embed',
  4: 'https://fireguard.h5p.com/content/1292933229411731469/embed',
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Đã kết nối MongoDB. Đang cập nhật link video (giữ nguyên tên)...');

    let updated = 0;
    for (const [id, videoUrl] of Object.entries(VIDEO_URL_BY_ID)) {
      const res = await Video.updateOne({ id: Number(id) }, { $set: { videoUrl } });
      if (res.matchedCount > 0) {
        updated++;
        console.log(`✓ id=${id} -> ${videoUrl}`);
      } else {
        console.log(`• Không tìm thấy video id=${id} (bỏ qua)`);
      }
    }

    console.log(`Hoàn tất: đã cập nhật link cho ${updated}/4 video.`);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi cập nhật link video:', err.message);
    process.exit(1);
  }
})();
