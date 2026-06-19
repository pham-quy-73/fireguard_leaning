require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Video = require('./models/Video');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB and seed default videos
connectDB().then(() => {
  seedVideos();
});

const seedVideos = async () => {
  try {
    // Clear all old video lessons as requested
    await Video.deleteMany({});
    
    const defaultVideos = [
      {
        id: 1,
        title: "Tình huống cháy chung cư - Tùng",
        category: "Thoát hiểm",
        categoryKey: "thoat-hiem",
        defaultPercentage: 0,
        isNew: true,
        thumbnail: "/anhdemo.png",
        videoUrl: "https://fireguard.h5p.com/content/1292933141119135919/embed",
        description: "Mô phỏng tình huống cháy chung cư thực tế - Kịch bản tương tác và kỹ năng thoát nạn sinh tồn được xây dựng dựa trên bài học của học viên Tùng."
      },
      {
        id: 2,
        title: "Tình huống cháy trong nhà - Vinh",
        category: "Cơ bản",
        categoryKey: "co-ban",
        defaultPercentage: 0,
        isNew: true,
        thumbnail: "/anhdemo.png",
        videoUrl: "https://fireguard.h5p.com/content/1292933146469393139/embed",
        description: "Kỹ năng thoát hiểm và sinh tồn khi có cháy lớn xảy ra trong không gian nhà riêng khép kín - Bài học tương tác của học viên Vinh."
      },
      {
        id: 3,
        title: "Tình huống cháy chung cư (Mới sửa) - Nam",
        category: "Thoát hiểm",
        categoryKey: "thoat-hiem",
        defaultPercentage: 0,
        isNew: true,
        thumbnail: "/anhdemo.png",
        videoUrl: "https://fireguard.h5p.com/content/1292933229411731469/embed",
        description: "Phiên bản mô phỏng cháy chung cư cao tầng nâng cấp với các kịch bản nguy hiểm thực tế vừa được chỉnh sửa và cập nhật bởi học viên Nam."
      }
    ];

    await Video.insertMany(defaultVideos);
    console.log("Database cleared and seeded with exactly 3 new interactive videos successfully!");
  } catch (error) {
    console.error("Failed to seed new default videos:", error);
  }
};

app.use(cors());
app.use(express.json());

// Routes layer connecting URL to MVC structure
app.use('/api/auth', require('./routes/authRoutes'));

// App Metadata
app.get('/api/metadata', (req, res) => {
  res.json({ 
    message: "Backend is successfully connected!",
    version: "1.0.0",
    databaseStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
