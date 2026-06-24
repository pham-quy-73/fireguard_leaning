import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diffSec < 60) return 'Vừa xong';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

export default function Announcements({ user, showToast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.email === 'admin@fireguard.com';

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/announcements`);
        if (!cancelled && res.data?.success) setItems(res.data.announcements);
      } catch (err) {
        // leave empty on failure
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || posting) return;

    setPosting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/announcements`, {
        userId: user?.id || user?._id || null,
        title: title.trim(),
        content: content.trim(),
      });
      if (res.data?.success) {
        setItems((prev) => [res.data.announcement, ...prev]);
        setTitle('');
        setContent('');
        if (showToast) showToast(res.data.message || 'Đã đăng thông báo!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể đăng thông báo!';
      if (showToast) showToast(msg, 'error');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="ann-view">
      <div className="ann-header">
        <div className="ann-title-row">
          <span className="ann-title-icon">📢</span>
          <h1 className="ann-title">Thông báo từ Ban quản trị</h1>
        </div>
        <p className="ann-subtitle">
          Cập nhật chính thức về khóa học, lịch học và các thông tin quan trọng từ FIREGUARD.
        </p>
      </div>

      {isAdmin && (
        <form className="ann-compose" onSubmit={handlePost}>
          <div className="ann-compose-badge">👑 Đăng với tư cách Quản trị viên</div>
          <input
            type="text"
            className="ann-compose-title"
            placeholder="Tiêu đề thông báo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
          />
          <textarea
            className="ann-compose-content"
            placeholder="Nội dung thông báo gửi tới toàn bộ học viên..."
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="ann-compose-submit"
            disabled={!title.trim() || !content.trim() || posting}
          >
            {posting ? 'Đang đăng...' : 'Đăng thông báo'}
          </button>
        </form>
      )}

      <div className="ann-list">
        {loading ? (
          <p className="ann-empty">Đang tải thông báo...</p>
        ) : items.length === 0 ? (
          <p className="ann-empty">Chưa có thông báo nào từ Ban quản trị.</p>
        ) : (
          items.map((a) => (
            <article key={a._id} className={`ann-card${a.pinned ? ' ann-card-pinned' : ''}`}>
              <div className="ann-card-head">
                <span className="ann-card-icon">📢</span>
                <div className="ann-card-meta">
                  <h3 className="ann-card-title">{a.title}</h3>
                  <span className="ann-card-sub">
                    {a.authorName} · {formatRelativeTime(a.createdAt)}
                  </span>
                </div>
                {a.pinned && <span className="ann-pin-badge">📌 Ghim</span>}
              </div>
              <p className="ann-card-content">{a.content}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
