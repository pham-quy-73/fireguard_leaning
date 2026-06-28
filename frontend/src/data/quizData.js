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
    },
    {
      question: "Khi thoát nạn qua cầu thang bộ chung cư, việc mở cửa thoát nạn hướng ra ngoài cần lưu ý gì?",
      optionA: "Đeo găng tay hoặc dùng vải ướt chạm vào tay nắm cửa trước khi mở để tránh bỏng",
      optionB: "Mở toang cửa ngay lập tức để dòng người phía sau chạy nhanh hơn",
      correct: "A",
      correctMessage: "🟢 Chính xác! Kiểm tra nhiệt độ cửa trước để tránh bị luồng lửa táp ngoài hành lang tạt trúng người và gây bỏng.",
      incorrectMessage: "🔴 Chưa chính xác! Mở toang cửa khi chưa rõ tình hình khói lửa phía ngoài có thể tiếp thêm oxy làm đám cháy bùng lên và tràn dịch khí nóng vào phòng."
    },
    {
      question: "Nếu cửa chính căn hộ chung cư mini đã bị lửa bao vây bên ngoài hành lang, bạn nên làm gì?",
      optionA: "Đóng chặt cửa, chèn khăn ướt vào các khe hở và di chuyển ra ban công/cửa sổ để ra hiệu cứu hộ",
      optionB: "Cố gắng chạy băng qua ngọn lửa lớn ở hành lang để xuống tầng trệt",
      correct: "A",
      correctMessage: "🟢 Chính xác! Khi lối thoát duy nhất bị khóa bởi ngọn lửa lớn, việc phòng thủ trong căn hộ sạch khói và kêu gọi cứu hộ từ ban công là phương án sinh tồn tối ưu.",
      incorrectMessage: "🔴 Chưa chính xác! Băng qua lửa hành lang rất dễ dẫn đến bỏng đường hô hấp, ngạt khói độc và tử vong cực kỳ nhanh chóng."
    },
    {
      question: "Số điện thoại khẩn cấp quốc gia để báo cháy và cứu nạn cứu hộ tại Việt Nam là gì?",
      optionA: "114",
      optionB: "115",
      correct: "A",
      correctMessage: "🟢 Chính xác! 114 là số điện thoại khẩn cấp gọi lực lượng Cảnh sát Phòng cháy chữa cháy và Cứu nạn cứu hộ trực chiến 24/7.",
      incorrectMessage: "🔴 Chưa chính xác! 115 là số điện thoại báo tình huống cấp cứu y tế, còn số báo hỏa hoạn và cứu hộ cứu nạn là 114."
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
    },
    {
      question: "Nếu quần áo bị bắt lửa khi đang chạy thoát hiểm, bạn nên làm gì ngay lập tức?",
      optionA: "Nằm xuống đất, áp hai tay bảo vệ mặt và lăn qua lăn lại để dập lửa",
      optionB: "Chạy thật nhanh để gió thổi tắt ngọn lửa đang bốc lên",
      correct: "A",
      correctMessage: "🟢 Chính xác! Kỹ thuật nằm và lăn trên sàn giúp chặn dưỡng khí tiếp xúc vết cháy trên quần áo, dập lửa an toàn mà không làm bỏng mặt.",
      incorrectMessage: "🔴 Chưa chính xác! Tuyệt đối không chạy khi quần áo cháy vì gió sinh ra khi chạy sẽ tiếp oxy làm ngọn lửa bùng mạnh và lan lên đầu tóc, mặt."
    },
    {
      question: "Điểm yếu lớn nhất dễ gây tử vong hàng đầu ở các khu nhà trọ khi xảy ra hoả hoạn là gì?",
      optionA: "Thiếu lối thoát hiểm thứ hai và khu vực tầng trệt chứa nhiều xe máy",
      optionB: "Hệ thống cách âm phòng trọ quá tốt khiến không nghe thấy tiếng kêu",
      correct: "A",
      correctMessage: "🟢 Chính xác! Hầu hết nhà trọ chỉ có lối đi duy nhất qua cửa chính tầng trệt chứa đầy xe là nguồn xăng dầu cháy dữ dội. Do đó phòng trọ cần thiết lập thêm lối thoát khẩn cấp thứ hai như giếng trời, ban công.",
      incorrectMessage: "🔴 Chưa chính xác! Hệ thống cách âm không phải là vấn đề chính, rủi ro lớn nhất nằm ở cấu trúc khóa kín và bãi đỗ xe tầng trệt dễ bắt cháy hàng loạt."
    },
    {
      question: "Khi di chuyển thoát hiểm trong đêm tối mất điện của vụ cháy phòng trọ, bạn nên làm gì?",
      optionA: "Sờ dọc bức tường để định hướng đường đi và di chuyển cúi thấp người",
      optionB: "Chạy thật nhanh thẳng hướng giữa hành lang để không chạm phải chướng ngại vật",
      correct: "A",
      correctMessage: "🟢 Chính xác! Men theo tường giúp bạn giữ thăng bằng tốt hơn trong bóng tối đầy khói, tránh ngã vào bậc thềm hay khoảng trống nguy hiểm.",
      incorrectMessage: "🔴 Chưa chính xác! Chạy nhanh ở giữa hành lang trong bóng tối dễ đâm vào đồ đạc, té ngã và rơi vào giếng thang hoặc cầu thang mở nguy hiểm."
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
    },
    {
      question: "Khi dập tắt đám cháy thiết bị điện chưa ngắt nguồn bằng bình chữa cháy, loại bình nào thích hợp nhất?",
      optionA: "Bình chữa cháy khí CO2 chuyên dụng cho đám cháy điện",
      optionB: "Bình chữa cháy bằng nước sạch hoặc bọt foam dẫn điện",
      correct: "A",
      correctMessage: "🟢 Chính xác! Khí CO2 hóa lỏng cách điện tốt, dập tắt lửa nhanh dưới dạng làm ngạt oxy và lạnh sâu mà không làm hỏng vi mạch hoặc gây giật điện.",
      incorrectMessage: "🔴 Chưa chính xác! Nước và bọt foam chứa ion dẫn điện, tuyệt đối không dùng trực tiếp dập lửa điện khi chưa ngắt cầu dao tổng vì nguy cơ truyền điện giật ngược lại người chữa cháy."
    },
    {
      question: "Khi phát hiện một nạn nhân đang bị ngạt khói bất tỉnh trong phòng chứa đám cháy, hành động sơ cấp cứu đầu tiên là gì?",
      optionA: "Đưa nạn nhân ra khu vực an toàn, thoáng mát, giàu khí oxy trước tiên",
      optionB: "Thực hiện hô hấp nhân tạo ngay tại vị trí nạn nhân đang nằm trong phòng đầy khói",
      correct: "A",
      correctMessage: "🟢 Chính xác! Cần cứu nạn nhân ra khỏi vùng khói độc trước để ngăn ngộ độc CO tiếp diễn, sau đó mới tiến hành kiểm tra hô hấp và hồi sức tim phổi CPR ngoài nơi thoáng đãng.",
      incorrectMessage: "🔴 Chưa chính xác! Hô hấp nhân tạo ngay trong phòng ngạt khói vừa không có oxy vừa khiến chính người sơ cứu hít thêm khí độc và nguy hiểm tính mạng."
    },
    {
      question: "Đối với vết bỏng nhiệt đã nổi các bong bóng nước (nốt phỏng), bạn nên xử lý thế nào?",
      optionA: "Giữ nguyên nốt phỏng, tuyệt đối không chọc vỡ bóng nước",
      optionB: "Chọc thủng cho nước chảy ra hết rồi bôi thuốc mỡ lên vết thương",
      correct: "A",
      correctMessage: "🟢 Chính xác! Lớp da phồng rộp đóng vai trò lớp màng sinh học bảo vệ tự nhiên ngăn vi khuẩn xâm nhập vào lớp dưới da sâu hơn. Chọc vỡ sẽ tăng nguy cơ nhiễm trùng nghiêm trọng.",
      incorrectMessage: "🔴 Chưa chính xác! Chọc vỡ nốt phỏng làm mất màng bảo vệ, dễ gây xước da chớt mô và tăng tỷ lệ hoại tử nhiễm trùng tại chỗ."
    }
  ],

  // Bài 4: Chống chập cháy ấm đun nước & xử lý an toàn
  4: [
    {
      question: "Khi phát hiện ấm đun nước bị chập điện và bắt lửa trong bếp, hành động nào sau đây là chính xác và an toàn nhất?",
      optionA: "Tắt công tắc nguồn điện/cầu dao trước, sau đó dùng bình chữa cháy phù hợp",
      optionB: "Tạt ngay một ca nước lớn vào ấm đun nước để dập lửa nhanh chóng",
      correct: "A",
      correctMessage: "🟢 Chính xác! Việc ngắt nguồn điện là tối quan trọng khi xảy ra cháy thiết bị điện để tránh bị điện giật và ngăn đám cháy phát triển, sau đó mới dùng bình chữa cháy dập lửa.",
      incorrectMessage: "🔴 Chưa chính xác! Tuyệt đối không tạt nước vào thiết bị điện đang cắm điện vì nước dẫn điện có thể gây giật và làm cháy nổ nghiêm trọng hơn."
    },
    {
      question: "Sau khi đã dập tắt hoàn toàn đám cháy ấm đun nước, bước tiếp theo bạn cần thực hiện là gì?",
      optionA: "Mở các cửa để thông gió tản khói độc và kiểm tra lại ổ cắm, rút phích điện",
      optionB: "Để nguyên phích cắm điện tại ổ và đi làm việc khác ngay lập tức",
      correct: "A",
      correctMessage: "🟢 Chính xác! Cần mở cửa cho khói độc thoát ra ngoài, đồng thời ngắt kết nối hoàn toàn (rút phích cắm) và kiểm tra kỹ đề phòng lửa âm ỉ bắt cháy trở lại.",
      incorrectMessage: "🔴 Chưa chính xác! Việc không rút phích cắm điện và không kiểm tra lại hiện trường rất dễ khiến dòng điện tiếp tục chập cháy hoặc lửa âm ỉ bùng phát lại."
    },
    {
      question: "Để phòng ngừa việc chập điện cháy nổ đối với ấm siêu tốc đun nước trong gia đình, thói quen nào là đúng?",
      optionA: "Rút phích cắm của ấm ra khỏi ổ cắm điện sau khi đã dùng xong và không để nước tràn ra chân đế",
      optionB: "Cắm phích ấm liên tục 24/24 trong ổ điện để tiện đun bất cứ lúc nào cần",
      correct: "A",
      correctMessage: "🟢 Chính xác! Rút phích cắm ngăn ngừa hiện tượng rò điện âm ỉ từ thiết bị khi không có người giám sát, giữ an toàn tối đa cho căn bếp.",
      incorrectMessage: "🔴 Chưa chính xác! Cắm phích ấm liên tục có thể gây nóng tiếp điểm, tăng nguy cơ đoản mạch tự động khi rơle ấm bị hỏng hoặc ẩm ướt."
    },
    {
      question: "Một chiếc ấm đun nước bị cạn nước nhưng rơle tự ngắt bị hỏng sẽ dẫn đến hiện tượng gì nguy hiểm nhất?",
      optionA: "Ấm sẽ đun liên tục phát nhiệt cực cao làm chảy vỏ nhựa, cháy cuộn dây và bùng phát ngọn lửa",
      optionB: "Ấm tự động đổ thêm nước từ nguồn bên ngoài dự trữ",
      correct: "A",
      correctMessage: "🟢 Chính xác! Rơle hỏng khiến ấm đun khô không tự ngắt được, nhiệt lượng tích tụ quá tải sẽ thiêu cháy mâm nhiệt rồi bén sang toàn bộ ấm kim loại/nhựa gây hỏa hoạn.",
      incorrectMessage: "🔴 Chưa chính xác! Ấm không có cơ chế tự động cấp nước, nó sẽ đun cạn khô nung chảy vật liệu cực kỳ nguy hiểm."
    },
    {
      question: "Khi vệ sinh ấm đun nước điện để không gây chập mạch phát sinh cháy nổ, ta làm thế nào?",
      optionA: "Chỉ lau bên ngoài bằng khăn ẩm và giữ phần chân đế chứa mạch nguồn khô ráo hoàn toàn",
      optionB: "Ngâm cả chiếc ấm siêu tốc ngập sâu vào trong chậu nước để rửa sạch",
      correct: "A",
      correctMessage: "🟢 Chính xác! Không được ngâm ấm siêu tốc điện vào nước vì làm ướt các linh kiện, cuộn dây, mâm nhiệt bên trong gây chập nổ chạm mạch khi cắm điện lại.",
      incorrectMessage: "🔴 Chưa chính xác! Ngâm ấm vào nước sẽ làm nước đọng lại các mạch điện bên trong, gây chạm mạch đoản điện nổ nguy hiểm lúc kết nối điện sử dụng."
    }
  ]
};

// Lấy bộ câu hỏi của một bài; nếu bài chưa có thì trả mảng rỗng
export const getQuizForVideo = (videoId) => QUIZ_BY_VIDEO[videoId] || [];
