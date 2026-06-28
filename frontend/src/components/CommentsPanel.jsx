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

const renderStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

// Convert a stored timestamp into a friendly Vietnamese relative time
const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((Date.now() - then) / 1000);
  if (diffSec < 60) return 'Vừa xong';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

// Map a raw DB post into the shape the UI cards expect
const mapPost = (p, myId) => ({
  id: p._id,
  userId: p.userId ? String(p.userId) : null,
  name: p.userName,
  avatar: (p.avatarLetter || p.userName?.charAt(0) || 'A').toUpperCase(),
  role: p.role || 'Học viên',
  rating: p.rating || 5,
  time: formatRelativeTime(p.createdAt),
  verified: p.verified,
  content: p.content,
  isMe: !!(myId && p.userId && String(p.userId) === String(myId)),
  replies: (p.replies || []).map((r) => ({
    id: r._id,
    name: r.userName,
    avatar: (r.avatarLetter || r.userName?.charAt(0) || 'A').toUpperCase(),
    role: r.role || 'Học viên',
    content: r.content,
    time: formatRelativeTime(r.createdAt),
    isMe: !!(myId && r.userId && String(r.userId) === String(myId)),
  })),
});

// Emergency hotlines shown in the floating box (name + number only, no logos)
const EMERGENCY_NUMBERS = [
  { label: 'Công an', phone: '113' },
  { label: 'Cứu hỏa', phone: '114' },
  { label: 'Cấp cứu', phone: '115' },
];

// Floating emergency-number box pinned to the right of the screen
function EmergencyBox() {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`emergency-box${open ? '' : ' emergency-box-collapsed'}`}>
      <button
        type="button"
        className="emergency-box-toggle"
        onClick={() => setOpen((v) => !v)}
        title={open ? 'Thu gọn' : 'Mở rộng'}
      >
        <span className="emergency-box-title">
          <span className="emergency-box-dot"></span>
          Khẩn cấp
        </span>
        <span className="emergency-box-caret">{open ? '▸' : '◂'}</span>
      </button>
      {open && (
        <ul className="emergency-list">
          {EMERGENCY_NUMBERS.map((e) => (
            <li key={e.phone} className="emergency-item">
              <a href={`tel:${e.phone}`} className="emergency-link">
                <span className="emergency-label">{e.label}</span>
                <span className="emergency-phone">{e.phone}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default function Forum({ user, showToast }) {
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [totalStudents, setTotalStudents] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // id of comment being replied to
  const [replyDraft, setReplyDraft] = useState('');
  const listRef = useRef(null);

  // Load forum posts from MongoDB on mount; seed defaults only if board is empty
  useEffect(() => {
    let cancelled = false;
    const loadPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/forum`);
        if (cancelled) return;
        if (res.data?.success && res.data.posts.length > 0) {
          setComments(res.data.posts.map((p) => mapPost(p, user?.id || user?._id)));
        } else {
          setComments(INITIAL_COMMENTS);
        }
      } catch (err) {
        if (!cancelled) setComments(INITIAL_COMMENTS);
      }
    };
    loadPosts();
    return () => { cancelled = true; };
  }, [user]);

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
  const myId = user?.id || user?._id;
  const isAdmin = user?.role === 'admin';

  const handlePost = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || posting) return;

    setPosting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/forum`, {
        userId: user?.id || null,
        userName: myName,
        avatarLetter: myInitial,
        role: myRole,
        rating: 5,
        content: text,
      });

      if (res.data?.success) {
        const saved = { ...mapPost(res.data.post, user?.id || user?._id), isMe: true, isNew: true };
        setComments((prev) => [saved, ...prev.map((c) => ({ ...c, isNew: false }))]);
        setDraft('');
        if (listRef.current) listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        if (showToast) showToast(res.data.message || 'Đã đăng bình luận lên Diễn đàn!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể đăng bình luận. Vui lòng thử lại!';
      if (showToast) showToast(msg, 'error');
    } finally {
      setPosting(false);
    }
  };

  // Open/close the reply box for a given comment (frontend-only replies)
  const toggleReply = (commentId) => {
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
    setReplyDraft('');
  };

  // Gửi trả lời -> lưu DB để F5 không mất
  const handleReplySubmit = async (commentId) => {
    const text = replyDraft.trim();
    if (!text) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/forum/${commentId}/reply`, {
        userId: myId || null,
        userName: myName,
        avatarLetter: myInitial,
        role: myRole,
        content: text,
      });
      if (res.data?.success) {
        const updated = mapPost(res.data.post, myId);
        setComments((prev) => prev.map((c) => (c.id === commentId ? { ...updated, isNew: c.isNew } : c)));
        setReplyDraft('');
        setReplyingTo(null);
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Không thể gửi trả lời!', 'error');
    }
  };

  // Thu hồi bình luận của mình (hoặc admin) -> xóa ở DB
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/auth/forum/${commentId}`, { data: { userId: myId } });
      if (res.data?.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        if (showToast) showToast(res.data.message || 'Đã thu hồi bình luận!', 'success');
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Không thể thu hồi bình luận!', 'error');
    }
  };

  // Thu hồi trả lời của mình (hoặc admin) -> xóa ở DB
  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/auth/forum/${commentId}/reply/${replyId}`, { data: { userId: myId } });
      if (res.data?.success) {
        const updated = mapPost(res.data.post, myId);
        setComments((prev) => prev.map((c) => (c.id === commentId ? { ...updated, isNew: c.isNew } : c)));
        if (showToast) showToast(res.data.message || 'Đã thu hồi trả lời!', 'success');
      }
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Không thể thu hồi trả lời!', 'error');
    }
  };

  return (
    <div className="forum-view">
      <div className="forum-header">
        <div className="forum-title-row">
          <div className="forum-live-dot"></div>
          <h1 className="forum-title">Diễn đàn FIREGUARD</h1>
        </div>
        <p className="forum-subtitle">
          Nơi học viên chia sẻ kinh nghiệm và đặt câu hỏi về PCCC.
          Đang có{' '}
          <strong className="forum-subtitle-strong">
            {formatCount(totalStudents)}
          </strong>{' '}
          học viên cùng tham gia.
        </p>
        <div className="forum-stats-bar">
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
          placeholder="Chia sẻ trải nghiệm hoặc đặt câu hỏi về PCCC..."
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          type="submit"
          className="forum-compose-submit"
          disabled={!draft.trim() || posting}
        >
          {posting ? 'Đang đăng...' : 'Đăng'}
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
                  {c.isMe && <span className="forum-me-badge">Bạn</span>}
                </div>
                <span className="forum-role">
                  {c.role} · {c.time}
                </span>
              </div>
            </div>
            <p className="forum-text">{c.content}</p>

            {c.replies && c.replies.length > 0 && (
              <div className="forum-replies">
                {c.replies.map((r) => (
                  <div key={r.id} className="forum-reply">
                    <div className="forum-reply-avatar">{r.avatar}</div>
                    <div className="forum-reply-body">
                      <div className="forum-reply-head">
                        <span className="forum-reply-name">{r.name}</span>
                        {r.isMe && <span className="forum-me-badge">Bạn</span>}
                        <span className="forum-reply-time">· {r.time}</span>
                        {(r.isMe || isAdmin) && (
                          <button
                            type="button"
                            className="forum-delete-btn"
                            title="Thu hồi trả lời"
                            onClick={() => handleDeleteReply(c.id, r.id)}
                          >
                            ↩ Thu hồi
                          </button>
                        )}
                      </div>
                      <p className="forum-reply-text">{r.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="forum-card-actions">
              <button
                type="button"
                className="forum-reply-btn"
                onClick={() => toggleReply(c.id)}
              >
                {replyingTo === c.id ? 'Hủy' : '↩ Trả lời'}
              </button>
              {(c.isMe || isAdmin) && (
                <button
                  type="button"
                  className="forum-delete-btn"
                  title="Thu hồi bình luận"
                  onClick={() => handleDeleteComment(c.id)}
                >
                  ↩ Thu hồi
                </button>
              )}
            </div>

            {replyingTo === c.id && (
              <div className="forum-reply-compose">
                <div className="forum-reply-avatar">{myInitial}</div>
                <textarea
                  className="forum-reply-input"
                  placeholder={`Trả lời ${c.name}...`}
                  rows={1}
                  autoFocus
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit(c.id);
                    }
                  }}
                />
                <button
                  type="button"
                  className="forum-reply-send"
                  disabled={!replyDraft.trim()}
                  onClick={() => handleReplySubmit(c.id)}
                >
                  Gửi
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      <EmergencyBox />
    </div>
  );
}
