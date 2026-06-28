import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { FiretruckIcon } from './components/Icons';
import Homepage from './components/Homepage';

import { API_BASE_URL } from './config';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ChangePasswordModal from './components/ChangePasswordModal';

// Đồng bộ 4 bài học theo VỊ TRÍ thẻ (ảnh 1..4): tên + link H5P mới. Áp bất kể id/dữ liệu DB.
const NEW_VIDEOS = [
  { title: 'Cháy chung cư mini',  videoUrl: 'https://fireguard.h5p.com/content/1292933141119135919/embed' }, // ảnh 1
  { title: 'Cháy bình nóng lạnh', videoUrl: 'https://fireguard.h5p.com/content/1292933146469393139/embed' }, // ảnh 2
  { title: 'Cháy chung cư',       videoUrl: 'https://fireguard.h5p.com/content/1292933165577314319/embed' }, // ảnh 3
  { title: 'Cháy ấm đun nước',    videoUrl: 'https://fireguard.h5p.com/content/1292933229411731469/embed' }, // ảnh 4
];
const applyVideoUrls = (list) => (Array.isArray(list) ? list.map((v, i) => (NEW_VIDEOS[i] ? { ...v, title: NEW_VIDEOS[i].title, videoUrl: NEW_VIDEOS[i].videoUrl } : v)) : list);

function App() {
  const [view, setView] = useState('home'); // 'home' | 'login' | 'register' | 'videos_dashboard' | 'profile_dashboard'
  const [user, setUser] = useState(null);
  const [pwModalOpen, setPwModalOpen] = useState(false);

  // Auth popup modal mode: null | 'login' | 'register'.
  // Mo dang popup de len trang chu, khoa nen, KHONG cho tat — buoc khach dang ky/dang nhap.
  const [authModal, setAuthModal] = useState(null);

  // Notification Toast state
  const [notification, setNotification] = useState(null);

  // Real student count from DB (for the login banner badge)
  const [totalStudents, setTotalStudents] = useState(null);

  // So luong bai hoc that, lay tu DB qua GET /api/videos
  const [videoCount, setVideoCount] = useState(null);
  // Danh sach khoa hoc that (dong bo phan 'Lo trinh' trang chu voi catalog)
  const [videos, setVideos] = useState([]);
  // Khóa mà khách chọn 'Học ngay' ở trang chủ -> mở đúng bài sau khi đăng nhập
  const [pendingVideoId, setPendingVideoId] = useState(null);

  // Dark mode preference — applied app-wide and persisted across sessions
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  // Khoa cuon nen khi popup dang ky/dang nhap dang mo
  useEffect(() => {
    document.body.style.overflow = authModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [authModal]);

  // setView danh rieng cho trang chu: cac yeu cau login/register se mo popup thay vi chuyen trang
  const openAuthFromHome = (target) => {
    if (user) { setView('videos_dashboard'); return; } // đã đăng nhập -> vào thẳng dashboard
    if (target === 'login' || target === 'register') {
      setAuthModal(target);
    } else {
      setView(target);
    }
  };

  // Khách bấm 'Học ngay' ở 1 khóa cụ thể -> nhớ khóa, mở popup đăng ký; đăng nhập xong mở đúng bài
  const startCourse = (course) => {
    const id = (course && (course.id ?? course._id)) ?? null;
    setPendingVideoId(id);
    if (user) { setView('videos_dashboard'); } // đã đăng nhập -> mở bài ngay
    else { setAuthModal('register'); }
  };

  // setView truyen vao form trong popup: chuyen qua lai login/register, hoac dong popup khi vao dashboard
  const authModalSetView = (target) => {
    if (target === 'login' || target === 'register') {
      setAuthModal(target);
    } else {
      setAuthModal(null);
      setView(target);
    }
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/auth/admin/stats`)
      .then((res) => {
        if (res.data?.success) setTotalStudents(res.data.totalStudents);
      })
      .catch(() => { /* ignore: badge falls back gracefully */ });

    axios.get(`${API_BASE_URL}/api/videos`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.videos)) {
          setVideos(applyVideoUrls(res.data.videos));
          setVideoCount(res.data.videos.length);
        }
      })
      .catch(() => { /* ignore: stat falls back gracefully */ });
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };


  // Check user cookies/local storage session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      // F5/tải lại: giữ nguyên trang đang xem (lưu trong localStorage), không ép về homepage
      const savedView = localStorage.getItem('lastView');
      if (savedView === 'videos_dashboard' || savedView === 'profile_dashboard') {
        setView(savedView);
      }
    }
  }, []);

  // Lưu lại vị trí hiện tại để F5 không mất trang
  useEffect(() => {
    if (view === 'home' || view === 'videos_dashboard' || view === 'profile_dashboard') {
      localStorage.setItem('lastView', view);
    }
  }, [view]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('lastDashboardView');
    setUser(null);
    setView('home');
    showToast('Đã đăng xuất thành công!', 'success');
  };

  // Render Login/Register decorative fire safety banner
  const renderBanner = () => (
    <div className="banner-pane" style={{ flex: '1.2' }}>
      <div className="banner-overlay"></div>
      <div className="banner-content">
        <div className="badge-row">
          <div className="banner-badge">
            <span className="badge-dot"></span>
            {totalStudents !== null
              ? `Tham gia cùng ${totalStudents} học viên`
              : 'Tham gia cùng cộng đồng học viên'}
          </div>
        </div>
        <h2 className="banner-heading">Bảo vệ bản thân và gia đình qua kiến thức chuẩn xác</h2>
        <p className="banner-text">
          Hệ thống học tập tương tác giúp bạn nắm vững kỹ năng phòng cháy chữa cháy chỉ trong 30 phút mỗi ngày.
        </p>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">{videoCount ?? '...'}</span>
            <span className="stat-label">Bài học video</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Hỗ trợ chuyên gia</span>
          </div>
        </div>
      </div>
    </div>
  );

  const isDashboardView = view === 'videos_dashboard' || view === 'profile_dashboard';

  return (
    <div className="fullscreen-layout-container">
      {/* Toast Alert Popups */}
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* AUTH POPUP — de len trang chu, khoa nen, KHONG co nut tat. */}
      {/* Popup Đổi mật khẩu (dùng chung navbar + Cài đặt) */}
      <ChangePasswordModal
        open={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
        user={user}
        showToast={showToast}
      />

      {authModal && (
        <div className="auth-modal-overlay" role="dialog" aria-modal="true">
          <div className="auth-modal-card">
            <button type="button" className="auth-modal-close" onClick={() => setAuthModal(null)} aria-label="Đóng">✕</button>
            <div className="auth-modal-brand">
              <div className="auth-modal-logo">
                <img src="/logo_e.png" alt="FIREGUARD Logo" />
              </div>
              <span className="brand-name">FIREGUARD</span>
            </div>

            {authModal === 'login' ? (
              <Login
                setView={authModalSetView}
                setUser={setUser}
                showToast={showToast}
              />
            ) : (
              <Register
                setView={authModalSetView}
                showToast={showToast}
              />
            )}
          </div>
        </div>
      )}

      {isDashboardView ? (
        <Dashboard
          user={user}
          handleLogout={handleLogout}
          showToast={showToast}
          goHome={() => setView('home')}
          initialView={view === 'profile_dashboard' ? 'settings' : 'discussion'}
          onChangePassword={() => setPwModalOpen(true)}
          pendingVideoId={pendingVideoId}
          clearPendingVideo={() => setPendingVideoId(null)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : view === 'home' ? (
        <Homepage user={user} setView={openAuthFromHome} onLogout={handleLogout} onAccount={() => { localStorage.setItem('lastDashboardView', 'settings'); setView('profile_dashboard'); }} showToast={showToast} onChangePassword={() => setPwModalOpen(true)} onStartLearning={() => { if (user) { localStorage.setItem('lastDashboardView', 'discussion'); setView('videos_dashboard'); } else { setAuthModal('register'); } }} totalStudents={totalStudents} videoCount={videoCount} videos={videos} onStartCourse={startCourse} />
      ) : (
        <div className="fullscreen-layout">
          <div className="auth-container">
            {/* Form pane for Register and Login */}
            <div className="form-pane" style={{ flex: '1', overflowY: 'auto', maxHeight: '90vh' }}>
              <div className="brand-header">
                <div className="brand-icon-box" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                  <img src="/logo_e.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="FIREGUARD Logo" />
                </div>
                <span className="brand-name">FIREGUARD</span>
              </div>

              {view === 'login' ? (
                <Login
                  setView={setView}
                  setUser={setUser}
                  showToast={showToast}
                />
              ) : (
                <Register
                  setView={setView}
                  showToast={showToast}
                />
              )}
            </div>

            {/* Decorative Right Banner */}
            {renderBanner()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
