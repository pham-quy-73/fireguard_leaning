import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Classroom from './Classroom';
import AdminPanel from './AdminPanel';
import Forum from './CommentsPanel';

import Announcements from './Announcements';
import Quiz from './Quiz';
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


// Dữ liệu dự phòng dùng khi không gọi được API (mất mạng / backend chưa chạy).
// Nguồn chính thức là MongoDB qua GET /api/videos — xem state `videos` bên dưới.
const FALLBACK_VIDEOS = [

  {
    id: 1,
    title: "Mô phỏng tình huống cháy chung cư mini và kỹ năng thoát nạn an toàn.",
    category: "Cơ bản",
    categoryKey: "co-ban",
    defaultPercentage: 0,
    isNew: true,
    thumbnail: "Chaychungcu_Thumbnail.png",
   

    videoUrl: "https://fireguard.h5p.com/content/1292933141119135919/embed",
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


    videoUrl: "https://fireguard.h5p.com/content/1292933146469393139/embed",
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
    defaultPercentage: 0,
    isNew: false,


    thumbnail: "Chayamdunnuoc_Thumbnail.png",


    videoUrl: "https://fireguard.h5p.com/content/1292933229411731469/embed",
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
    target: 'discussion',
  },
  {
    id: 'n3',
    icon: '🏆',
    title: 'Bạn đã hoàn thành 2/6 bài học',
    desc: 'Cố lên! Hoàn thành 4 bài còn lại để nhận chứng chỉ.',
    time: '1 giờ trước',
    isRead: false,
    target: 'settings',
  },
  {
    id: 'n4',
    icon: '📣',
    title: 'Cập nhật chính sách bảo mật',
    desc: 'Chúng tôi vừa cập nhật điều khoản sử dụng FIREGUARD.',
    time: 'Hôm qua',
    isRead: true,
    target: 'announcements',
  },
];

// Định dạng thời gian tương đối theo mốc thật (createdAt) — F5 vẫn đúng
function formatTimeAgo(ts) {
  if (!ts) return '';
  const d = ts instanceof Date ? ts : new Date(ts);
  const ms = d.getTime();
  if (isNaN(ms)) return '';
  const diff = Date.now() - ms;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'Vừa xong';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} ngày trước`;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Mốc thời gian ổn định cho thông báo không có createdAt thật (nhớ lần đầu xuất hiện)
function getStableTs(id) {
  let map = {};
  try { map = JSON.parse(localStorage.getItem('notifSeen') || '{}'); } catch (e) { map = {}; }
  if (!map[id]) {
    map[id] = Date.now();
    try { localStorage.setItem('notifSeen', JSON.stringify(map)); } catch (e) { /* ignore */ }
  }
  return map[id];
}

// Khung hình trích từ chính video của từng khóa (Cloudinary so_15) — map theo tiêu đề.
// Nguồn xác định theo URL video gốc H5P do người dùng cung cấp (đối chiếu tên file nguồn).
const COURSE_FRAMES = {
  chungcu:   'https://res.cloudinary.com/dzasig10l/video/upload/so_15,w_640,h_360,c_fill,q_auto/v1782235650/sources-6a1a9d24d11b2_afpqin.jpg',
  trongnha:  'https://res.cloudinary.com/dzasig10l/video/upload/so_15,w_640,h_360,c_fill,q_auto/v1782234076/sources-6a1af9db9c0aa_ls6wjr.jpg',
  mini:      'https://res.cloudinary.com/dzasig10l/video/upload/so_15,w_640,h_360,c_fill,q_auto/v1782231998/sources-6a3533e05595d_mr24j4.jpg',
  amdunnuoc: 'https://res.cloudinary.com/dzasig10l/video/upload/so_15,w_640,h_360,c_fill,q_auto/v1782235450/files-6a353f5a413e0_cwbln4.jpg',
};
const FRAME_FALLBACK = [COURSE_FRAMES.chungcu, COURSE_FRAMES.trongnha, COURSE_FRAMES.mini, COURSE_FRAMES.amdunnuoc];
// Ảnh cố định theo id bài học: 1=chung cư mini, 2=bình nóng lạnh, 3=chung cư, 4=ấm đun nước
const FRAME_BY_ID = {
  1: COURSE_FRAMES.chungcu,
  2: COURSE_FRAMES.trongnha,
  3: COURSE_FRAMES.mini,
  4: COURSE_FRAMES.amdunnuoc,
};
// Đồng bộ 4 bài học theo VỊ TRÍ thẻ (ảnh 1..4): tên + link H5P mới. Áp bất kể id/dữ liệu DB.
const NEW_VIDEOS = [
  { title: 'Cháy chung cư mini',  videoUrl: 'https://fireguard.h5p.com/content/1292933141119135919/embed' }, // ảnh 1
  { title: 'Cháy bình nóng lạnh', videoUrl: 'https://fireguard.h5p.com/content/1292933146469393139/embed' }, // ảnh 2
  { title: 'Cháy chung cư',       videoUrl: 'https://fireguard.h5p.com/content/1292933165577314319/embed' }, // ảnh 3
  { title: 'Cháy ấm đun nước',    videoUrl: 'https://fireguard.h5p.com/content/1292933229411731469/embed' }, // ảnh 4
];
const applyVideoUrls = (list) => (Array.isArray(list) ? list.map((v, i) => (NEW_VIDEOS[i] ? { ...v, title: NEW_VIDEOS[i].title, videoUrl: NEW_VIDEOS[i].videoUrl } : v)) : list);

function getCourseThumb(video, idx) {
  // Ảnh theo đúng vị trí thẻ (ảnh 1..4)
  return FRAME_FALLBACK[idx % FRAME_FALLBACK.length];
}

function Dashboard({ user, handleLogout, showToast, goHome, pendingVideoId, clearPendingVideo, darkMode, toggleDarkMode, initialView = 'discussion', onChangePassword }) {
  const [dashboardView, setDashboardView] = useState(() => localStorage.getItem('lastDashboardView') || initialView);
  // Lưu tab hiện tại để F5 không mất trang
  useEffect(() => { localStorage.setItem('lastDashboardView', dashboardView); }, [dashboardView]); // 'announcements' | 'discussion' | 'videos' | 'quiz' | 'profile' | 'admin' | 'settings'

  // Safeguard: Redirect student if they are in admin view
  useEffect(() => {
    const isUserAdmin = user?.role === 'admin' || user?.email === 'admin@fireguard.com' || dbUser?.role === 'admin';
    if (dashboardView === 'admin' && !isUserAdmin) {
      setDashboardView('discussion');
    }
  }, [user, dbUser, dashboardView]);

  // Sidebar expandable groups
  const [forumGroupOpen, setForumGroupOpen] = useState(true);
  const [learnGroupOpen, setLearnGroupOpen] = useState(true);

  const [activeTab, setActiveTab] = useState('Tất cả');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notifications
  // Bell hiển thị dữ liệu thật: announcement (admin đăng) + nhắc riêng từ DB + bài học mới
  const [notifications, setNotifications] = useState([]);

  // Thông báo gửi riêng cho học viên này từ DB (vd admin nhắc học)
  const [dbNotifs, setDbNotifs] = useState([]);

  // Thông báo chung do admin đăng (Announcement) -> hiện cho mọi học viên ở chuông
  const [annNotifs, setAnnNotifs] = useState([]);

  // Lưu danh sách thông báo đã đọc vào localStorage mỗi khi thay đổi
  useEffect(() => {
    // Cộng dồn (không ghi đè) để không mất trạng thái đã đọc khi danh sách tạm thời thiếu mục
    let prev = [];
    try { prev = JSON.parse(localStorage.getItem('readNotifs') || '[]'); } catch (e) { prev = []; }
    const cur = notifications.filter((n) => n.isRead).map((n) => n.id);
    const union = Array.from(new Set([...prev, ...cur]));
    try { localStorage.setItem('readNotifs', JSON.stringify(union)); } catch (e) { /* ignore */ }
  }, [notifications]);

  // Nạp thông báo riêng của học viên từ DB
  useEffect(() => {
    const uid = user?.id || user?._id;
    if (!uid) return;
    axios.get(`${API_BASE_URL}/api/auth/notifications/${uid}`)
      .then((res) => {
        if (res.data?.success) {
          setDbNotifs((res.data.notifications || []).map((n) => ({
            id: n._id,
            icon: n.icon || '📣',
            title: n.title,
            desc: n.desc,
            ts: n.createdAt ? new Date(n.createdAt).getTime() : getStableTs(n._id),
            isRead: !!n.isRead,
            target: null,
          })));
        }
      })
      .catch(() => { /* ignore */ });
  }, [user]);

  // Nạp announcement (admin đăng) -> hiện ở chuông cho mọi học viên, kèm thời gian thật
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/auth/announcements`)
      .then((res) => {
        if (res.data?.success) {
          setAnnNotifs((res.data.announcements || []).map((a) => ({
            id: `ann-${a._id}`,
            icon: a.pinned ? '📌' : '📢',
            title: a.title,
            desc: a.content,
            ts: a.createdAt ? new Date(a.createdAt).getTime() : getStableTs(`ann-${a._id}`),
            isRead: false,
            target: 'announcements',
          })));
        }
      })
      .catch(() => { /* ignore */ });
  }, []);

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

  // Danh sách video lấy trực tiếp từ MongoDB (GET /api/videos).
  // Thêm/xóa video trong DB sẽ phản ánh ngay khi tải lại trang.
  const [videos, setVideos] = useState([]);

  // Sinh thông báo 'bài học mới' động theo video có cờ isNew trong DB.
  // Cái mới (id chưa từng đọc) sẽ hiện chưa đọc; cái đã đọc vẫn được nhớ.
  useEffect(() => {
    let readIds = [];
    try { readIds = JSON.parse(localStorage.getItem('readNotifs') || '[]'); } catch (e) { readIds = []; }
    const dynamicNew = (videos || [])
      .filter((v) => v && v.isNew)
      .map((v) => ({
        id: `video-new-${v.id}`,
        icon: '🔥',
        title: `Bài học mới: ${v.title}`,
        desc: 'Vừa được thêm vào kho khóa học. Mở xem ngay!',
        ts: v.createdAt ? new Date(v.createdAt).getTime() : getStableTs(`video-new-${v.id}`),
        isRead: false,
        target: 'videos',
      }));
    const merged = [...annNotifs, ...dbNotifs, ...dynamicNew]
      .map((n) => (readIds.includes(n.id) ? { ...n, isRead: true } : n))
      .sort((a, b) => (b.ts || 0) - (a.ts || 0));
    setNotifications(merged);
  }, [videos, dbNotifs, annNotifs]);
  const [videosLoading, setVideosLoading] = useState(true);

  useEffect(() => {
    let active = true;
    axios.get(`${API_BASE_URL}/api/videos`)
      .then((res) => {
        if (!active) return;
        if (res.data?.success && Array.isArray(res.data.videos) && res.data.videos.length) {
          setVideos(applyVideoUrls(res.data.videos));
        } else {
          setVideos(FALLBACK_VIDEOS); // DB rỗng hoặc shape lạ -> dùng dự phòng
        }
      })
      .catch(() => {
        if (active) setVideos(FALLBACK_VIDEOS); // mất mạng / backend chưa chạy
      })
      .finally(() => {
        if (active) setVideosLoading(false);
      });
    return () => { active = false; };
  }, []);

  // Mở đúng bài học khi khách chọn 'Học ngay' ở trang chủ rồi đăng nhập
  useEffect(() => {
    if (!pendingVideoId || !videos.length) return;
    const v = videos.find(
      (x) => String(x.id) === String(pendingVideoId) || String(x._id) === String(pendingVideoId)
    );
    if (v) {
      setDashboardView('videos');
      setActiveClassroomVideo(v);
    }
    if (clearPendingVideo) clearPendingVideo();
  }, [pendingVideoId, videos]);

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
    // Điều hướng tới đúng trang mà thông báo trỏ tới
    if (n.target) {
      setDashboardView(n.target);
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

  // Tiến độ xem từng video (videoId -> %), lấy thật từ DB
  const [progressMap, setProgressMap] = useState({});
  const progressSaveRef = useRef({});
  // Điểm đạt được từng video (videoId -> {raw,max}), vd điểm H5P
  const [scoreMap, setScoreMap] = useState({});

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
          setProgressMap(response.data.user.videoProgress || {});
          setScoreMap(response.data.user.videoScores || {});
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
    if (dashboardView === 'settings' && activeId) {
      axios.get(`${API_BASE_URL}/api/auth/profile/${activeId}`)
        .then(response => {
          if (response.data.success) {
            setDbUser(response.data.user);
            setWatchedIds(response.data.user.watchedVideos || []);
            setProgressMap(response.data.user.videoProgress || {});
            setScoreMap(response.data.user.videoScores || {});
          setScoreMap(response.data.user.videoScores || {});
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
        showToast('Chúc mừng! Bạn đã hoàn thành bài học này!', 'success');
      }
    } catch (err) {
      console.error("Không thể lưu tiến trình học:", err);
    }
  };

  // Lưu tiến độ xem video THẬT (gọi realtime trong lúc xem), tự hoàn thành khi >= 90%
  const handleVideoProgress = (videoId, percent) => {
    const pct = Math.max(0, Math.min(100, Math.round(percent)));
    setProgressMap((prev) => {
      const cur = prev[String(videoId)] || 0;
      if (pct <= cur) return prev;
      return { ...prev, [String(videoId)]: pct };
    });
    const last = progressSaveRef.current[String(videoId)] || 0;
    if (pct - last >= 5 || pct >= 90) {
      progressSaveRef.current[String(videoId)] = pct;
      const activeId = user?.id || user?._id;
      if (!activeId) return;
      axios.post(`${API_BASE_URL}/api/auth/progress`, { userId: activeId, videoId: Number(videoId), percent: pct })
        .then((res) => {
          if (res.data?.success && res.data.watchedVideos) setWatchedIds(res.data.watchedVideos);
        })
        .catch(() => { /* ignore */ });
    }
  };

  // Lưu điểm đạt được của video (vd điểm H5P gửi qua xAPI)
  const handleVideoScore = (videoId, raw, max) => {
    if (!max || max <= 0) return;
    setScoreMap((prev) => ({ ...prev, [String(videoId)]: { raw: Number(raw) || 0, max: Number(max) } }));
    const activeId = user?.id || user?._id;
    if (!activeId) return;
    axios.post(`${API_BASE_URL}/api/auth/progress`, { userId: activeId, videoId: Number(videoId), scoreRaw: Number(raw) || 0, scoreMax: Number(max) })
      .catch(() => { /* ignore */ });
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
  // Nhãn breadcrumb theo mục đang xem
  const viewLabels = {
    announcements: 'Thông báo',
    discussion: 'Diễn đàn',
    videos: 'Bài học',
    quiz: 'Quiz',
    profile: 'Hồ sơ',
    admin: 'Quản trị',
    settings: 'Cài đặt',
  };
  const currentCrumb = activeClassroomVideo
    ? (activeClassroomVideo.title || 'Bài học')
    : (viewLabels[dashboardView] || 'Trang');


  const handleSidebarAdminClick = () => {
    setDashboardView('admin');
    closeSidebar();
  };

  // Ô hồ sơ ở chân sidebar -> mở trang Cài đặt (đã gộp thông tin học viên vào đây)
  const handleSidebarProfileClick = () => {
    setDashboardView('settings');
    setActiveClassroomVideo(null);
    closeSidebar();
  };

  // Generic navigation helper for the new grouped sidebar items
  const goToView = (view) => {
    setDashboardView(view);
    setActiveClassroomVideo(null);
    closeSidebar();
  };


  // Clicking the brand/logo returns to the home view (Thảo luận)
  const handleGoHome = () => {
    setDashboardView('discussion');
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
          onClick={() => { if (goHome) goHome(); closeSidebar(); }}
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

          {/* GROUP: Diễn đàn */}
          <div className="sidebar-group">
            <div
              className="sidebar-group-header"
              onClick={() => setForumGroupOpen((v) => !v)}
              role="button"
              tabIndex={0}
            >
              <ChatBubbleIcon />
              <span className="sidebar-group-title">Diễn đàn</span>
              <span className={`sidebar-group-caret ${forumGroupOpen ? 'open' : ''}`}>▾</span>
            </div>

            {forumGroupOpen && (
              <div className="sidebar-subitems">
                <div
                  className={`sidebar-subitem ${dashboardView === 'discussion' ? 'active' : ''}`}
                  onClick={() => goToView('discussion')}
                >
                  <span className="sidebar-subitem-icon">💬</span>
                  Thảo luận
                  <span className="sidebar-item-dot" title="Đang trực tiếp"></span>
                </div>
              </div>
            )}
          </div>

          {/* GROUP: Bài học */}
          <div className="sidebar-group">
            <div
              className="sidebar-group-header"
              onClick={() => setLearnGroupOpen((v) => !v)}
              role="button"
              tabIndex={0}
            >
              <PlayMenuIcon />
              <span className="sidebar-group-title">Bài học</span>
              <span className={`sidebar-group-caret ${learnGroupOpen ? 'open' : ''}`}>▾</span>
            </div>

            {learnGroupOpen && (
              <div className="sidebar-subitems">
                <div
                  className={`sidebar-subitem ${dashboardView === 'videos' ? 'active' : ''}`}
                  onClick={() => goToView('videos')}
                >
                  <span className="sidebar-subitem-icon">📺</span>
                  Danh sách video
                </div>
                <div
                  className={`sidebar-subitem ${dashboardView === 'quiz' ? 'active' : ''}`}
                  onClick={() => goToView('quiz')}
                >
                  <span className="sidebar-subitem-icon">📝</span>
                  Quiz
                </div>
              </div>
            )}
          </div>


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
            className={`sidebar-item ${dashboardView === 'announcements' ? 'active' : ''}`}
            onClick={() => goToView('announcements')}
            role="button"
            tabIndex={0}
            style={{
              borderLeft:
                dashboardView === 'announcements'
                  ? '3px solid var(--primary-red)'
                  : '3px solid transparent'
            }}
          >
            <NotifyBellIcon />
            Thông báo
          </div>

          <div

            className={`sidebar-item ${dashboardView === 'settings' ? 'active' : ''}`}
            onClick={() => goToView('settings')}
            role="button"
            tabIndex={0}
            style={{
              borderLeft:
                dashboardView === 'settings'
                  ? '3px solid var(--primary-red)'
                  : '3px solid transparent'
            }}
          >
            <SettingsGearIcon />
            Cài đặt
          </div>

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

          {/* Chuông thông báo ở góc phải header */}
          <div className="header-actions">
            <div className="notif-wrap">
              <button
                ref={notifTriggerRef}
                className="notif-bell-btn"
                onClick={toggleNotifPanel}
                aria-label="Thông báo"
                title="Thông báo"
              >
                <NotifyBellIcon />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {notifOpen && (
                <div ref={notifPanelRef} className="notif-panel" role="dialog" aria-label="Thông báo">
                  <div className="notif-panel-head">
                    <span className="notif-panel-title">Thông báo</span>
                    {unreadCount > 0 && (
                      <button className="notif-markall" onClick={handleMarkAllRead}>
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <p className="notif-empty">Chưa có thông báo nào.</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          className={`notif-item ${n.isRead ? '' : 'unread'}`}
                          onClick={() => handleNotifClick(n)}
                        >
                          <span className="notif-item-icon">{n.icon}</span>
                          <span className="notif-item-body">
                            <span className="notif-item-title">{n.title}</span>
                            <span className="notif-item-desc">{n.desc}</span>
                            <span className="notif-item-time">{formatTimeAgo(n.ts)}</span>
                          </span>
                          {!n.isRead && <span className="notif-dot" />}
                        </button>
                      ))
                    )}
                  </div>
                  <button
                    className="notif-seeall"
                    onClick={() => { setNotifOpen(false); goToView('announcements'); }}
                  >
                    Xem tất cả thông báo →
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Breadcrumb: Trang chủ > mục hiện tại */}
        <nav className="dash-breadcrumb" aria-label="breadcrumb">
          <button type="button" className="dash-bc-home" onClick={() => { if (goHome) goHome(); }}>
            <span className="dash-bc-ic">🏠</span>
            <span>Trang chủ</span>
          </button>
          <span className="dash-bc-sep">›</span>
          <span className="dash-bc-current">{currentCrumb}</span>
        </nav>

        {dashboardView === 'announcements' ? (
          <Announcements user={activeUser} showToast={showToast} sideNotifs={notifications.filter((n) => !String(n.id).startsWith('ann-'))} />
        ) : dashboardView === 'discussion' ? (
          <Forum user={activeUser} showToast={showToast} />
        ) : dashboardView === 'quiz' ? (
          <Quiz
            videos={videos}
            watchedIds={watchedIds}
            onComplete={handleCompleteVideo}
            showToast={showToast}
          />
        ) : dashboardView === 'videos' ? (
          /* Render Classroom page or course catalog list */
          activeClassroomVideo ? (
            <Classroom
              video={activeClassroomVideo}
              user={activeUser}
              onBack={() => setActiveClassroomVideo(null)}
              showToast={showToast}
              onComplete={handleCompleteVideo}
              onProgress={handleVideoProgress}
              onScore={handleVideoScore}
              initialPercent={Math.round(progressMap[String(activeClassroomVideo.id)] || 0)}
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
              {videosLoading ? (
                <p className="grid-heading-desc">Đang tải danh sách bài học từ cơ sở dữ liệu...</p>
              ) : getFilteredVideos().length === 0 ? (
                <p className="grid-heading-desc">Chưa có bài học nào trong cơ sở dữ liệu.</p>
              ) : (
              <div className="video-catalog-grid">
                {getFilteredVideos().map((video, idx) => {
                  const isWatched = watchedIds.includes(video.id);
                  // Tiến độ THẬT từ DB (không đánh dấu giả)
                  const pct = isWatched ? 100 : Math.round(progressMap[String(video.id)] || 0);
                  const progressText = isWatched ? 'Đã hoàn thành' : (pct > 0 ? `Đã xem ${pct}%` : 'Chưa bắt đầu');
                  const vscore = scoreMap[String(video.id)];

                  return (
                    <div key={video.id} className="video-catalog-card">
                      <div
                        className="thumbnail-box"
                        style={{ backgroundImage: `url('${getCourseThumb(video, idx)}')` }}
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
                          <div className="progress-meta-row">
                            <span className="progress-text">{progressText}</span>
                            <span className="progress-percentage" style={{ color: isWatched ? '#10b981' : '' }}>{pct}%</span>
                          </div>
                          <div className="progress-track-bar">
                            <div
                              className="progress-fill-active"
                              style={{ width: `${pct}%`, backgroundColor: isWatched ? '#10b981' : '' }}
                            />
                          </div>

                          {isWatched ? (
                            <div className="course-status-badge done">✓ Đã hoàn thành</div>
                          ) : (
                            <div className="course-status-badge todo">● Chưa hoàn thành</div>
                          )}

                          {vscore && vscore.max > 0 && (
                            <div className="course-score-row">
                              🏆 Đạt {vscore.raw}/{vscore.max} điểm
                            </div>
                          )}

                          <button
                            className={`watch-action-button ${!isWatched ? 'not-started' : ''}`}
                            onClick={() => handleWatchVideo(video)}
                            style={{
                              borderColor: isWatched ? '#10b981' : '',
                              color: isWatched ? '#10b981' : '',
                              backgroundColor: isWatched ? '#ecfdf5' : ''
                            }}
                          >
                            {isWatched ? '✓ Xem lại bài học' : 'Bắt đầu học'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}

            </div>
          )
        ) : dashboardView === 'admin' ? (
          <AdminPanel user={activeUser} showToast={showToast} />
        ) : (
          /* SETTINGS PAGE — dark mode + student info in one place (also the default fallback / old profile view) */
          <div className="dashboard-body settings-page">
            <h1 className="grid-heading-title">Cài đặt</h1>
            <p className="grid-heading-desc">
              Tùy chỉnh giao diện và xem thông tin tài khoản học viên của bạn.
            </p>

            {/* Section: Giao diện (Dark mode) */}
            <section className="settings-card">
              <h2 className="settings-card-title">🎨 Giao diện</h2>
              <div className="settings-row">
                <div className="settings-row-text">
                  <span className="settings-row-label">Chế độ tối (Dark mode)</span>
                  <span className="settings-row-desc">
                    Giảm độ chói, dễ chịu cho mắt khi học vào buổi tối.
                  </span>
                </div>
                <button
                  type="button"
                  className={`theme-toggle ${darkMode ? 'on' : ''}`}
                  onClick={toggleDarkMode}
                  role="switch"
                  aria-checked={darkMode}
                  aria-label="Bật/tắt chế độ tối"
                >
                  <span className="theme-toggle-track">
                    <span className="theme-toggle-icon sun">☀️</span>
                    <span className="theme-toggle-icon moon">🌙</span>
                    <span className="theme-toggle-thumb" />
                  </span>
                </button>
              </div>
            </section>

            {/* Section: Thông tin học viên */}
            <section className="settings-card">
              <h2 className="settings-card-title">👤 Thông tin học viên</h2>

              <div className="settings-profile-head">
                <div className="settings-profile-avatar">{firstLetter}</div>
                <div className="settings-profile-id">
                  <span className="settings-profile-name">{displayName}</span>
                  <span className="settings-profile-role">{roleName}</span>
                </div>
              </div>

              <div className="status-box settings-status-box">
                <div className="status-item">
                  <span className="status-label">Họ và tên:</span>
                  <span className="status-value settings-status-strong">{displayName}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Số điện thoại:</span>
                  <span className="status-value settings-status-strong">{phoneText}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Địa chỉ:</span>
                  <span className="status-value settings-status-strong">{addressText}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Email đăng nhập:</span>
                  <span className="status-value">{emailText}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Số bài học đã xem:</span>
                  <span className="status-value success" style={{ fontWeight: '700' }}>
                    {watchedIds.length} / {videos.length} bài học
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Trạng thái dữ liệu:</span>
                  <span className="status-value success" style={{ fontWeight: '700' }}>
                    {fetching ? '⏳ Đang đồng bộ...' : '🟢 Trực tiếp từ Live MongoDB'}
                  </span>
                </div>
              </div>

              <button type="button" className="settings-changepw-btn" onClick={onChangePassword}>
                🔑 Đổi mật khẩu
              </button>
              <button className="logout-btn settings-logout-btn" onClick={handleLogout}>
                Đăng xuất tài khoản
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
