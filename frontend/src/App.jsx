import React, { useState, useEffect } from 'react';
import './App.css';
import { FiretruckIcon } from './components/Icons';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'videos_dashboard' | 'profile_dashboard'
  const [user, setUser] = useState(null);
  
  // Notification Toast state
  const [notification, setNotification] = useState(null);

  // Real student count from DB (for the login banner badge)
  const [totalStudents, setTotalStudents] = useState(null);

  // Số lượng bài học thật, lấy từ DB qua GET /api/videos
  const [videoCount, setVideoCount] = useState(null);

  // Dark mode preference — applied app-wide and persisted across sessions
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((v) => !v);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/auth/admin/stats`)
      .then((res) => {
        if (res.data?.success) setTotalStudents(res.data.totalStudents);
      })
      .catch(() => { /* ignore: badge falls back gracefully */ });

    axios.get(`${API_BASE_URL}/api/videos`)
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.videos)) {
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
      setView('videos_dashboard');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    setView('login');
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
            Tham gia cùng +5000 học viên
          </div>
        </div>
        <h2 className="banner-heading">Bảo vệ bản thân và gia đình qua kiến thức chuẩn xác</h2>
        <p className="banner-text">
          Hệ thống học tập tương tác giúp bạn nắm vững kỹ năng phòng cháy chữa cháy chỉ trong 30 phút mỗi ngày.
        </p>
        
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">100+</span>
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

      {isDashboardView ? (
        <Dashboard 
          user={user} 
          setUser={setUser}
          handleLogout={handleLogout} 
          showToast={showToast} 
        <Dashboard
          user={user}
          handleLogout={handleLogout}
          showToast={showToast}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
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
