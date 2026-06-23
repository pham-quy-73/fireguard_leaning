// Ngân hàng câu hỏi trắc nghiệm PCCC, gắn theo từng bài học (videoId).
// Mỗi bài có bộ câu riêng phù hợp ngữ cảnh nội dung của bài đó.

export const QUIZ_BY_VIDEO = {
  // Bài 1: Cháy chung cư mini & kỹ năng thoát nạn an toàn
  1: [
    {
      question: "Khi xảy ra cháy nhà cao tầng, bạn nên sử dụng phương tiện di chuyển nào để thoát hiểm?",
      optionA: "Thang máy tiện lợi nhanh chóng",
      optionB: "Thang bộ thoát hiểm kiên cố cách nhiệt",
      correct: "B",
      correctMessage: "🟢 Chính xác! Thang bộ thoát hiểm là lối thoát khẩn cấp an toàn nhất, được thiết kế chịu lực và ngăn khói độc tốt. Tránh dùng thang máy vì hỏa hoạn có thể gây cắt điện đột ngột và mắc kẹt cabin độc!",
      incorrectMessage: "🔴 Chưa chính xác! Trong trường hợp hỏa hoạn tuyệt đối KHÔNG sử dụng thang máy vì hệ thống điện có thể bị ngắt đột ngột gây kẹt cabin và khói độc dễ tràn vào giếng thang máy gây ngạt thở."
    },
    {
      question: "Nếu bị mắc kẹt trong phòng đầy khói độc của đám cháy, tư thế di chuyển nào là an toàn nhất cho bạn?",
      optionA: "Cúi thật thấp người hoặc bò sát mặt đất",
      optionB: "Chạy thẳng người thật nhanh ra ngoài",
      correct: "A",
      correctMessage: "🟢 Chính xác! Khói độc và khí nóng nhẹ hơn không khí nên sẽ bay lơ lửng ở phần sát trần nhà. Di chuyển sát mặt đất sẽ giúp bạn thở được luồng dưỡng khí mát lành hơn ở phía dưới!",
      incorrectMessage: "🔴 Chưa chính xác! Chạy thẳng đứng sẽ làm đầu bạn đi thẳng vào vùng khói độc siêu đậm đặc nguy hiểm nhất, làm suy hô hấp và ngất xỉu chỉ trong vài giây."
    }
  ],

  // Bài 2: Thoát hiểm giữa đêm đông - sinh tồn trong vụ cháy phòng trọ
  2: [
    {
      question: "Khi thoát hiểm xuyên qua vùng khói lửa dày đặc, bạn nên bảo vệ đường hô hấp bằng cách nào?",
      optionA: "Dùng tay khô che miệng mũi",
      optionB: "Dùng khăn hoặc vải tẩm ướt bịt kín miệng mũi",
      correct: "B",
      correctMessage: "🟢 Chính xác! Khăn ướt đóng vai trò như chiếc khẩu trang sinh học tinh lọc bớt bụi mịn, tàn tro nguy hiểm và hạ nhiệt cho luồng không khí nóng bạn hít thở vào phổi!",
      incorrectMessage: "🔴 Chưa chính xác! Bàn tay khô không thể lọc được các hạt khói mịn độc hại và tàn tro nguy kịch, bạn vẫn hít trực tiếp khí độc vào cơ thể."
    },
    {
      question: "Trước khi vội vã mở bất cứ cánh cửa phòng nào để tháo chạy ra hành lang trong đám cháy, bạn nên kiểm tra thế nào?",
      optionA: "Dùng mu bàn tay chạm thử vào bề mặt tay nắm cửa",
      optionB: "Đẩy thật mạnh mở toang cửa để nhìn bên ngoài",
      correct: "A",
      correctMessage: "🟢 Chính xác! Chạm mu bàn tay vào tay nắm cửa giúp cảm nhận nhiệt phòng bên. Nếu tay nắm nóng bỏng, chứng tỏ lửa lớn hoành hành đang bao vây bên ngoài, tuyệt đối không được mở!",
      incorrectMessage: "🔴 Chưa chính xác! Đẩy toang cửa không kiểm tra sẽ lập tức tạo luồng gió hút khí nóng oxy, làm lửa tạt thẳng vào cơ thể gây bỏng sâu nghiêm trọng."
    }
  ],

  // Bài 3: Sơ cứu bỏng nhiệt & ngạt khói, xử lý cháy điện
  3: [
    {
      question: "Khi có đám cháy nhỏ phát sinh do chập thiết bị điện trong nhà, việc đầu tiên bạn bắt buộc phải làm là gì?",
      optionA: "Dội một xô nước lạnh thật lớn để dập tắt lửa",
      optionB: "Tìm và ngắt ngay cầu dao điện/Aptomat chính của nhà",
      correct: "B",
      correctMessage: "🟢 Chính xác! Việc cắt nguồn điện là bước ưu tiên cấp thiết hàng đầu để chặn đứng dòng sinh nhiệt tiếp diễn và đảm bảo tuyệt đối an toàn không bị điện giật xung quanh!",
      incorrectMessage: "🔴 Chưa chính xác! Dội nước vào đám cháy điện cực kỳ nguy hiểm, nước dẫn điện sẽ gây hiện tượng nổ tung thiết bị và truyền điện xung quanh gây giật chết người."
    },
    {
      question: "Khi sơ cứu nạn nhân bị bỏng nhiệt, bước xử lý đúng tại chỗ trong những phút đầu là gì?",
      optionA: "Làm mát vết bỏng dưới vòi nước sạch mát 15-20 phút",
      optionB: "Bôi ngay kem đánh răng hoặc nước mắm lên vết bỏng",
      correct: "A",
      correctMessage: "🟢 Chính xác! Làm mát vết bỏng bằng nước sạch mát giúp hạ nhiệt mô, giảm độ sâu tổn thương và dịu đau. Tuyệt đối không bôi các chất dân gian dễ gây nhiễm trùng!",
      incorrectMessage: "🔴 Chưa chính xác! Bôi kem đánh răng, nước mắm hay mỡ trăn lên vết bỏng làm bít nhiệt, tăng nguy cơ nhiễm trùng và khiến bác sĩ khó xử lý vết thương về sau."
    }
  ]
};

// Lấy bộ câu hỏi của một bài; nếu bài chưa có thì trả mảng rỗng
export const getQuizForVideo = (videoId) => QUIZ_BY_VIDEO[videoId] || [];
