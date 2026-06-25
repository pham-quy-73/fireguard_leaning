import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Ngân hàng 5 câu hỏi tình thế khẩn cấp và kiến thức cốt lõi PCCC
const PCCC_QUIZ_POOL = [
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
    question: "Khi thoát hiểm xuyên qua vùng khói lửa dày đặc, bạn nên bảo vệ đường hô hấp bằng cách nào?",
    optionA: "Dùng tay khô che miệng mũi",
    optionB: "Dùng khăn hoặc vải tẩm ướt bịt kín miệng mũi",
    correct: "B",
    correctMessage: "🟢 Chính xác! Khăn ướt đóng vai trò như chiếc khẩu trang sinh học tinh lọc bớt bụi mịn, tàn tro nguy hiểm và hạ nhiệt cho luồng không khí nóng bạn hít thở vào phổi!",
    incorrectMessage: "🔴 Chưa chính xác! Bàn tay khô không thể lọc được các hạt khói mịn độc hại và tàn tro nguy kịch, bạn vẫn hít trực tiếp khí độc vào cơ thể."
  },
  {
    question: "Khi có đám cháy nhỏ phát sinh do chập thiết bị điện trong nhà, việc đầu tiên bạn bắt buộc phải làm là gì?",
    optionA: "Dội một xô nước lạnh thật lớn để dập tắt lửa",
    optionB: "Tìm và ngắt ngay cầu dao điện/Aptomat chính của nhà",
    correct: "B",
    correctMessage: "🟢 Chính xác! Việc cắt nguồn điện là bước ưu tiên cấp thiết hàng đầu để chặn đứng dòng sinh nhiệt tiếp diễn và đảm bảo tuyệt đối an toàn không bị điện giật xung quanh!",
    incorrectMessage: "🔴 Chưa chính xác! Dội nước vào đám cháy điện cực kỳ nguy hiểm, nước dẫn điện sẽ gây hiện tượng nổ tung thiết bị và truyền giương điện xung quanh gây giật chết người."
  },
  {
    question: "Trước khi vội vã mở bất cứ cánh cửa phòng nào để tháo chạy ra hành lang trong đám cháy, bạn nên kiểm tra thế nào?",
    optionA: "Dùng mu bàn tay chạm thử vào bề mặt tay nắm cửa",
    optionB: "Đẩy thật mạnh mở toang cửa để nhìn bên ngoài",
    correct: "A",
    correctMessage: "🟢 Chính xác! Chạm mu bàn tay vào tay nắm cửa giúp cảm nhận nhiệt phòng bên. Nếu tay nắm nóng bỏng, chứng tỏ lửa lớn hoành hoành đang bao vây bên ngoài, tuyệt đối không được mở!",
    incorrectMessage: "🔴 Chưa chính xác! Đẩy toang cửa không kiểm tra sẽ lập tức tạo luồng gió hút khí nóng oxy, làm lửa tạt thẳng vào cơ thể gây bỏng sâu nghiêm trọng."
  }
];

function Classroom({ video, user, onBack, showToast, onComplete }) {
  const [activeTab, setActiveTab] = useState('desc'); // 'desc' | 'reviews' | 'docs'
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [ratingInput, setRatingInput] = useState(5); // Default 5 stars
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Interactive Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizMessage, setQuizMessage] = useState('');
  const [showQuiz, setShowQuiz] = useState(false); // Toggle between Video and Quiz
  const [currentQuiz, setCurrentQuiz] = useState(null); // Trắc nghiệm lựa chọn ngẫu nhiên cho bài học

  // Fetch comments for the specified video from backend on mount or video change
  const fetchComments = async () => {
    if (!video?.id) return;
    setLoadingComments(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/comments/${video.id}`);
      if (response.data.success) {
        setComments(response.data.comments || []);
      }
    } catch (err) {
      console.error("Lỗi nạp bình luận:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
    
    // Tuyển chọn ngẫu nhiên một câu hỏi từ ngân hàng khi đổi video bài học
    if (PCCC_QUIZ_POOL.length > 0) {
      const randomIndex = Math.floor(Math.random() * PCCC_QUIZ_POOL.length);
      setCurrentQuiz(PCCC_QUIZ_POOL[randomIndex]);
    }

    // Reset quiz states when video changes
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setQuizMessage('');
    setShowQuiz(false);
  }, [video]);

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      showToast('Vui lòng viết nội dung bình luận của bạn!', 'error');
      return;
    }

    setSubmittingComment(true);
    try {
      const userName = user?.fullName || 'Học viên ẩn danh';
      const firstChar = userName.charAt(0).toUpperCase();

      const response = await axios.post(`${API_BASE_URL}/api/auth/comments`, {
        videoId: video.id,
        userName,
        avatarLetter: firstChar,
        rating: ratingInput,
        content: commentText.trim()
      });

      if (response.data.success) {
        showToast(response.data.message, 'success');
        setCommentText('');
        setRatingInput(5); // Reset stars
        // Reload comments list from DB to show first
        setComments(prev => [response.data.comment, ...prev]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi gửi bình luận!';
      showToast(msg, 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Quiz submission logic
  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (!selectedQuizOption) {
      showToast('Vui lòng chọn 1 đáp án để nộp!', 'error');
      return;
    }

    if (!currentQuiz) return;

    setQuizSubmitted(true);
    const isCorrect = selectedQuizOption === currentQuiz.correct;

    if (isCorrect) {
      setQuizMessage(currentQuiz.correctMessage);
      showToast('Đáp án hoàn toàn chính xác! +10 điểm kỹ năng.', 'success');
      // Record course completion in live MongoDB database
      if (onComplete && video?.id) {
        onComplete(video.id);
      }

      // Đợi 2 giây để người dùng đọc thông tin giải thích đáp án đúng, sau đó tự điều hướng
      setTimeout(() => {
        setShowQuiz(false); // Quay trở lại màn hình hiển thị H5P/Video chính
        setActiveTab('reviews'); // Tự động chọn Tab "Đánh giá & Thảo luận"
        
        // Thông báo bằng Toast siêu xịn xò
        showToast('Chúc mừng bạn đã hoàn thành bài học! Hãy để lại cảm nghĩ và đánh giá của bạn nhé.', 'success');

        // Cuộn mượt mà (smooth scroll) xuống khu vực bình luận
        const commentBox = document.getElementById('classroom-tabs-content');
        if (commentBox) {
          commentBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 2000);
    } else {
      setQuizMessage(currentQuiz.incorrectMessage);
      showToast('Đáp án chưa chính xác. Vui lòng thử lại!', 'error');
    }
  };

  const getStarText = (stars) => {
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <div className="classroom-grid-layout" style={{ width: '100%', marginTop: '10px' }}>
      {/* LEFT COLUMN: Video Player & description & comments review */}
      <div className="classroom-main-col" style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Back navigation Row */}
        <div
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '15px',
            transition: 'color 0.2s'
          }}
          className="back-hover-red classroom-back-row"
        >
          ← Quay lại kho khóa học
        </div>
        {/* Video Player Box Area */}
        <div className={`video-player-box ${video?.videoUrl?.includes('h5p.com') ? 'h5p-active' : 'normal-active'}`}>
          {showQuiz ? (
            /* Mock Quiz Panel mirroring the quiz in the image exactly! */
            <div className="classroom-quiz-panel" style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f8fafc',
              backgroundImage: 'radial-gradient(ellipse at top, #fee2e2 0%, #f8fafc 70%)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: '#1e293b',
              position: 'relative'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#c2182c',
                fontSize: '0.82rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                marginBottom: '16px',
                letterSpacing: '0.5px'
              }}>
                <span style={{ fontSize: '1.1rem' }}>🚨</span> Tình huống khẩn cấp
              </div>

              <h2 className="classroom-quiz-title" style={{ fontSize: '1.45rem', fontWeight: '800', marginBottom: '24px', lineHeight: '1.4' }}>
                {currentQuiz?.question || "Đang tải câu hỏi trắc nghiệm..."}
              </h2>

              <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '550px' }}>
                <label className="classroom-quiz-option" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  border: selectedQuizOption === 'A' ? '2px solid #cbd5e1' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.98rem',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                }}>
                  <input
                    type="radio"
                    name="quiz"
                    value="A"
                    checked={selectedQuizOption === 'A'}
                    onChange={() => { if (!quizSubmitted) { setSelectedQuizOption('A'); setQuizMessage(''); } }}
                    disabled={quizSubmitted}
                    style={{ accentColor: '#c2182c', width: '16px', height: '16px' }}
                  />
                  A. {currentQuiz?.optionA}
                </label>

                <label className="classroom-quiz-option" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  backgroundColor: '#ffffff',
                  border: selectedQuizOption === 'B' ? '2px solid #cbd5e1' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.98rem',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                }}>
                  <input
                    type="radio"
                    name="quiz"
                    value="B"
                    checked={selectedQuizOption === 'B'}
                    onChange={() => { if (!quizSubmitted) { setSelectedQuizOption('B'); setQuizMessage(''); } }}
                    disabled={quizSubmitted}
                    style={{ accentColor: '#c2182c', width: '16px', height: '16px' }}
                  />
                  B. {currentQuiz?.optionB}
                </label>

                {!quizSubmitted ? (
                  <button
                    type="submit"
                    className="submit-btn"
                    style={{
                      height: '46px',
                      backgroundColor: '#c2182c',
                      borderRadius: '10px',
                      color: 'white',
                      border: 'none',
                      fontWeight: '700',
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                  >
                    Gửi đáp án
                  </button>
                ) : (
                  <div style={{
                    marginTop: '10px',
                    padding: '16px',
                    borderRadius: '10px',
                    backgroundColor: selectedQuizOption === currentQuiz?.correct ? '#ecfdf5' : '#fef2f2',
                    color: selectedQuizOption === currentQuiz?.correct ? '#065f46' : '#991b1b',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    fontWeight: '500'
                  }}>
                    {quizMessage}
                    <button
                      type="button"
                      onClick={() => { 
                        setSelectedQuizOption(null); 
                        setQuizSubmitted(false); 
                        setQuizMessage(''); 
                        // Tráo đổi ngẫu nhiên một câu hỏi hoàn toàn mới từ ngân hàng PCCC
                        const randomIndex = Math.floor(Math.random() * PCCC_QUIZ_POOL.length);
                        setCurrentQuiz(PCCC_QUIZ_POOL[randomIndex]);
                      }}
                      style={{
                        display: 'block',
                        background: 'none',
                        border: 'none',
                        color: selectedQuizOption === currentQuiz?.correct ? '#065f46' : '#991b1b',
                        fontWeight: '750',
                        fontSize: '0.82rem',
                        marginTop: '12px',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      🔄 Thử sức với câu hỏi ngẫu nhiên khác
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            video.videoUrl && (video.videoUrl.startsWith('http') || video.videoUrl.includes('/embed')) ? (
              <iframe
                src={video.videoUrl}
                className="h5p-iframe"
                allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                title={video.title}
                allowFullScreen
                scrolling="no"
                style={{ border: 0, width: "100%", height: "100%", overflow: "hidden" }}
              />
            ) : (
              /* HTML5 Video Player */
              <video
                src={video.videoUrl}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                controls
                autoPlay
              />
            )
          )}
        </div>

        {/* Tab pill-based switcher row to avoid overlapping H5P player elements */}
        <div className="classroom-mode-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '20px', marginTop: '10px' }}>
          <button
            onClick={() => setShowQuiz(false)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: !showQuiz ? '#c2182c' : '#f1f5f9',
              color: !showQuiz ? 'white' : '#475569',
              fontSize: '0.88rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              boxShadow: !showQuiz ? '0 4px 12px rgba(194, 24, 44, 0.2)' : 'none'
            }}
          >
            <span>📺</span> Bài học video
          </button>
          <button
            onClick={() => setShowQuiz(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: showQuiz ? '#c2182c' : '#f1f5f9',
              color: showQuiz ? 'white' : '#475569',
              fontSize: '0.88rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              boxShadow: showQuiz ? '0 4px 12px rgba(194, 24, 44, 0.2)' : 'none'
            }}
          >
            <span>📝</span> Trắc nghiệm PCCC
          </button>
        </div>

        {/* Video Course details pane */}
        <div className="classroom-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span className="video-category-tag co-ban" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>Cơ bản</span>
              <span className="video-category-tag ky-thuat" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>Kỹ thuật</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#1e293b', lineHeight: '1.3' }}>
              {video.title}
            </h1>
          </div>

          {/* Action buttons (Lưu, Chia sẻ) */}

        </div>

        {/* Ratings information */}
        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>
          <span style={{ color: '#fbbf24', letterSpacing: '1px' }}>★★★★★</span>
          <strong style={{ color: '#1e293b' }}>4.9</strong>
          <span>(2,450 đánh giá)</span>
          <span>•</span>
          <span>15,200 học viên đã học</span>
        </div> */}

        {/* Navbar Tabs mockup */}
        <div className="classroom-section-tabs" style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveTab('desc')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'desc' ? '2.5px solid #c2182c' : '2.5px solid transparent',
              color: activeTab === 'desc' ? '#c2182c' : '#64748b',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Mô tả chi tiết
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'reviews' ? '2.5px solid #c2182c' : '2.5px solid transparent',
              color: activeTab === 'reviews' ? '#c2182c' : '#64748b',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Đánh giá & Thảo luận ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'docs' ? '2.5px solid #c2182c' : '2.5px solid transparent',
              color: activeTab === 'docs' ? '#c2182c' : '#64748b',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Tài liệu học tập
          </button>
        </div>

        {/* Tab contents switcher */}
        <div id="classroom-tabs-content">
        {activeTab === 'desc' && (
          <div>
            <p style={{
              fontSize: '0.94rem',
              color: '#475569',
              lineHeight: '1.7',
              marginBottom: '24px'
            }}>
              {video.description}
            </p>

            <div className="classroom-feature-cards" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
              <div style={{
                flex: '1',
                padding: '18px',
                backgroundColor: '#fef2f2',
                borderRadius: '12px',
                border: '1.5px solid #fee2e2',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', color: '#c2182c' }}>🛡️</div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e293b' }}>Chứng nhận quốc gia</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Hoàn thành đạt 80% để nhận chứng chỉ</p>
                </div>
              </div>

              <div style={{
                flex: '1',
                padding: '18px',
                backgroundColor: '#fffbeb',
                borderRadius: '12px',
                border: '1.5px solid #fef3c7',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', color: '#d97706' }}>📝</div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e293b' }}>Ghi chú tương tác</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Hệ thống tự động lưu các mốc quan trọng</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div style={{ padding: '10px 0 30px' }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'between',
              alignItems: 'center'
            }}>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700' }}>📄 Cam kết & Giáo trình kỹ thuật PCCC.pdf</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Dung lượng: 4.8 MB • Định dạng PDF</p>
              </div>
              <button
                onClick={() => showToast('Đang tải tài liệu học tập của bài học!', 'success')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  backgroundColor: '#c2182c',
                  border: 'none',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginLeft: 'auto'
                }}
              >
                Tải xuống
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Reviews and Comment Section (matches design in image perfectly!) */}
        <section style={{ marginTop: '10px', borderTop: activeTab !== 'desc' && activeTab !== 'docs' ? 'none' : '1px solid #f1f5f9', paddingTop: '20px' }}>
          <div className="classroom-discussion-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1e293b' }}>Bình luận & Thảo luận</h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
              Sắp xếp theo: <span style={{ color: '#1e293b', cursor: 'pointer' }}>Mới nhất ▾</span>
            </div>
          </div>

          {/* Interactive Star Rating Selector and Comment box */}
          <div className="classroom-comment-form-row" style={{ display: 'flex', gap: '16px', marginBottom: '30px' }}>
            <div className="profile-widget-avatar" style={{ width: '40px', height: '40px', backgroundColor: '#fee2e2', borderRadius: '50%', flexShrink: '0', display: 'flex', alignItems: 'center', justify: 'center' }}>
              <span className="profile-widget-fallback" style={{ fontSize: '0.9rem' }}>N</span>
            </div>

            <form onSubmit={handleSendComment} style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
              {/* Star rating picker component */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>Đánh giá bài học của bạn:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRatingInput(star)}
                      style={{
                        fontSize: '1.25rem',
                        color: star <= ratingInput ? '#fbbf24' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'color 0.15s'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#e29505' }}>{ratingInput} / 5</span>
              </div>

              {/* Textarea comment box container */}
              <div style={{
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}>
                <textarea
                  rows="3"
                  className="comment-textarea-form"
                  placeholder="Chia sẻ cảm nghĩ hoặc thắc mắc của bạn..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    padding: '16px',
                    fontSize: '0.9rem',
                    color: '#1e293b',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                  disabled={submittingComment}
                />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderTop: '1px solid #f1f5f9',
                  backgroundColor: '#fafbfc'
                }}>
                  <div style={{ display: 'flex', gap: '12px', color: '#94a3b8', fontSize: '1.1rem' }}>
                    <span style={{ cursor: 'pointer' }}>☺</span>
                    <span style={{ cursor: 'pointer' }}>📎</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn classroom-comment-submit"
                style={{
                  height: '40px',
                  width: '130px',
                  backgroundColor: '#c2182c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  alignSelf: 'flex-end',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(194, 24, 44, 0.15)'
                }}
                disabled={submittingComment}
              >
                {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
            </form>
          </div>

          {/* Comment list stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {loadingComments ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Đang nạp các bình luận và đánh giá...</p>
            ) : comments.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nghĩ của bạn!</p>
            ) : (
              comments.map((comm) => (
                <div key={comm._id} style={{ display: 'flex', gap: '16px' }} className="comment-card-item">
                  <div className="profile-widget-avatar" style={{ width: '40px', height: '40px', backgroundColor: '#e0f2fe', borderRadius: '50%', flexShrink: '0', display: 'flex', alignItems: 'center', justify: 'center' }}>
                    <span className="profile-widget-fallback" style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: '700' }}>
                      {comm.avatarLetter}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.88rem', color: '#1e293b' }}>{comm.userName}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {new Date(comm.createdAt).toLocaleDateString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#fbbf24',
                        marginLeft: '5px',
                        backgroundColor: '#fef3c7',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        {comm.rating} ★
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', marginTop: '3px' }}>
                      {comm.content}
                    </p>

                    <div style={{ display: 'flex', gap: '15px', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700', marginTop: '6px' }}>
                      <span style={{ cursor: 'pointer' }} className="like-btn" onClick={() => showToast('Cảm ơn bạn đã thích đóng góp!', 'success')}>
                        👍 {comm.likes || 0} Trả lời
                      </span>
                      <span style={{ cursor: 'pointer' }} onClick={() => showToast('Tính năng trả hồi bài viết sẽ được hỗ trợ sớm.', 'success')}>Phản hồi</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
      </div>
    </div>
  );
}

export default Classroom;
