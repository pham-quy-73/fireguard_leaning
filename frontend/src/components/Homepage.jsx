import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiretruckIcon, PlayMenuIcon, ChatBubbleIcon, PhoneIcon, MailIcon, MapMarkerIcon } from './Icons';

// Rising ember/spark particles for the hero + CTA banner (cháy nổ theme).
// Hard-coded configs keep the layout deterministic between renders.
const EMBERS = [
  { left: '6%',  size: 6,  delay: '0s',   dur: '7s'   },
  { left: '14%', size: 4,  delay: '1.8s', dur: '9s'   },
  { left: '23%', size: 8,  delay: '0.6s', dur: '6.5s' },
  { left: '32%', size: 5,  delay: '3.2s', dur: '8s'   },
  { left: '41%', size: 3,  delay: '2.1s', dur: '10s'  },
  { left: '50%', size: 7,  delay: '0.9s', dur: '7.5s' },
  { left: '59%', size: 4,  delay: '4s',   dur: '9.5s' },
  { left: '67%', size: 6,  delay: '1.3s', dur: '6.8s' },
  { left: '76%', size: 5,  delay: '2.7s', dur: '8.4s' },
  { left: '84%', size: 8,  delay: '0.3s', dur: '7.2s' },
  { left: '91%', size: 3,  delay: '3.6s', dur: '9.2s' },
  { left: '97%', size: 5,  delay: '1.1s', dur: '8.8s' },
];

// FAQ content (accordion)
const faqs = [
  {
    q: "FIREGUARD có thật sự miễn phí không?",
    a: "Có. Bạn có thể đăng ký tài khoản và học các bài học cơ bản hoàn toàn miễn phí. Một số khóa chuyên sâu và chứng chỉ có thể yêu cầu nâng cấp, nhưng kiến thức sống còn về PCCC luôn được mở miễn phí cho mọi người."
  },
  {
    q: "Tôi cần thiết bị gì để học?",
    a: "Chỉ cần một chiếc điện thoại, máy tính bảng hoặc máy tính có kết nối internet. Bài giảng được tối ưu cho màn hình nhỏ, bạn có thể học mọi lúc mọi nơi."
  },
  {
    q: "Chứng chỉ sau khóa học có giá trị không?",
    a: "Chứng chỉ hoàn thành được cấp sau khi bạn vượt qua bài kiểm tra cuối khóa, ghi nhận kiến thức và kỹ năng PCCC bạn đã đạt được. Đây là minh chứng hữu ích cho hồ sơ cá nhân và nội bộ doanh nghiệp."
  },
  {
    q: "Trẻ em có học được không?",
    a: "Hoàn toàn được. Nội dung được thiết kế trực quan, dễ hiểu, phù hợp cho cả học sinh. Nhiều phụ huynh và giáo viên đã sử dụng FIREGUARD để dạy kỹ năng thoát hiểm cho trẻ."
  },
  {
    q: "Khi gặp hỏa hoạn thật, tôi nên gọi số nào?",
    a: "Gọi ngay 114 — số điện thoại khẩn cấp của Cảnh sát Phòng cháy chữa cháy & Cứu nạn cứu hộ tại Việt Nam (miễn phí, hoạt động 24/7). Hãy bình tĩnh cung cấp địa chỉ và tình hình đám cháy."
  },
];

// Featured courses preview data (matches the catalog in Dashboard)
const featuredCourses = [
  {
    id: 1,
    title: "Mô phỏng tình huống cháy chung cư mini và kỹ năng thoát nạn an toàn.",
    category: "Cơ bản",
    categoryKey: "co-ban",
    thumbnail: "Chaychungcu_Thumbnail.png",
    description: "Tái hiện tình huống cháy thực tế tại chung cư mini. Học cách ứng phó đúng khi xảy ra hỏa hoạn tại nhà cao tầng và ký túc xá."
  },
  {
    id: 2,
    title: "Thoát hiểm giữa đêm đông: Sinh tồn trong vụ cháy phòng trọ",
    category: "Thoát hiểm",
    categoryKey: "thoat-hiem",
    thumbnail: "Chaybinhnonglanh_Thumbnail.png",
    description: "Đối mặt với tình huống cháy do chập bình nóng lạnh trong phòng trọ nhỏ. Quyết định sinh tử trong tích tắc khi phòng dần mất dưỡng khí."
  },
  {
    id: 3,
    title: "Sơ cứu bỏng nhiệt và ngạt khói tại chỗ trong 5 phút đầu",
    category: "Sơ cứu",
    categoryKey: "so-cuu",
    thumbnail: "Chayamdunnuoc_Thumbnail.png",
    description: "Nhận biết sớm cháy điện, tránh sai lầm hắt nước gây giật, dùng bình chữa cháy chuyên dụng và nhanh chóng thoát hiểm để bảo vệ tính mạng."
  }
];

const testimonials = [
  {
    name: "Nguyễn Minh Tuấn",
    role: "Học viên",
    avatar: "MT",
    content: "Khoá học PCCC ở FIREGUARD rất dễ hiểu, video minh hoạ trực quan. Mình biết cách dùng bình chữa cháy ngay sau bài đầu tiên.",
    rating: 5
  },
  {
    name: "Trần Thu Hà",
    role: "Giáo viên cấp 2",
    avatar: "TH",
    content: "Đem nội dung này vào tiết sinh hoạt cho học sinh, các em hứng thú và làm bài quiz đạt điểm rất cao.",
    rating: 5
  },
  {
    name: "Lê Quang Huy",
    role: "Quản lý toà nhà",
    avatar: "QH",
    content: "Đăng ký cho 30 nhân viên bảo vệ cùng học. Mỗi bài chỉ 1-2 phút, vừa đủ ngắn để tranh thủ giờ giải lao.",
    rating: 5
  },
  {
    name: "Phạm Khánh Linh",
    role: "Sinh viên",
    avatar: "KL",
    content: "Phần thoát hiểm khi cháy chung cư rất sát thực tế. Tương tác qua câu hỏi giúp mình nhớ kiến thức lâu hơn hẳn.",
    rating: 4
  },
  {
    name: "Đỗ Anh Khoa",
    role: "Phụ huynh",
    avatar: "AK",
    content: "Cho con học cùng để biết kỹ năng sống còn. Phụ huynh hoàn toàn yên tâm khi để con tự học một mình trên nền tảng.",
    rating: 5
  },
  {
    name: "Bùi Thị Mai",
    role: "Học viên",
    avatar: "TM",
    content: "Giảng viên trả lời comment rất nhanh. Câu hỏi nào cũng được giải đáp trong ngày. Rất đáng để đăng ký!",
    rating: 5
  }
];

const benefits = [
  {
    icon: "🎓",
    title: "Chứng nhận hoàn thành",
    desc: "Nhận chứng nhận hoàn thành khóa học sau khi vượt qua bài kiểm tra cuối khóa, ghi nhận nỗ lực và kỹ năng PCCC bạn đã rèn luyện."
  },
  {
    icon: "⏱️",
    title: "Học mọi lúc mọi nơi",
    desc: "Bài giảng ngắn 1-2 phút, tối ưu cho điện thoại và máy tính bảng. Học trong giờ nghỉ trưa hay trên xe buýt đều được."
  },
  {
    icon: "🎮",
    title: "Tương tác thực tế ảo",
    desc: "Mô phỏng tình huống cháy như thật qua video tương tác (interactive video). Bạn sẽ phải ra quyết định và thấy hậu quả từng lựa chọn."
  },
  {
    icon: "📊",
    title: "Theo dõi tiến độ",
    desc: "Hệ thống tự động lưu bài học đã xem, điểm quiz và thời gian học. Dễ dàng quay lại đúng chỗ bạn đã dừng."
  }
];

// Animated number counter — eases up to `target` once `start` becomes true.
function CountUp({ target, decimals = 0, format, start }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf;
    let t0 = null;
    const duration = 1500;
    const tick = (t) => {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);

  const display = format ? format(val) : val.toFixed(decimals);
  return <>{display}</>;
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
function getCourseThumb(video, idx) {
  // Ảnh theo đúng vị trí thẻ (ảnh 1..4)
  return FRAME_FALLBACK[idx % FRAME_FALLBACK.length];
}

function Homepage({ user = null, setView, onLogout, onAccount, onChangePassword, onStartLearning, showToast, totalStudents = null, videoCount = null, videos = [], onStartCourse }) {
  const startCourse = onStartCourse || (() => setView('register'));
  const [scrolled, setScrolled] = useState(false);
  const [animatedStats, setAnimatedStats] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const rootRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDocClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [userMenuOpen]);
  const displayName = user ? (user.fullName || user.name || user.email || 'Học viên') : '';
  const handleMenu = (fn) => { setUserMenuOpen(false); if (fn) fn(); };

  // Đồng bộ phần 'Lộ trình' với khóa học thật trong DB; fallback dữ liệu mẫu khi API lỗi
  const displayCourses = (videos && videos.length) ? videos.slice(0, 3) : featuredCourses;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Trigger stat counter animation after mount
    const timer = setTimeout(() => setAnimatedStats(true), 400);

    // Scroll-reveal: fade + rise elements into view as they enter the viewport
    const revealEls = rootRef.current
      ? rootRef.current.querySelectorAll('.hp-reveal')
      : [];
    let observer;
    if ('IntersectionObserver' in window && revealEls.length) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('hp-reveal-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      // No IO support → just show everything
      revealEls.forEach((el) => el.classList.add('hp-reveal-visible'));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    []
  );

  const fmtThousand = (v) => Math.round(v).toLocaleString('vi-VN');

  return (
    <div className="homepage-root" ref={rootRef}>
      {/* ========================================================================
          STICKY NAVBAR
          ======================================================================== */}
      <nav className={`hp-navbar${scrolled ? ' hp-navbar-scrolled' : ''}`}>
        <div className="hp-navbar-inner">
          {/* Brand */}
          <div className="hp-nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="hp-nav-logo-box">
              <img src="/logo_e.png" alt="FIREGUARD" className="hp-nav-logo-img" />
            </div>
            <span className="hp-nav-brand-name">FIREGUARD</span>
          </div>

          {/* Nav links (desktop) */}
          <div className="hp-nav-links">
            <button onClick={() => scrollToSection('hp-courses')} className="hp-nav-link">Khóa học</button>
            <button onClick={() => scrollToSection('hp-benefits')} className="hp-nav-link">Lợi ích</button>
            <button onClick={() => scrollToSection('hp-testimonials')} className="hp-nav-link">Đánh giá</button>
            <button onClick={() => scrollToSection('hp-faq')} className="hp-nav-link">Hỏi đáp</button>
            <button onClick={() => scrollToSection('hp-contact')} className="hp-nav-link">Liên hệ</button>
          </div>

          {/* Auth CTA buttons */}
          <div className="hp-nav-actions">
            {user ? (
              <div className="hp-nav-user-menu" ref={userMenuRef}>
                <button
                  type="button"
                  className={`hp-nav-user-trigger${userMenuOpen ? ' open' : ''}`}
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <span className="hp-nav-avatar">{displayName.charAt(0).toUpperCase()}</span>
                  <span className="hp-nav-username">{displayName}</span>
                  <span className="hp-nav-caret" aria-hidden="true">▾</span>
                </button>

                {userMenuOpen && (
                  <div className="hp-nav-dropdown" role="menu">
                    <div className="hp-nav-dd-header">
                      <span className="hp-nav-dd-avatar">{displayName.charAt(0).toUpperCase()}</span>
                      <div className="hp-nav-dd-id">
                        <span className="hp-nav-dd-name">{displayName}</span>
                        {user.email && <span className="hp-nav-dd-email">{user.email}</span>}
                      </div>
                    </div>

                    <div className="hp-nav-dd-divider" />
                    <span className="hp-nav-dd-label">Tài khoản</span>

                    <button className="hp-nav-dd-item" role="menuitem"
                      onClick={() => handleMenu(onAccount)}>
                      <span className="hp-nav-dd-ic">👤</span> Hồ sơ
                    </button>
                    <button className="hp-nav-dd-item" role="menuitem"
                      onClick={() => handleMenu(onChangePassword)}>
                      <span className="hp-nav-dd-ic">🔑</span> Đổi mật khẩu
                    </button>

                    <div className="hp-nav-dd-divider" />
                    <button className="hp-nav-dd-item logout" role="menuitem"
                      onClick={() => handleMenu(onLogout)}>
                      <span className="hp-nav-dd-ic">⎋</span> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="hp-btn hp-btn-ghost" onClick={() => setView('login')}>
                  Đăng nhập
                </button>
                <button className="hp-btn hp-btn-primary" onClick={() => setView('register')}>
                  Đăng ký ngay
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ========================================================================
          HERO SECTION
          ======================================================================== */}
      <section className="hp-hero">
        <div className="hp-hero-bg-pattern"></div>
        {/* Rising embers / sparks */}
        <div className="hp-embers" aria-hidden="true">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="hp-ember"
              style={{
                left: e.left,
                width: `${e.size}px`,
                height: `${e.size}px`,
                animationDelay: e.delay,
                animationDuration: e.dur,
              }}
            />
          ))}
        </div>
        <div className="hp-hero-content">
          <div className="hp-hero-text-col">
            <div className="hp-hero-badge">
              <span className="hp-hero-badge-dot"></span>
              Hơn {totalStudents != null ? totalStudents.toLocaleString('vi-VN') : '5.000+'} học viên đã tham gia
            </div>
            <h1 className="hp-hero-heading">
              Học kỹ năng <span className="hp-hero-highlight hp-flame-text">phòng cháy chữa cháy</span> qua mô phỏng tương tác thực tế
            </h1>
            <p className="hp-hero-subtitle">
              Trang bị cho bản thân và gia đình kiến thức sống còn chỉ trong vài phút mỗi ngày.
              Video bài giảng trực quan, tình huống mô phỏng chân thực, bài kiểm tra tương tác.
            </p>

            <div className="hp-hero-cta-row">
              <button className="hp-btn hp-btn-primary hp-btn-lg hp-btn-flame" onClick={() => onStartLearning && onStartLearning()}>
                Bắt đầu học miễn phí
                <span className="hp-btn-arrow">→</span>
              </button>
              <button className="hp-btn hp-btn-outline hp-btn-lg" onClick={() => scrollToSection('hp-courses')}>
                <span style={{ marginRight: '6px' }}>▶</span>
                Xem khóa học
              </button>
            </div>

            {/* Live stats row */}
            <div className={`hp-hero-stats${animatedStats ? ' hp-hero-stats-visible' : ''}`}>
              <div className="hp-hero-stat-item">
                <span className="hp-hero-stat-value">
                  {videoCount != null ? videoCount : <><CountUp target={100} start={animatedStats} />+</>}
                </span>
                <span className="hp-hero-stat-label">Bài học video</span>
              </div>
              <div className="hp-hero-stat-divider"></div>
              <div className="hp-hero-stat-item">
                <span className="hp-hero-stat-value">
                  {totalStudents != null
                    ? <CountUp target={totalStudents} start={animatedStats} format={fmtThousand} />
                    : <><CountUp target={5000} start={animatedStats} format={fmtThousand} />+</>}
                </span>
                <span className="hp-hero-stat-label">Học viên</span>
              </div>
              <div className="hp-hero-stat-divider"></div>
              <div className="hp-hero-stat-item">
                <span className="hp-hero-stat-value">
                  <CountUp target={4.9} decimals={1} start={animatedStats} />★
                </span>
                <span className="hp-hero-stat-label">Đánh giá</span>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hp-hero-visual-col">
            <div className="hp-hero-card">
              <div className="hp-hero-card-img-box">
                <img src="/training.png" alt="Huấn luyện PCCC" className="hp-hero-card-img" />
                <button
                  type="button"
                  className="hp-hero-card-play"
                  onClick={() => onStartLearning && onStartLearning()}
                  aria-label="Bắt đầu học"
                >
                  <span>▶</span>
                </button>
              </div>
              <div className="hp-hero-card-body">
                <span className="hp-hero-card-badge">🔥 Đang phát trực tiếp</span>
                <h4 className="hp-hero-card-title">Huấn luyện PCCC cơ bản</h4>
                <div className="hp-hero-card-progress">
                  <div className="hp-hero-card-progress-bar">
                    <div className="hp-hero-card-progress-fill" style={{ width: '68%' }}></div>
                  </div>
                  <span className="hp-hero-card-progress-text">{totalStudents != null ? totalStudents.toLocaleString('vi-VN') : '2.450'} học viên đang học</span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="hp-hero-float hp-hero-float-1">
              <span className="hp-hero-float-icon">🛡️</span>
              <div>
                <strong>An toàn</strong>
                <span>Kỹ năng sống còn</span>
              </div>
            </div>
            <div className="hp-hero-float hp-hero-float-2">
              <span className="hp-hero-float-icon">🔥</span>
              <div>
                <strong>{totalStudents != null ? totalStudents.toLocaleString('vi-VN') : '5.000+'}</strong>
                <span>Học viên tin dùng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================
          FEATURED COURSES
          ======================================================================== */}
      <section className="hp-section" id="hp-courses">
        <div className="hp-section-header hp-reveal">
          <span className="hp-section-tag">Khóa học nổi bật</span>
          <h2 className="hp-section-title">Lộ trình học tập PCCC từ cơ bản đến nâng cao</h2>
          <p className="hp-section-desc">
            Mỗi bài học là một tình huống mô phỏng thực tế, giúp bạn rèn luyện phản xạ và kỹ năng xử lý khi gặp hỏa hoạn.
          </p>
        </div>

        <div className="hp-courses-grid">
          {displayCourses.map((course, idx) => (
            <div
              key={course.id}
              className="hp-course-card hp-reveal"
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              <div
                className="hp-course-thumb"
                style={{ backgroundImage: `url('${getCourseThumb(course, idx)}')` }}
              >
                <div
                  className="hp-course-thumb-overlay"
                  onClick={() => startCourse(course)}
                  role="button"
                  aria-label="Học ngay"
                >
                  <div className="hp-course-play-btn">
                    <span>▶</span>
                  </div>
                </div>
                <span className={`hp-course-cat-tag hp-course-cat-${course.categoryKey}`}>
                  {course.category}
                </span>
                <span className="hp-course-number">Bài {idx + 1}</span>
              </div>
              <div className="hp-course-body">
                <h3 className="hp-course-title">{course.title}</h3>
                <p className="hp-course-desc">{course.description}</p>
                <div className="hp-course-footer-row">
                  <span className="hp-course-duration">
                    <span style={{ marginRight: '4px' }}>⏱️</span>
                    {course.duration && String(course.duration).trim() ? course.duration : '1-2 phút'}
                  </span>
                  <button
                    className="hp-course-cta"
                    onClick={() => startCourse(course)}
                  >
                    Học ngay →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hp-section-footer-cta">
          <button className="hp-btn hp-btn-primary hp-btn-lg" onClick={() => setView('register')}>
            Xem tất cả khóa học
          </button>
        </div>
      </section>

      {/* ========================================================================
          WHY FIREGUARD / BENEFITS
          ======================================================================== */}
      <section className="hp-section hp-section-alt" id="hp-benefits">
        <div className="hp-section-header hp-reveal">
          <span className="hp-section-tag">Tại sao chọn FIREGUARD</span>
          <h2 className="hp-section-title">Nền tảng học PCCC khác biệt và hiệu quả</h2>
          <p className="hp-section-desc">
            Chúng tôi kết hợp công nghệ mô phỏng tương tác và phương pháp sư phạm hiện đại để bạn học nhanh, nhớ lâu.
          </p>
        </div>

        <div className="hp-benefits-grid">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="hp-benefit-card hp-reveal"
              style={{ transitionDelay: `${idx * 0.08}s` }}
            >
              <div className="hp-benefit-icon-box">{b.icon}</div>
              <h3 className="hp-benefit-title">{b.title}</h3>
              <p className="hp-benefit-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================
          TESTIMONIALS
          ======================================================================== */}
      <section className="hp-section" id="hp-testimonials">
        <div className="hp-section-header hp-reveal">
          <span className="hp-section-tag">Đánh giá từ học viên</span>
          <h2 className="hp-section-title">Hơn {totalStudents != null ? totalStudents.toLocaleString('vi-VN') : '2.450'} đánh giá tích cực từ cộng đồng</h2>
          <p className="hp-section-desc">
            Học viên từ nhiều lứa tuổi và ngành nghề đã tin tưởng và gắn bó cùng FIREGUARD.
          </p>
        </div>

        <div className="hp-testimonials-grid">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="hp-testimonial-card hp-reveal"
              style={{ transitionDelay: `${(idx % 3) * 0.08}s` }}
            >
              <div className="hp-testimonial-stars">
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <p className="hp-testimonial-text">"{t.content}"</p>
              <div className="hp-testimonial-author">
                <div className="hp-testimonial-avatar">{t.avatar}</div>
                <div className="hp-testimonial-meta">
                  <strong className="hp-testimonial-name">{t.name}</strong>
                  <span className="hp-testimonial-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================
          FAQ
          ======================================================================== */}
      <section className="hp-section hp-section-alt" id="hp-faq">
        <div className="hp-section-header hp-reveal">
          <span className="hp-section-tag">Câu hỏi thường gặp</span>
          <h2 className="hp-section-title">Bạn còn băn khoăn điều gì?</h2>
          <p className="hp-section-desc">
            Những thắc mắc phổ biến nhất từ học viên trước khi bắt đầu hành trình học PCCC.
          </p>
        </div>

        <div className="hp-faq-list hp-reveal">
          {faqs.map((item, idx) => {
            const open = openFaq === idx;
            return (
              <div key={idx} className={`hp-faq-item${open ? ' hp-faq-open' : ''}`}>
                <button
                  className="hp-faq-question"
                  onClick={() => setOpenFaq(open ? -1 : idx)}
                  aria-expanded={open}
                >
                  <span>{item.q}</span>
                  <span className="hp-faq-icon">{open ? '−' : '+'}</span>
                </button>
                <div className="hp-faq-answer-wrap">
                  <p className="hp-faq-answer">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================
          EMERGENCY 114 HOTLINE BAND
          ======================================================================== */}
      <section className="hp-emergency">
        <div className="hp-emergency-inner hp-reveal">
          <div className="hp-emergency-pulse">
            <span className="hp-emergency-flame">🔥</span>
          </div>
          <div className="hp-emergency-text">
            <span className="hp-emergency-label">Khi có cháy, hãy gọi ngay</span>
            <a href="tel:114" className="hp-emergency-number">114</a>
            <span className="hp-emergency-sub">
              Cảnh sát PCCC &amp; Cứu nạn cứu hộ · Miễn phí · Trực 24/7
            </span>
          </div>
          <a href="tel:114" className="hp-btn hp-btn-white hp-btn-lg hp-emergency-cta">
            <PhoneIcon />
            <span style={{ marginLeft: '6px' }}>Gọi 114</span>
          </a>
        </div>
      </section>

      {/* ========================================================================
          BOTTOM CTA BANNER
          ======================================================================== */}
      <section className="hp-cta-banner">
        <div className="hp-cta-banner-bg"></div>
        <div className="hp-embers hp-embers-cta" aria-hidden="true">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="hp-ember hp-ember-light"
              style={{
                left: e.left,
                width: `${e.size}px`,
                height: `${e.size}px`,
                animationDelay: e.delay,
                animationDuration: e.dur,
              }}
            />
          ))}
        </div>
        <div className="hp-cta-banner-content">
          <h2 className="hp-cta-banner-title">
            Sẵn sàng bảo vệ bản thân và những người xung quanh?
          </h2>
          <p className="hp-cta-banner-text">
            Đăng ký tài khoản miễn phí ngay hôm nay và bắt đầu bài học đầu tiên. Chỉ mất vài phút!
          </p>
          <div className="hp-cta-banner-buttons">
            <button className="hp-btn hp-btn-white hp-btn-lg" onClick={() => setView('register')}>
              Tạo tài khoản miễn phí
              <span className="hp-btn-arrow" style={{ marginLeft: '8px' }}>→</span>
            </button>
            <button className="hp-btn hp-btn-white-ghost hp-btn-lg" onClick={() => setView('login')}>
              Tôi đã có tài khoản
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================
          FOOTER
          ======================================================================== */}
      <footer className="hp-footer" id="hp-contact">
        <div className="hp-footer-grid">
          {/* Brand column */}
          <div className="hp-footer-col hp-footer-col-brand">
            <div className="hp-footer-logo-row">
              <div className="hp-nav-logo-box" style={{ width: '36px', height: '36px' }}>
                <img src="/logo_e.png" alt="FIREGUARD" className="hp-nav-logo-img" />
              </div>
              <span className="hp-nav-brand-name">FIREGUARD</span>
            </div>
            <p className="hp-footer-brand-desc">
              Nền tảng học tập kỹ năng phòng cháy chữa cháy tương tác hàng đầu Việt Nam.
              Sứ mệnh của chúng tôi là trang bị kiến thức PCCC cho mọi người dân.
            </p>
          </div>

          {/* Quick links */}
          <div className="hp-footer-col">
            <h4 className="hp-footer-col-title">Truy cập nhanh</h4>
            <button onClick={() => scrollToSection('hp-courses')} className="hp-footer-link">Khóa học</button>
            <button onClick={() => scrollToSection('hp-benefits')} className="hp-footer-link">Lợi ích</button>
            <button onClick={() => scrollToSection('hp-testimonials')} className="hp-footer-link">Đánh giá</button>
            <button onClick={() => setView('register')} className="hp-footer-link">Đăng ký</button>
          </div>

          {/* Khóa học */}
          <div className="hp-footer-col">
            <h4 className="hp-footer-col-title">Khóa học phổ biến</h4>
            {(videos && videos.length ? videos : featuredCourses).slice(0, 4).map((c) => (
              <button key={c.id ?? c._id} onClick={() => startCourse(c)} className="hp-footer-link">
                {c.title}
              </button>
            ))}
          </div>

          {/* Contact */}
          <div className="hp-footer-col">
            <h4 className="hp-footer-col-title">Liên hệ</h4>
            <a href="tel:0848986575" className="hp-footer-contact-row">
              <span className="hp-footer-contact-icon"><PhoneIcon /></span>
              <span>0848 986 575</span>
            </a>
            <a href="mailto:taicahe@gmail.com" className="hp-footer-contact-row">
              <span className="hp-footer-contact-icon"><MailIcon /></span>
              <span>taicahe@gmail.com</span>
            </a>
            <div className="hp-footer-contact-row">
              <span className="hp-footer-contact-icon"><MapMarkerIcon /></span>
              <span>Hà Nội, Việt Nam</span>
            </div>
            <a
              href="https://www.facebook.com/profile.php?id=61590647753791"
              target="_blank"
              rel="noopener noreferrer"
              className="hp-footer-contact-row"
            >
              <span className="hp-footer-contact-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
                </svg>
              </span>
              <span>Facebook FIREGUARD</span>
            </a>
          </div>
        </div>

        <div className="hp-footer-bottom">
          <p>© {new Date().getFullYear()} FIREGUARD. Tất cả quyền được bảo lưu.</p>
          <div className="hp-footer-bottom-links">
            <span>Điều khoản sử dụng</span>
            <span className="hp-footer-dot">·</span>
            <span>Chính sách bảo mật</span>
            <span className="hp-footer-dot">·</span>
            <span>Liên hệ hỗ trợ</span>
          </div>
        </div>
      </footer>

      {/* ========================================================================
          SCROLL-TO-TOP (flame)
          ======================================================================== */}
      <button
        className={`hp-scroll-top${showTop ? ' hp-scroll-top-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
        title="Lên đầu trang"
      >
        <span className="hp-scroll-top-arrow">↑</span>
      </button>
    </div>
  );
}

export default Homepage;
