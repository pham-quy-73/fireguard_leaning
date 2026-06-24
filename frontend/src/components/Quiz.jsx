import React, { useState } from 'react';
import { getQuizForVideo } from '../data/quizData';

// Trang Quiz: chọn một bài học rồi làm bộ câu hỏi gắn riêng cho bài đó.
// Trả lời đúng hết các câu => gọi onComplete(videoId) để lưu tiến độ vào DB.
export default function Quiz({ videos, watchedIds = [], onComplete, showToast }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = (video) => {
    const qs = getQuizForVideo(video.id);
    if (!qs.length) {
      if (showToast) showToast('Bài học này chưa có câu hỏi trắc nghiệm.', 'error');
      return;
    }
    setActiveVideo(video);
    setQuestions(qs);
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setCorrectCount(0);
    setFinished(false);
  };

  const backToList = () => {
    setActiveVideo(null);
    setQuestions([]);
  };

  const q = questions[current];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) {
      if (showToast) showToast('Vui lòng chọn một đáp án!', 'error');
      return;
    }
    setSubmitted(true);
    if (selected === q.correct) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    const isLast = current === questions.length - 1;
    if (isLast) {
      // Hoàn tất bài quiz
      const passedAll = correctCount === questions.length;
      setFinished(true);
      if (passedAll && onComplete && activeVideo?.id) {
        onComplete(activeVideo.id);
      }
    } else {
      setCurrent((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const retry = () => startQuiz(activeVideo);

  // ---------- Màn hình danh sách bài để chọn ----------
  if (!activeVideo) {
    return (
      <div className="quiz-view">
        <div className="quiz-head">
          <h1 className="quiz-head-title">📝 Trắc nghiệm PCCC</h1>
          <p className="quiz-head-desc">
            Chọn một bài học để kiểm tra kiến thức. Trả lời đúng toàn bộ câu hỏi để hoàn thành bài học.
          </p>
        </div>

        <div className="quiz-lesson-grid">
          {videos.map((v) => {
            const count = getQuizForVideo(v.id).length;
            const done = watchedIds.includes(v.id);
            return (
              <div key={v.id} className="quiz-lesson-card">
                <div className="quiz-lesson-top">
                  <span className={`video-category-tag ${v.categoryKey}`}>{v.category}</span>
                  {done && <span className="quiz-done-badge">✓ Đã hoàn thành</span>}
                </div>
                <h3 className="quiz-lesson-title">{v.title}</h3>
                <div className="quiz-lesson-foot">
                  <span className="quiz-lesson-count">{count} câu hỏi</span>
                  <button
                    className="quiz-start-btn"
                    onClick={() => startQuiz(v)}
                    disabled={count === 0}
                  >
                    {count === 0 ? 'Sắp có' : (done ? 'Làm lại' : 'Bắt đầu')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- Màn hình kết quả ----------
  if (finished) {
    const passedAll = correctCount === questions.length;
    return (
      <div className="quiz-view">
        <div className={`quiz-result ${passedAll ? 'pass' : 'fail'}`}>
          <div className="quiz-result-emoji">{passedAll ? '🎉' : '💪'}</div>
          <h2 className="quiz-result-title">
            {passedAll ? 'Hoàn thành xuất sắc!' : 'Cần cố gắng thêm!'}
          </h2>
          <p className="quiz-result-score">
            Bạn trả lời đúng <strong>{correctCount}/{questions.length}</strong> câu
          </p>
          <p className="quiz-result-msg">
            {passedAll
              ? 'Bài học đã được ghi nhận hoàn thành vào hồ sơ học tập của bạn.'
              : 'Trả lời đúng tất cả câu hỏi để hoàn thành bài học này. Thử lại nhé!'}
          </p>
          <div className="quiz-result-actions">
            <button className="quiz-start-btn" onClick={retry}>🔄 Làm lại</button>
            <button className="quiz-ghost-btn" onClick={backToList}>← Chọn bài khác</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Màn hình làm bài ----------
  const isCorrect = selected === q.correct;
  return (
    <div className="quiz-view">
      <div className="quiz-take-head">
        <button className="quiz-back-link" onClick={backToList}>← Quay lại danh sách</button>
        <span className="quiz-progress-label">Câu {current + 1}/{questions.length}</span>
      </div>

      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${((current + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <h2 className="quiz-lesson-name">{activeVideo.title}</h2>

      <div className="quiz-panel">
        <div className="quiz-emergency-tag">🚨 Tình huống khẩn cấp</div>
        <h3 className="quiz-question">{q.question}</h3>

        <form onSubmit={handleSubmit} className="quiz-options">
          {['A', 'B'].map((opt) => {
            const text = opt === 'A' ? q.optionA : q.optionB;
            let cls = 'quiz-option';
            if (submitted) {
              if (opt === q.correct) cls += ' is-correct';
              else if (opt === selected) cls += ' is-wrong';
            } else if (selected === opt) {
              cls += ' is-selected';
            }
            return (
              <label key={opt} className={cls}>
                <input
                  type="radio"
                  name="quiz-opt"
                  value={opt}
                  checked={selected === opt}
                  onChange={() => !submitted && setSelected(opt)}
                  disabled={submitted}
                />
                <span className="quiz-option-letter">{opt}</span>
                <span className="quiz-option-text">{text}</span>
              </label>
            );
          })}

          {!submitted ? (
            <button type="submit" className="quiz-submit-btn">Gửi đáp án</button>
          ) : (
            <>
              <div className={`quiz-feedback ${isCorrect ? 'good' : 'bad'}`}>
                {isCorrect ? q.correctMessage : q.incorrectMessage}
              </div>
              <button type="button" className="quiz-submit-btn" onClick={handleNext}>
                {current === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo →'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
