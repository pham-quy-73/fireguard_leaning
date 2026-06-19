import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Classroom from './Classroom';
import AdminPanel from './AdminPanel';
import { API_BASE_URL } from '../config';
import {
  PlayMenuIcon,
  GridDashboardIcon,
  HistoryClockIcon,
  VideoManagerIcon,
  SettingsGearIcon,
  SearchIcon,
  NotifyBellIcon,
  ArrowChevronLeftIcon,
  ArrowChevronRightIcon,
  QuestionMarkIcon,
  LogOutIcon,
  MailIcon,
  UserSilhouetteIcon,
  PhoneIcon,
  MapMarkerIcon
} from './Icons';

// Default fallbacks in case database connection fails on startup
const defaultMockVideos = [
  {
    id: 1,
    title: "Tình huống cháy chung cư - Tùng",
    category: "Thoát hiểm",
    categoryKey: "thoat-hiem",
    defaultPercentage: 0,
    isNew: true,
    thumbnail: "/anhdemo.png",
    videoUrl: "https://fireguard.h5p.com/content/1292933141119135919/embed",
    description: "Mô phỏng tình huống cháy chung cư thực tế - Kịch bản tương tác và kỹ năng thoát nạn sinh tồn được xây dựng dựa trên bài học của học viên Tùng."
  },
  {
    id: 2,
    title: "Tình huống cháy trong nhà - Vinh",
    category: "Cơ bản",
    categoryKey: "co-ban",
    defaultPercentage: 0,
    isNew: true,
    thumbnail: "/anhdemo.png",
    videoUrl: "https://fireguard.h5p.com/content/1292933146469393139/embed",
    description: "Kỹ năng thoát hiểm và sinh tồn khi có cháy lớn xảy ra trong không gian nhà riêng khép kín - Bài học tương tác của học viên Vinh."
  },
  {
    id: 3,
    title: "Tình huống cháy chung cư (Mới sửa) - Nam",
    category: "Thoát hiểm",
    categoryKey: "thoat-hiem",
    defaultPercentage: 0,
    isNew: true,
    thumbnail: "/anhdemo.png",
    videoUrl: "https://fireguard.h5p.com/content/1292933229411731469/embed",
    description: "Phiên bản mô phỏng cháy chung cư cao tầng nâng cấp với các kịch bản nguy hiểm thực tế vừa được chỉnh sửa và cập nhật bởi học viên Nam."
  }
];

function Dashboard({ user, handleLogout, showToast }) {
  const [dashboardView, setDashboardView] = useState('videos'); // 'videos' | 'profile'
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Classroom video details state
  const [activeClassroomVideo, setActiveClassroomVideo] = useState(null);

  // Dynamic user details synced from Live Database
  const [dbUser, setDbUser] = useState(null);
  const [fetching, setFetching] = useState(false);

  // Core array representing watched video IDs from live database
  const [watchedIds, setWatchedIds] = useState([]);

  // Video Course catalogue state
  const [videos, setVideos] = useState([]);

  // Fetch all videos from MongoDB server on mount
  const fetchVideosList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/videos`);
      if (response.data.success) {
        setVideos(response.data.videos || []);
      }
    } catch (err) {
      console.error("Lỗi đồng bộ danh sách video từ MongoDB:", err);
      // Fallback
      setVideos(defaultMockVideos);
    }
  };

  useEffect(() => {
    fetchVideosList();
  }, []);

  // Profile Edit fields
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Certificate visible toggle
  const [showCert, setShowCert] = useState(false);

  // Initialize edit fields when dbUser changes
  useEffect(() => {
    if (dbUser) {
      setEditName(dbUser.fullName || '');
      setEditPhone(dbUser.phone || '');
      setEditAddress(dbUser.address || '');
    }
  }, [dbUser]);

  // Profile update submission
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const activeId = user?.id || user?._id;
    if (!activeId) return;

    setSavingProfile(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/profile/update`, {
        userId: activeId,
        fullName: editName,
        phone: editPhone,
        address: editAddress
      });
      if (response.data.success) {
        setDbUser(response.data.user);
        setIsEditing(false);
        showToast('Cập nhật thông tin hồ sơ thành công!', 'success');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin!';
      showToast(errMsg, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // Fetch the latest profile data from Mongoose database on mount or when user changes
  useEffect(() => {
    const fetchLatestProfile = async () => {
      const activeId = user?.id || user?._id;
      if (!activeId) return;

      setFetching(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/profile/${activeId}`);
        if (response.data.success) {
          setDbUser(response.data.user);
          setWatchedIds(response.data.user.watchedVideos || []);
        }
      } catch (err) {
        console.error("Lỗi đồng bộ dữ liệu MongoDB:", err);
        // Fallback to local storage state if connection offline
        setDbUser(user);
        setWatchedIds(user?.watchedVideos || []);
      } finally {
        setFetching(false);
      }
    };

    fetchLatestProfile();
  }, [user]);

  // Sync profile details if changing tabs to profile to always keep accurate numbers
  useEffect(() => {
    const activeId = user?.id || user?._id;
    if (dashboardView === 'profile' && activeId) {
      axios.get(`${API_BASE_URL}/api/auth/profile/${activeId}`)
        .then(response => {
          if (response.data.success) {
            setDbUser(response.data.user);
            setWatchedIds(response.data.user.watchedVideos || []);
            showToast('Thông tin được đồng bộ trực tiếp từ Database!', 'success');
          }
        })
        .catch(err => console.log('Không thể làm mới dữ liệu từ Database'));
    }
  }, [dashboardView]);

  // Direct learner into classroom lesson details view (does not trigger completion)
  const handleWatchVideo = (video) => {
    setActiveClassroomVideo(video);
  };

  // Record a video as completed in live MongoDB database after passing the quiz
  const handleCompleteVideo = async (videoId) => {
    const activeId = user?.id || user?._id;
    if (!activeId) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/watch`, {
        userId: activeId,
        videoId: Number(videoId)
      });
      if (response.data.success) {
        // Sync local watched list
        const updatedWatched = response.data.watchedVideos || [];
        setWatchedIds(updatedWatched);

        // Show success toast on completion
        showToast(`Chúc mừng! Bạn đã trả lời đúng câu hỏi trắc nghiệm và hoàn thành bài học này!`, 'success');
      }
    } catch (err) {
      console.error("Không thể lưu tiến trình học:", err);
    }
  };

  const getFilteredVideos = () => {
    if (activeTab === 'Tất cả') return videos;
    if (activeTab === 'Cơ bản') return videos.filter(v => v.category === 'Cơ bản');
    if (activeTab === 'Chung cư/Nhà cao tầng') return videos.filter(v => v.category === 'Thoát hiểm');
    if (activeTab === 'Thoát hiểm khẩn cấp') return videos.filter(v => v.category === 'Thoát hiểm');
    return videos;
  };

  // Determine active profile parameters (Live DB user details takes priority)
  const activeUser = dbUser || user;
  const displayName = activeUser?.fullName || 'Nguyễn Văn An';
  const phoneText = activeUser?.phone || 'Chưa cập nhật';
  const addressText = activeUser?.address || 'Chưa cập nhật';
  const emailText = activeUser?.email;
  const isAdmin = activeUser?.role === 'admin' || activeUser?.email === 'admin@fireguard.com';
  const roleName = isAdmin ? 'Quản trị viên FIREGUARD' : 'Học viên';
  const firstLetter = displayName.charAt(0).toUpperCase();

  const totalLessons = videos.length || 3;
  const completedCount = Math.min(watchedIds.length, totalLessons);
  const completionPercentage = Math.round((completedCount / totalLessons) * 100);
  const isCertUnlocked = completedCount >= totalLessons && totalLessons > 0;

  const handleSidebarVideosClick = () => {
    setDashboardView('videos');
    setActiveClassroomVideo(null); // Return to catalog grid view
  };

  return (
    <div className="dashboard-wrapper">
      {/* Pop-up Video Modal Player (fallback only, primary is the full Classroom pane) */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedVideo(null)}>✕</button>
            <div className="video-player-wrapper" style={selectedVideo?.videoUrl?.includes('h5p.com') ? { paddingTop: '58.55%', minHeight: '640px' } : {}}>
              {selectedVideo.videoUrl && (selectedVideo.videoUrl.startsWith('http') || selectedVideo.videoUrl.includes('/embed')) ? (
                <iframe
                  src={selectedVideo.videoUrl}
                  className="actual-html5-video"
                  allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                  title={selectedVideo.title}
                  allowFullScreen
                  scrolling="auto"
                  style={{ border: 0, overflow: "auto" }}
                />
              ) : (
                <video
                  src={selectedVideo.videoUrl}
                  className="actual-html5-video"
                  controls
                  autoPlay
                />
              )}
            </div>
            <div className="video-modal-meta">
              <span className={`video-modal-category video-category-tag ${selectedVideo.categoryKey}`}>
                {selectedVideo.category}
              </span>
              <h2 className="video-modal-title">{selectedVideo.title}</h2>
              <p className="video-modal-desc">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand-box">
          <div className="sidebar-logo" style={{ overflow: 'hidden', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
            <img src="/logo_e.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="FIREGUARD Logo" />
          </div>
          <div className="sidebar-brand-name-box">
            <span className="sidebar-brand-title">FIREGUARD</span>
            <span className="sidebar-brand-subtitle">HỌC TẬP TƯƠNG TÁC</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <div
            className={`sidebar-item ${dashboardView === 'videos' ? 'active' : ''}`}
            onClick={handleSidebarVideosClick}
          >
            <PlayMenuIcon />
            Danh sách video
          </div>
          {/* <div
            className={`sidebar-item ${dashboardView === 'profile' ? 'active' : ''}`}
            onClick={() => setDashboardView('profile')}
          >
            <GridDashboardIcon />
            Bảng điều khiển
          </div> */}
          {isAdmin && (
            <div
              className={`sidebar-item ${dashboardView === 'admin' ? 'active' : ''}`}
              onClick={() => setDashboardView('admin')}
              style={{ borderLeft: dashboardView === 'admin' ? '3px solid #fbbf24' : '3px solid transparent' }}
            >
              <span style={{ marginRight: '10px', fontSize: '1rem' }}>👑</span>
              Trang Quản trị
            </div>
          )}
          {/* <div className="sidebar-item" onClick={() => showToast('Tính năng Lịch sử xem sẽ sớm được cập nhật.', 'success')}>
            <HistoryClockIcon />
            Lịch sử xem
          </div>
          <div className="sidebar-item" onClick={() => showToast('Tính năng Quản lý video của bạn.', 'success')}>
            <VideoManagerIcon />
            Quản lý video
          </div>
          <div className="sidebar-item" onClick={() => showToast('Trang Cài đặt hệ thống.', 'success')}>
            <SettingsGearIcon />
            Cài đặt
          </div> */}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-link" onClick={handleLogout}>
            <LogOutIcon />
            Đăng xuất
          </div>
        </div>
      </aside>

      {/* Main Content Panel */}
      <main className="main-content-panel">
        <header className={`content-header ${activeClassroomVideo ? 'classroom-active' : ''}`}>
          <div className="search-box-wrapper">
            <span className="search-bar-icon"><SearchIcon /></span>
            <input
              type="text"
              className="search-bar-input"
              placeholder="Tìm kiếm khóa học, kỹ năng, video..."
              onChange={(e) => showToast(`Tìm kiếm từ khóa "${e.target.value}"`, 'success')}
            />
          </div>

          <div className="header-right-meta">
            <button className="bell-btn" onClick={() => showToast('Không có thông báo mới.', 'success')}>
              <NotifyBellIcon />
              <span className="bell-badge-dot"></span>
            </button>

            <div className="profile-widget" onClick={() => setDashboardView('profile')} style={{ cursor: 'pointer' }}>
              <div className="profile-widget-text">
                <span className="profile-widget-name">{displayName}</span>
                <span className="profile-widget-role">{roleName}</span>
              </div>
              <div className="profile-widget-avatar">
                <div className="profile-widget-fallback">
                  {firstLetter}
                </div>
              </div>
            </div>
          </div>
        </header>

        {dashboardView === 'videos' ? (
          /* Render Classroom page or course catalog list */
          activeClassroomVideo ? (
            <Classroom
              video={activeClassroomVideo}
              user={activeUser}
              onBack={() => setActiveClassroomVideo(null)}
              showToast={showToast}
              onComplete={handleCompleteVideo}
            />
          ) : (
            <div className="dashboard-body">
              <h1 className="grid-heading-title">Kho khóa học PCCC</h1>
              <p className="grid-heading-desc">
                Khám phá các tình huống giả định và hướng dẫn kỹ thuật PCCC chuyên sâu từ các chuyên gia.
              </p>

              {/* Filter Tabs */}
              {/* <div className="filter-tabs-container">
                {['Tất cả', 'Cơ bản', 'Chung cư/Nhà cao tầng', 'Thoát hiểm khẩn cấp'].map((tab) => (
                  <button
                    key={tab}
                    className={`filter-tab-pill ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div> */}

              {/* Catalog Grid */}
              <div className="video-catalog-grid">
                {getFilteredVideos().map((video) => {
                  const isWatched = watchedIds.includes(video.id);
                  // Calculate actual progress status
                  const percentShow = isWatched ? 100 : video.defaultPercentage;
                  const progressText = isWatched ? 'Đã hoàn thành' : (percentShow > 0 ? `Đã xem ${percentShow}%` : 'Chưa bắt đầu');

                  return (
                    <div key={video.id} className="video-catalog-card">
                      <div
                        className="thumbnail-box"
                        style={{ backgroundImage: `url('${video.thumbnail}')` }}
                      >
                        {video.isNew && <span className="thumbnail-badge-status">Mới</span>}
                        <span className="thumbnail-duration-overlay">{video.duration}</span>

                        <div className="play-thumbnail-overlay" onClick={() => handleWatchVideo(video)}>
                          <div className="play-circle-svg-btn">▶</div>
                        </div>
                      </div>

                      <div className="video-meta-body">
                        <div className="badge-row-details">
                          <span className={`video-category-tag ${video.categoryKey}`}>
                            {video.category}
                          </span>
                          {/* <span className="video-stats">{video.views}</span> */}
                        </div>

                        <h3 className="video-card-title">{video.title}</h3>

                        <div className="progress-module">
                          {/* <div className="progress-meta-row">
                            <span className="progress-text">{progressText}</span>
                            {percentShow > 0 && (
                              <span className="progress-percentage">{percentShow}%</span>
                            )}
                          </div> */}

                          <div className="progress-track-bar">
                            <div
                              className="progress-fill-active"
                              style={{
                                width: `${percentShow}%`,
                                backgroundColor: isWatched ? '#10b981' : '#c2182c' // Green if 100% completed!
                              }}
                            ></div>
                          </div>

                          <button
                            className={`watch-action-button ${percentShow === 0 ? 'not-started' : ''}`}
                            onClick={() => handleWatchVideo(video)}
                            style={{
                              borderColor: isWatched ? '#10b981' : '',
                              color: isWatched ? '#10b981' : '',
                              backgroundColor: isWatched ? '#ecfdf5' : ''
                            }}
                          >
                            {isWatched ? '✓ Xem lại bài học' : (percentShow > 0 ? 'Tiếp tục xem' : 'Bắt đầu học')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )
        ) : dashboardView === 'admin' ? (
          <AdminPanel showToast={showToast} videos={videos} onRefreshVideos={fetchVideosList} />
        ) : (
          // Live Database profile card rendering
          <div className="dashboard-body" style={{ padding: '30px 10px' }}>
            {/* Modal Certificate View */}
            {showCert && (
              <div className="cert-modal-overlay" onClick={() => setShowCert(false)}>
                <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="close-modal-btn" 
                    onClick={() => setShowCert(false)}
                    style={{ right: '20px', top: '20px', color: '#64748b', fontSize: '1.25rem', zIndex: 10 }}
                  >
                    ✕
                  </button>
                  <div className="cert-frame-inner">
                    <div style={{ fontSize: '2.5rem' }}>🏆</div>
                    <h2 className="cert-award-title">CHỨNG NHẬN HOÀN THÀNH</h2>
                    <p className="cert-org-sub">HỌC VIỆN AN TOÀN PCCC FIREGUARD</p>
                    
                    <p style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Chứng nhận học viên</p>
                    <h3 className="cert-user-name">{displayName}</h3>
                    
                    <p className="cert-certify-text">
                      Đã hoàn thành xuất sắc toàn bộ khóa đào tạo tương tác kỹ năng phòng cháy chữa cháy,
                      đáp ứng xuất sắc các bài huấn luyện thực hành thoát hiểm qua mô phỏng ảo của FIREGUARD.
                    </p>

                    <div className="cert-footer-row">
                      <div className="cert-sign-col">
                        <div className="cert-sign-img">FIREGUARD</div>
                        <div className="cert-sign-title">Ban tổ chức học tập</div>
                      </div>
                      
                      <div className="cert-seal-gold">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>FIREGUARD</span>
                          <span style={{ fontSize: '0.9rem' }}>★</span>
                          <span style={{ fontSize: '0.45rem', fontWeight: 700 }}>SEAL OF APP</span>
                        </div>
                      </div>

                      <div className="cert-sign-col">
                        <div className="cert-sign-img" style={{ color: '#c2182c', transform: 'rotate(-4deg)' }}>Hoàn Thành</div>
                        <div className="cert-sign-title">Trạng thái khóa học</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="profile-grid-custom">
              {/* Left Column: Profile Card */}
              <div className="profile-card-custom">
                <div className="profile-card-header">
                  <div className="profile-avatar-large">
                    {firstLetter}
                  </div>
                  <h2 className="profile-name-large">{displayName}</h2>
                  <span className="profile-badge-role">{roleName}</span>
                  <p className="profile-meta-subtext">Học viên từ 2026 • Live Database Sync</p>
                </div>

                <form onSubmit={handleSaveProfile} className="profile-info-list">
                  <div className="profile-info-row">
                    <div className="profile-info-icon-wrapper">
                      <MailIcon />
                    </div>
                    <div className="profile-info-content">
                      <span className="profile-info-label">Email đăng nhập</span>
                      <span className="profile-info-val" style={{ color: '#64748b' }}>{emailText}</span>
                    </div>
                  </div>

                  <div className="profile-info-row">
                    <div className="profile-info-icon-wrapper">
                      <UserSilhouetteIcon />
                    </div>
                    <div className="profile-info-content">
                      <span className="profile-info-label">Họ và tên học viên</span>
                      {isEditing ? (
                        <input
                          type="text"
                          className="profile-info-input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        <span className="profile-info-val">{displayName}</span>
                      )}
                    </div>
                  </div>

                  <div className="profile-info-row">
                    <div className="profile-info-icon-wrapper">
                      <PhoneIcon />
                    </div>
                    <div className="profile-info-content">
                      <span className="profile-info-label">Số điện thoại liên hệ</span>
                      {isEditing ? (
                        <input
                          type="text"
                          className="profile-info-input"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                        />
                      ) : (
                        <span className="profile-info-val">{phoneText}</span>
                      )}
                    </div>
                  </div>

                  <div className="profile-info-row">
                    <div className="profile-info-icon-wrapper">
                      <MapMarkerIcon />
                    </div>
                    <div className="profile-info-content">
                      <span className="profile-info-label">Địa chỉ cư trú</span>
                      {isEditing ? (
                        <input
                          type="text"
                          className="profile-info-input"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                        />
                      ) : (
                        <span className="profile-info-val">{addressText}</span>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="profile-action-btn-row">
                      <button
                        type="button"
                        className="btn-profile-secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(displayName);
                          setEditPhone(phoneText);
                          setEditAddress(addressText);
                        }}
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="btn-profile-primary"
                        disabled={savingProfile}
                      >
                        {savingProfile ? 'Đang lưu...' : 'Lưu thông tin'}
                      </button>
                    </div>
                  ) : (
                    <div className="profile-action-btn-row">
                      <button
                        type="button"
                        className="btn-profile-secondary"
                        onClick={() => setIsEditing(true)}
                      >
                        Chỉnh sửa hồ sơ
                      </button>
                      <button
                        type="button"
                        className="btn-profile-primary"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Column: Statistics and Cert Panel */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Learning Stats Subcard */}
                <div className="profile-card-custom stats-subcard">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '20px', color: '#1e293b' }}>
                    Tiến độ hoàn thành khóa học
                  </h3>

                  <div className="stats-card-progress">
                    <div className="progress-circle-wrapper">
                      <svg className="progress-circle-svg">
                        <circle className="progress-circle-bg" cx="45" cy="45" r="35" />
                        <circle 
                          className="progress-circle-fill" 
                          cx="45" 
                          cy="45" 
                          r="35" 
                          strokeDasharray={2 * Math.PI * 35}
                          strokeDashoffset={(2 * Math.PI * 35) - (completedCount / totalLessons) * (2 * Math.PI * 35)}
                        />
                      </svg>
                      <span className="progress-circle-text">{completionPercentage}%</span>
                    </div>

                    <div className="progress-details-list">
                      <div className="progress-detail-item">
                        <span className="progress-detail-lbl">Danh mục huấn luyện:</span>
                        <span className="progress-detail-val">PCCC Thực tế</span>
                      </div>
                      <div className="progress-detail-item">
                        <span className="progress-detail-lbl">Số video hoàn hảo:</span>
                        <span className="progress-detail-val">{completedCount} / {totalLessons} bài học</span>
                      </div>
                      <div className="progress-detail-item">
                        <span className="progress-detail-lbl">Kết quả thi trắc nghiệm:</span>
                        <span className="progress-detail-val success" style={{ color: '#10b981' }}>{completedCount} bài đạt 100%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification/Certificate Subcard */}
                <div className="profile-card-custom">
                  {isCertUnlocked ? (
                    <div className="certificate-preview-box unlocked">
                      <span className="cert-lock-icon">🏅</span>
                      <h4 className="cert-unlock-heading">Khen tặng & Chứng nhận</h4>
                      <p className="cert-unlock-desc">
                        Chúc mừng! Bạn đã hoàn thành toàn bộ {totalLessons} khóa học thực nghiệm và đạt đủ điều kiện cấp chứng nhận chính chủ từ FIREGUARD.
                      </p>
                      <button 
                        type="button" 
                        className="btn-cert-view" 
                        onClick={() => setShowCert(true)}
                      >
                        <span>👁 Xem chứng nhận học tập</span>
                      </button>
                    </div>
                  ) : (
                    <div className="certificate-preview-box">
                      <span className="cert-lock-icon" style={{ opacity: 0.5 }}>🔒</span>
                      <h4 className="cert-lock-title">Chứng nhận bị khóa</h4>
                      <p className="cert-lock-desc">
                        Để mở khóa chứng nhận hoàn thành chương trình PCCC uy tín, vui lòng vượt qua câu hỏi trắc nghiệm của cả {totalLessons} bài học video.
                      </p>
                      <div style={{ width: '100%', maxWidth: '280px', backgroundColor: '#e2e8f0', height: '6px', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ width: `${completionPercentage}%`, backgroundColor: '#c2182c', height: '100%', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '8px' }}>
                        Tiến độ đạt {completedCount}/{totalLessons} bài học (còn thiếu {totalLessons - completedCount} bài)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
