const mongoose = require('mongoose');

const HomepageConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'main'
  },
  heroTitle: {
    type: String,
    default: 'Học cách phòng cháy chữa cháy để bảo vệ bản thân & gia đình'
  },
  heroSubtitle: {
    type: String,
    default: 'Hệ thống học tập tương tác giúp bạn nắm vững kỹ năng PCCC chỉ trong 30 phút mỗi ngày — qua các kịch bản cháy nổ thực tế tại chung cư, phòng trọ và nơi làm việc.'
  },
  featuredLessons: [
    {
      id: { type: Number, required: true },
      icon: { type: String, default: '' },
      category: { type: String, default: '' },
      title: { type: String, default: '' },
      desc: { type: String, default: '' }
    }
  ],
  features: [
    {
      iconKey: { type: String, default: '' },
      title: { type: String, default: '' },
      desc: { type: String, default: '' }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('HomepageConfig', HomepageConfigSchema);
