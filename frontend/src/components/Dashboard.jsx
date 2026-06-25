import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Classroom from './Classroom';
import AdminPanel from './AdminPanel';
import Forum from './CommentsPanel';
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
  ChatBubbleIcon,
  PhoneIcon,
  MailIcon,
  MapMarkerIcon
} from './Icons';

// MOCK VIDEOS
const allVideos = [
  {
    id: 1,
    title: "Mô phỏng tình huống cháy chung cư mini và kỹ năng thoát nạn an toàn.",
    category: "Cơ bản",
    categoryKey: "co-ban",
    defaultPercentage: 45,
    isNew: true,
    thumbnail: "Chaychungcu_Thumbnail.png",
    videoUrl: "https://fireguards.h5p.com/content/1292915182618596269/embed",
    description: `Bài học này tái hiện một tình huống cháy thực tế tại một chung cư mini, nơi tầng 1 chứa nhiều xe máy và xe điện đang sạc, chỉ có một cầu thang thoát nạn duy nhất và hệ thống báo cháy không hoạt động. 
Người xem sẽ vào vai Nam, một sinh viên sống ở tầng 3, và phải đưa ra những quyết định quan trọng trong từng giai đoạn của sự cố.Mỗi lựa chọn đều dẫn đến những hậu quả khác nhau, giúp người xem hiểu rõ các nguy cơ thường gặp và học được cách ứng phó đúng khi xảy ra hỏa hoạn. 
Mục đích của bài học là nâng cao nhận thức và kỹ năng thoát nạn khi xảy ra cháy tại chung cư mini, ký túc xá và nhà trọ nhiều tầng.`
  },
  {
    id: 2,
    title: "Thoát hiểm giữa đêm đông: Sinh tồn trong vụ cháy phòng trọ",
    category: "Thoát hiểm",
    categoryKey: "thoat-hiem",
    duration: "",
    views: "856 lượt xem • 5 ngày trước",
    defaultPercentage: 0,
    isNew: false,
    thumbnail: "Chaybinhnonglanh_Thumbnail.png",
    videoUrl: "https://fireguards.h5p.com/content/1292915968955906289/embed",
    description: `Giữa đêm đông Hà Nội dưới 15°C, Nam (25 tuổi, kỹ sư phần mềm) đang nằm lướt điện thoại trong phòng trọ 20m² sau ca làm việc mệt mỏi. 
    Bất ngờ, chiếc bình nóng lạnh cũ trong nhà tắm phát nổ lớn, bắn ra tia lửa điện và bốc cháy dữ dội. 
    Vỏ nhựa và rèm nylon nóng chảy khiến khói độc đen kịt nhanh chóng bao trùm trần nhà. 
    Bị sặc khói và cay mắt, Nam đối mặt với quyết định sinh tử trong tích tắc khi căn phòng dần mất đi dưỡng khí.`
  },
  {
    id: 3,
    title: "Sơ cứu bỏng nhiệt và ngạt khói tại chỗ trong 5 phút đầu",
    category: "Thoát hiểm",
    categoryKey: "thoat-hiem",
    duration: "",
    views: "2.4k lượt xem • 1 tuần trước",
    defaultPercentage: 85,
    isNew: false,
    thumbnail: "Chayamdunnuoc_Thumbnail.png",
    videoUrl: "https://fireguards.h5p.com/content/1292916045740892609/embed",
    description: `Nhận biết sớm cháy điện, tránh sai lầm hắt nước gây giật, lập tức ngắt cầu dao tổng, dùng bình chữa cháy chuyên dụng (khí CO2 hoặc bột) và nhanh chóng thoát hiểm để bảo vệ tính mạng`
  },

];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    icon: '🔥',
    title: 'Bài học mới: Thoát hiểm trong vụ cháy phòng trọ',
    desc: 'Vừa được thêm vào kho khóa học. Mở xem ngay!',
    time: '5 phút trước',
    isRead: false,
    target: 'videos',
  },
  {
    id: 'n2',
    icon: '💬',
    title: 'Có 4 bình luận mới trên Diễn đàn',
    desc: 'Học viên đang trao đổi về kỹ năng dùng bình CO2.',
    time: '22 phút trước',
    isRead: false,
    target: 'forum',
  },
  {
    id: 'n3',
    icon: '🏆',
    title: 'Bạn đã hoàn thành 2/6 bài học',
    desc: 'Cố lên! Hoàn thành 4 bài còn lại để nhận chứng chỉ.',
    time: '1 giờ trước',
    isRead: false,
    target: 'profile',
  },
  {
    id: 'n4',
    icon: '📣',
    title: 'Cập nhật chính sách bảo mật',
    desc: 'Chúng tôi vừa cập nhật điều khoản sử dụng FIREGUARD.',
    time: 'Hôm qua',
    isRead: true,
    target: null,
  },
];

function Dashboard({ user, handleLogout, showToast }) {
  const [dashboardView, setDashboardView] = useState('forum'); // 'forum' | 'videos' | 'profile' | 'admin'
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifPanelRef = useRef(null);
  const notifTriggerRef = useRef(null);

  // Contact info popup
  const [contactOpen, setContactOpen] = useState(false);
  const contactPanelRef = useRef(null);
  const contactTriggerRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Classroom video details state
  const [activeClassroomVideo, setActiveClassroomVideo] = useState(null);

  // Lock body scroll when sidebar drawer is open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    if (!notifOpen) return undefined;
    const handleClick = (e) => {
      if (
        notifPanelRef.current?.contains(e.target) ||
        notifTriggerRef.current?.contains(e.target)
      ) return;
      setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  const handleNotifClick = (n) => {
    // mark as read
    setNotifications((prev) =>
      prev.map((it) => (it.id === n.id ? { ...it, isRead: true } : it))
    );
    setNotifOpen(false);
    // route to target view if any
    if (n.target === 'forum') {
      setDashboardView('forum');
      setActiveClassroomVideo(null);
    } else if (n.target === 'videos') {
      setDashboardView('videos');
      setActiveClassroomVideo(null);
    } else if (n.target === 'profile') {
      setDashboardView('profile');
      setActiveClassroomVideo(null);
    }
    closeSidebar();
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Đã đánh dấu tất cả thông báo là đã đọc.', 'success');
  };

  const toggleNotifPanel = () => {
    setNotifOpen((v) => !v);
  };

  // Close contact popup when clicking outside
  useEffect(() => {
    if (!contactOpen) return undefined;
    const handleClick = (e) => {
      if (
        contactPanelRef.current?.contains(e.target) ||
        contactTriggerRef.current?.contains(e.target)
      ) return;
      setContactOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [contactOpen]);

  const toggleContactPanel = () => {
    setContactOpen((v) => !v);
  };

  // Dynamic user details synced from Live Database
  const [dbUser, setDbUser] = useState(null);
  const [fetching, setFetching] = useState(false);

  // Core array representing watched video IDs from live database
  const [watchedIds, setWatchedIds] = useState([]);

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
    if (activeTab === 'Tất cả') return allVideos;
    if (activeTab === 'Cơ bản') return allVideos.filter(v => v.category === 'Cơ bản');
    if (activeTab === 'Chung cư/Nhà cao tầng') return allVideos.filter(v => v.category === 'Thoát hiểm');
    if (activeTab === 'Thoát hiểm khẩn cấp') return allVideos.filter(v => v.category === 'Thoát hiểm');
    return allVideos;
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

  const handleSidebarVideosClick = () => {
    setDashboardView('videos');
    setActiveClassroomVideo(null); // Return to catalog grid view
    closeSidebar();
  };

  const handleSidebarAdminClick = () => {
    setDashboardView('admin');
    closeSidebar();
  };

  const handleSidebarForumClick = () => {
    setDashboardView('forum');
    setActiveClassroomVideo(null);
    closeSidebar();
  };

  // Clicking the brand/logo returns to the home view (Diễn đàn)
  const handleGoHome = () => {
    setDashboardView('forum');
    setActiveClassroomVideo(null);
    closeSidebar();
  };

  const handleSidebarProfileClick = () => {
    setDashboardView('profile');
    setActiveClassroomVideo(null);
    closeSidebar();
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

      {/* Mobile sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      />

      {/* Left Sidebar (all tools merged in here) */}
      <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <button
          className="sidebar-close-btn"
          onClick={closeSidebar}
          aria-label="Đóng menu"
        >
          ✕
        </button>

        {/* Brand / Logo — click returns to home (Diễn đàn) */}
        <div
          className="sidebar-brand-box sidebar-brand-clickable"
          onClick={handleGoHome}
          role="button"
          tabIndex={0}
          title="Về trang chủ"
        >
          <div
            className="sidebar-logo"
            style={{
              overflow: 'hidden',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent'
            }}
          >
            <img
              src="/logo_e.png"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              alt="FIREGUARD Logo"
            />
          </div>
          <div className="sidebar-brand-name-box">
            <span className="sidebar-brand-title">FIREGUARD</span>
            <span className="sidebar-brand-subtitle">HỌC TẬP TƯƠNG TÁC</span>
          </div>
        </div>

        {/* Search box — moved from top header into sidebar */}
        <div className="sidebar-search">
          <span className="sidebar-search-icon"><SearchIcon /></span>
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Tìm kiếm..."
            onChange={(e) =>
              e.target.value &&
              showToast(`Tìm kiếm từ khóa "${e.target.value}"`, 'success')
            }
          />
        </div>

        <nav className="sidebar-menu">
          <div
            className={`sidebar-item ${dashboardView === 'forum' ? 'active' : ''}`}
            onClick={handleSidebarForumClick}
          >
            <ChatBubbleIcon />
            Diễn đàn
            <span className="sidebar-item-dot" title="Đang trực tiếp"></span>
          </div>

          <div
            className={`sidebar-item ${dashboardView === 'videos' ? 'active' : ''}`}
            onClick={handleSidebarVideosClick}
          >
            <PlayMenuIcon />
            Danh sách video
          </div>

          <div
            ref={notifTriggerRef}
            className={`sidebar-item sidebar-item-notif ${notifOpen ? 'active' : ''}`}
            onClick={toggleNotifPanel}
            role="button"
            tabIndex={0}
          >
            <NotifyBellIcon />
            Thông báo
            {unreadCount > 0 && (
              <span className="sidebar-item-badge">{unreadCount}</span>
            )}
          </div>

          {notifOpen && (
            <div
              ref={notifPanelRef}
              className="notif-panel"
              role="dialog"
              aria-label="Danh sách thông báo"
            >
              <div className="notif-panel-header">
                <div className="notif-panel-title-row">
                  <span className="notif-panel-title">Thông báo</span>
                  <span className="notif-panel-count">
                    {unreadCount > 0
                      ? `${unreadCount} chưa đọc`
                      : 'Tất cả đã đọc'}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="notif-mark-all"
                    onClick={handleMarkAllRead}
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">Không có thông báo nào.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`notif-item ${n.isRead ? 'is-read' : 'is-unread'}`}
                      onClick={() => handleNotifClick(n)}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="notif-item-icon">{n.icon}</span>
                      <div className="notif-item-body">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-desc">{n.desc}</span>
                        <span className="notif-item-time">{n.time}</span>
                      </div>
                      {!n.isRead && <span className="notif-item-dot"></span>}
                    </div>
                  ))
                )}
              </div>

              <div className="notif-panel-footer">
                <button
                  type="button"
                  className="notif-close-btn"
                  onClick={() => setNotifOpen(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          {isAdmin && (
            <div
              className={`sidebar-item ${dashboardView === 'admin' ? 'active' : ''}`}
              onClick={handleSidebarAdminClick}
              style={{
                borderLeft:
                  dashboardView === 'admin'
                    ? '3px solid #fbbf24'
                    : '3px solid transparent'
              }}
            >
              <span style={{ marginRight: '10px', fontSize: '1rem' }}>👑</span>
              Trang Quản trị
            </div>
          )}

          <div
            ref={contactTriggerRef}
            className={`sidebar-item ${contactOpen ? 'active' : ''}`}
            onClick={toggleContactPanel}
            role="button"
            tabIndex={0}
          >
            <PhoneIcon />
            Thông tin liên hệ
          </div>

          {contactOpen && (
            <div
              ref={contactPanelRef}
              className="contact-panel"
              role="dialog"
              aria-label="Thông tin liên hệ"
            >
              <div className="contact-panel-header">
                <span className="contact-panel-title">Thông tin liên hệ</span>
              </div>
              <div className="contact-panel-body">
                <a className="contact-row" href="tel:0848986575">
                  <span className="contact-row-icon"><PhoneIcon /></span>
                  <div className="contact-row-text">
                    <span className="contact-row-label">Số điện thoại</span>
                    <span className="contact-row-value">0848 986 575</span>
                  </div>
                </a>
                <a className="contact-row" href="mailto:taicahe@gmail.com">
                  <span className="contact-row-icon"><MailIcon /></span>
                  <div className="contact-row-text">
                    <span className="contact-row-label">Email</span>
                    <span className="contact-row-value">taicahe@gmail.com</span>
                  </div>
                </a>
                <div className="contact-row">
                  <span className="contact-row-icon"><MapMarkerIcon /></span>
                  <div className="contact-row-text">
                    <span className="contact-row-label">Địa chỉ</span>
                    <span className="contact-row-value">Hà Nội, Việt Nam</span>
                  </div>
                </div>
              </div>
              <div className="contact-panel-footer">
                <button
                  type="button"
                  className="contact-close-btn"
                  onClick={() => setContactOpen(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          <div
            className={`sidebar-profile-row ${dashboardView === 'profile' ? 'active' : ''}`}
            onClick={handleSidebarProfileClick}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-profile-avatar">
              <span className="profile-widget-fallback">{firstLetter}</span>
            </div>
            <div className="sidebar-profile-text">
              <span className="sidebar-profile-name">{displayName}</span>
              <span className="sidebar-profile-role">{roleName}</span>
            </div>
          </div>

          <div className="sidebar-footer-link" onClick={handleLogout}>
            <LogOutIcon />
            Đăng xuất
          </div>
        </div>
      </aside>

      {/* Main Content Panel */}
      <main className="main-content-panel">
        <header className={`content-header content-header-compact ${activeClassroomVideo ? 'classroom-active' : ''}`}>
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Mở menu"
          >
            ☰
          </button>
        </header>

        {dashboardView === 'forum' ? (
          <Forum user={activeUser} showToast={showToast} />
        ) : dashboardView === 'videos' ? (
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
          <AdminPanel showToast={showToast} />
        ) : (
          // Live Database profile card rendering
          <div className="dashboard-body" style={{ alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
            <div className="dashboard-card" style={{ maxWidth: '650px', width: '100%', padding: '40px' }}>
              <div className="dash-avatar">🔥</div>
              <h1 className="dash-title">Hồ sơ học tập PCCC</h1>
              <p className="dash-msg">
                {fetching ? "Đang đồng bộ từ Database..." : "Xem thông tin cá nhân được lấy thời gian thực từ cơ sở dữ liệu MongoDB."}
              </p>

              <div className="status-box" style={{ textAlign: 'left', marginTop: '20px', marginBottom: '30px' }}>
                <div className="status-item">
                  <span className="status-label">Họ và tên:</span>
                  <span className="status-value" style={{ fontWeight: '600', color: '#1e293b' }}>
                    {displayName}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Số điện thoại:</span>
                  <span className="status-value" style={{ fontWeight: '600', color: '#1e293b' }}>
                    {phoneText}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Địa chỉ:</span>
                  <span className="status-value" style={{ fontWeight: '600', color: '#1e293b' }}>
                    {addressText}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Email đăng nhập:</span>
                  <span className="status-value" style={{ color: '#64748b' }}>{emailText}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Số bài học đã xem:</span>
                  <span className="status-value success" style={{ fontWeight: '700' }}>
                    {watchedIds.length} / 6 bài học
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Trạng thái dữ liệu:</span>
                  <span className="status-value success" style={{ fontWeight: '700' }}>
                    🟢 Trực tiếp từ Live MongoDB
                  </span>
                </div>
              </div>

              <button className="logout-btn" onClick={handleLogout}>Đăng xuất tài khoản</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
