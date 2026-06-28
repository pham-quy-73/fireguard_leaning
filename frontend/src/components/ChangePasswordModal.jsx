import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Popup đổi mật khẩu dùng chung (mở từ navbar trang chủ & trang Cài đặt).
function ChangePasswordModal({ open, onClose, user, showToast }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const close = () => {
    setForm({ current: '', next: '', confirm: '' });
    if (onClose) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const activeId = user?.id || user?._id;
    if (!form.current || !form.next || !form.confirm) {
      showToast && showToast('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }
    if (form.next.length < 6) {
      showToast && showToast('Mật khẩu mới phải dài tối thiểu 6 ký tự!', 'error');
      return;
    }
    if (form.next !== form.confirm) {
      showToast && showToast('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/change-password`, {
        userId: activeId,
        currentPassword: form.current,
        newPassword: form.next,
      });
      if (res.data?.success) {
        showToast && showToast(res.data.message || 'Đổi mật khẩu thành công!', 'success');
        close();
      } else {
        showToast && showToast(res.data?.message || 'Đổi mật khẩu thất bại!', 'error');
      }
    } catch (err) {
      showToast && showToast(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="pw-modal-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="pw-modal-card">
        <button type="button" className="pw-modal-close" onClick={close} aria-label="Đóng">✕</button>
        <h2 className="pw-modal-title">Đổi mật khẩu</h2>

        <form className="pw-modal-form" onSubmit={handleSubmit}>
          <div className="pw-field">
            <div className="pw-field-head">
              <label className="pw-label">Mật khẩu hiện tại</label>
              <button
                type="button"
                className="pw-forgot"
                onClick={() => showToast && showToast('Vui lòng liên hệ quản trị viên để được hỗ trợ đặt lại mật khẩu.', 'info')}
              >
                Quên mật khẩu?
              </button>
            </div>
            <input
              type="password"
              className="pw-input"
              placeholder="Nhập mật khẩu hiện tại"
              autoComplete="current-password"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
            />
          </div>

          <div className="pw-field">
            <label className="pw-label">Mật khẩu mới</label>
            <input
              type="password"
              className="pw-input"
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
              value={form.next}
              onChange={(e) => setForm({ ...form, next: e.target.value })}
            />
          </div>

          <div className="pw-field">
            <label className="pw-label">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              className="pw-input"
              placeholder="Nhập lại mật khẩu mới"
              autoComplete="new-password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </div>

          <div className="pw-modal-actions">
            <button type="button" className="pw-btn-cancel" onClick={close}>Hủy</button>
            <button type="submit" className="pw-btn-submit" disabled={submitting}>
              {submitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
