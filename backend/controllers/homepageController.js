const HomepageConfig = require('../models/HomepageConfig');

exports.getHomepageConfig = async (req, res) => {
  try {
    let config = await HomepageConfig.findOne({ key: 'main' });
    if (!config) {
      const defaultConfig = new HomepageConfig({
        key: 'main',
        heroTitle: 'Học cách phòng cháy chữa cháy để bảo vệ bản thân & gia đình',
        heroSubtitle: 'Hệ thống học tập tương tác giúp bạn nắm vững kỹ năng PCCC chỉ trong 30 phút mỗi ngày — qua các kịch bản cháy nổ thực tế tại chung cư, phòng trọ và nơi làm việc.',
        featuredLessons: [
          {
            id: 1,
            icon: "🏢",
            category: "Cơ bản",
            title: "Mô phỏng cháy chung cư mini & kỹ năng thoát nạn",
            desc: "Vào vai Nam — sinh viên sống tại tầng 3, đưa ra quyết định sống còn trong từng giai đoạn của vụ cháy."
          },
          {
            id: 2,
            icon: "🔥",
            category: "Thoát hiểm",
            title: "Sinh tồn trong vụ cháy phòng trọ giữa đêm",
            desc: "Bình nóng lạnh phát nổ, khói độc bao trùm — phản xạ sinh tử trong căn phòng 20m²."
          },
          {
            id: 3,
            icon: "🩹",
            category: "Sơ cứu",
            title: "Sơ cứu bỏng nhiệt & ngạt khói trong 5 phút đầu",
            desc: "Nhận biết cháy điện, tránh sai lầm hắt nước, dùng bình CO2 đúng cách để bảo vệ tính mạng."
          }
        ],
        features: [
          {
            iconKey: "PlayMenuIcon",
            title: "Bài học tương tác H5P",
            desc: "Kịch bản rẽ nhánh đưa bạn vào tình huống thật. Mỗi lựa chọn dẫn đến một hệ quả khác nhau."
          },
          {
            iconKey: "QuestionMarkIcon",
            title: "Kiểm tra sau mỗi bài",
            desc: "Câu hỏi bám sát tình huống khẩn cấp, chốt chắc kiến thức và đánh dấu bài học hoàn thành."
          },
          {
            iconKey: "ChatBubbleIcon",
            title: "Diễn đàn cộng đồng",
            desc: "Trao đổi kỹ năng PCCC cùng hàng trăm học viên, có huy hiệu xác thực và đánh giá sao."
          },
          {
            iconKey: "NotifyBellIcon",
            title: "Thông báo từ chuyên gia",
            desc: "Cập nhật nhanh các lưu ý an toàn và tình huống thực tế từ Ban quản trị nền tảng."
          }
        ]
      });
      await defaultConfig.save();
      config = defaultConfig;
    }
    return res.status(200).json({ success: true, config });
  } catch (error) {
    console.error("Lỗi lấy cấu hình trang chủ:", error);
    return res.status(500).json({ success: false, message: "Không thể nạp dữ liệu cấu hình trang chủ!" });
  }
};
