import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const INITIAL_COMMENTS = [
  {
    id: 'c1',
    name: 'Nguyễn Minh Tuấn',
    avatar: 'MT',
    role: 'Học viên',
    rating: 5,
    time: '2 phút trước',
    verified: true,
    content:
      'Khoá học PCCC ở FIREGUARD rất dễ hiểu, video minh hoạ trực quan. Mình biết cách dùng bình chữa cháy ngay sau bài 1.',
  },
  {
    id: 'c2',
    name: 'Trần Thu Hà',
    avatar: 'TH',
    role: 'Giáo viên cấp 2',
    rating: 5,
    time: '8 phút trước',
    verified: true,
    content:
      'Đem nội dung này vào tiết sinh hoạt cho học sinh, các em hứng thú và làm quiz đạt điểm rất cao.',
  },
  {
    id: 'c3',
    name: 'Lê Quang Huy',
    avatar: 'QH',
    role: 'Quản lý toà nhà',
    rating: 5,
    time: '15 phút trước',
    verified: false,
    content:
      'Đăng ký cho 30 nhân viên bảo vệ học, mỗi bài 5–10 phút, vừa đủ ngắn để học giờ giải lao.',
  },
  {
    id: 'c4',
    name: 'Phạm Khánh Linh',
    avatar: 'KL',
    role: 'Sinh viên',
    rating: 4,
    time: '32 phút trước',
    verified: true,
    content:
      'Phần thoát hiểm khi cháy chung cư rất sát thực tế. Mong sẽ có thêm bài về cháy xe máy.',
  },
  {
    id: 'c5',
    name: 'Đỗ Anh Khoa',
    avatar: 'AK',
    role: 'Phụ huynh',
    rating: 5,
    time: '1 giờ trước',
    verified: true,
    content:
      'Cho con học cùng để biết kỹ năng sống còn. Phụ huynh hoàn toàn yên tâm khi để con học một mình.',
  },
  {
    id: 'c6',
    name: 'Vũ Hoàng Nam',
    avatar: 'HN',
    role: 'Nhân viên văn phòng',
    rating: 5,
    time: '2 giờ trước',
    verified: false,
    content:
      'Cuối khoá có chứng chỉ tham gia, công ty mình dùng để tính điểm thi đua luôn.',
  },
  {
    id: 'c7',
    name: 'Bùi Thị Mai',
    avatar: 'TM',
    role: 'Học viên',
    rating: 5,
    time: '3 giờ trước',
    verified: true,
    content:
      'Giảng viên trả lời comment rất nhanh, câu hỏi nào cũng được giải đáp trong ngày.',
  },
];

const STREAM = [
  {
    name: 'Hoàng Phương',
    avatar: 'HP',
    role: 'Học viên',
    content: 'Vừa hoàn thành bài 5 — quiz vui và sát kiến thức thực tế.',
  },
  {
    name: 'Trịnh Văn Đức',
    avatar: 'VĐ',
    role: 'Lính cứu hoả',
    content: 'Nội dung chuẩn nghiệp vụ, mình recommend cho người mới vào nghề.',
  },
  {
    name: 'Ngô Minh Châu',
    avatar: 'MC',
    role: 'Học viên',
    content: 'UI mượt, mở trên điện thoại cũng được, học được mọi lúc mọi nơi.',
  },
  {
    name: 'Cao Bảo Trân',
    avatar: 'BT',
    role: 'Sinh viên Y',
    content: 'Phần sơ cứu bỏng rất hữu ích cho ngành mình, cảm ơn team.',
  },
  {
    name: 'Lý Thành Đạt',
    avatar: 'TĐ',
    role: 'Học viên',
    content: 'Đang học thử miễn phí, đăng ký account luôn để theo dõi tiến độ.',
  },
  {
    name: 'Đặng Thuỳ Dương',
    avatar: 'TD',
    role: 'Nhân viên HCNS',
    content: 'Tài liệu PDF tải về làm sổ tay nội bộ rất tiện.',
  },
];

const renderStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function Forum({ user, showToast }) {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [draft, setDraft] = useState('');
  const [totalStudents, setTotalStudents] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      const item = STREAM[idx % STREAM.length];
      idx += 1;
      const newComment = {
        id: `live-${Date.now()}`,
        ...item,
        rating: 5,
        time: 'Vừa xong',
        verified: idx % 2 === 0,
        isNew: true,
      };
      setComments((prev) => {
        const updated = prev.map((c) => ({ ...c, isNew: false }));
        return [newComment, ...updated].slice(0, 30);
      });
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Pull live student count from MongoDB; refresh every 60s so the bar reflects new sign-ups
  useEffect(() => {
    let cancelled = false;
    const loadStudents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/admin/stats`);
        if (!cancelled && res.data?.success) {
          setTotalStudents(res.data.totalStudents ?? 0);
        }
      } catch (err) {
        // Offline / unauthorized — leave totalStudents at null so the UI shows a fallback
        if (!cancelled) setTotalStudents((prev) => prev);
      }
    };
    loadStudents();
    const refresh = setInterval(loadStudents, 60000);
    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, []);

  // Reviews count + average rating derived live from the comments list
  const reviewCount = comments.length;
  const avgRating = useMemo(() => {
    if (!comments.length) return 0;
    const sum = comments.reduce((acc, c) => acc + (Number(c.rating) || 0), 0);
    return Math.round((sum / comments.length) * 10) / 10;
  }, [comments]);

  const formatCount = (n) => {
    if (n === null || n === undefined) return '—';
    return n.toLocaleString('vi-VN');
  };

  const myName = user?.fullName || 'Bạn';
  const myInitial = myName.charAt(0).toUpperCase();
  const myRole = user?.role === 'admin' ? 'Quản trị viên' : 'Học viên';

  const handlePost = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const me = {
      id: `me-${Date.now()}`,
      name: myName,
      avatar: myInitial,
      role: myRole,
      rating: 5,
      time: 'Vừa xong',
      verified: true,
      content: text,
      isMe: true,
      isNew: true,
    };
    setComments((prev) => [me, ...prev.map((c) => ({ ...c, isNew: false }))]);
    setDraft('');
    if (listRef.current) listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    if (showToast) showToast('Đã đăng bình luận lên Diễn đàn!', 'success');
  };

  return (
    <div className="forum-view">
      <div className="forum-header">
        <div className="forum-title-row">
          <div className="forum-live-dot"></div>
          <h1 className="forum-title">Diễn đàn FIREGUARD</h1>
        </div>
        <p className="forum-subtitle">
          Nơi học viên chia sẻ kinh nghiệm, đánh giá và đặt câu hỏi về PCCC.
          Đang có{' '}
          <strong className="forum-subtitle-strong">
            {formatCount(totalStudents)}
          </strong>{' '}
          học viên cùng tham gia.
        </p>
        <div className="forum-stats-bar">
          <div className="forum-stat">
            <span className="forum-stat-value">
              {avgRating ? avgRating.toFixed(1) : '0.0'} ★
            </span>
            <span className="forum-stat-label">Điểm trung bình</span>
          </div>
          <div className="forum-stat-divider"></div>
          <div className="forum-stat">
            <span className="forum-stat-value">{formatCount(reviewCount)}</span>
            <span className="forum-stat-label">Đánh giá</span>
          </div>
          <div className="forum-stat-divider"></div>
          <div className="forum-stat">
            <span className="forum-stat-value">
              {formatCount(totalStudents)}
            </span>
            <span className="forum-stat-label">Học viên</span>
          </div>
        </div>
      </div>

      <form className="forum-compose" onSubmit={handlePost}>
        <div className="forum-compose-avatar">{myInitial}</div>
        <textarea
          className="forum-compose-input"
          placeholder="Chia sẻ trải nghiệm, đánh giá hoặc đặt câu hỏi về PCCC..."
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          type="submit"
          className="forum-compose-submit"
          disabled={!draft.trim()}
        >
          Đăng
        </button>
      </form>

      <div className="forum-list" ref={listRef}>
        {comments.map((c) => (
          <article
            key={c.id}
            className={`forum-card${c.isNew ? ' forum-card-new' : ''}${
              c.isMe ? ' forum-card-me' : ''
            }`}
          >
            <div className="forum-card-head">
              <div className="forum-avatar">{c.avatar}</div>
              <div className="forum-meta">
                <div className="forum-name-row">
                  <span className="forum-name">{c.name}</span>
                  {c.verified && (
                    <span className="forum-verified" title="Đã xác minh">
                      ✓
                    </span>
                  )}
                  {c.isMe && <span className="forum-me-badge">Bạn</span>}
                </div>
                <span className="forum-role">
                  {c.role} · {c.time}
                </span>
              </div>
              <div className="forum-stars-row">{renderStars(c.rating)}</div>
            </div>
            <p className="forum-text">{c.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
