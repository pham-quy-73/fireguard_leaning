import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import {
  FiretruckIcon,
  PlayMenuIcon,
  QuestionMarkIcon,
  ChatBubbleIcon,
  NotifyBellIcon,
} from "./Icons";

function Homepage({ setView, totalStudents, videoCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroTitle, setHeroTitle] = useState("Học cách phòng cháy chữa cháy để bảo vệ bản thân & gia đình");
  const [heroSubtitle, setHeroSubtitle] = useState("Hệ thống học tập tương tác giúp bạn nắm vững kỹ năng PCCC chỉ trong 30 phút mỗi ngày — qua các kịch bản cháy nổ thực tế tại chung cư, phòng trọ và nơi làm việc.");

  const [featuredLessons, setFeaturedLessons] = useState([
    {
      id: 1,
      icon: "🏢",
      category: "Cơ bản",
      title: "Mô phỏng cháy chung cư mini & kỹ năng thoát nạn",
      desc: "Vào vai Nam — sinh viên sống tại tầng 3, đưa ra quyết định sống còn trong từng giai đoạn của vụ cháy.",
    },
    {
      id: 2,
      icon: "🔥",
      category: "Thoát hiểm",
      title: "Sinh tồn trong vụ cháy phòng trọ giữa đêm",
      desc: "Bình nóng lạnh phát nổ, khói độc bao trùm — phản xạ sinh tử trong căn phòng 20m².",
    },
    {
      id: 3,
      icon: "🩹",
      category: "Sơ cứu",
      title: "Sơ cứu bỏng nhiệt & ngạt khói trong 5 phút đầu",
      desc: "Nhận biết cháy điện, tránh sai lầm hắt nước, dùng bình CO2 đúng cách để bảo vệ tính mạng.",
    },
  ]);

  const [features, setFeatures] = useState([
    {
      iconKey: "PlayMenuIcon",
      title: "Bài học tương tác H5P",
      desc: "Kịch bản rẽ nhánh đưa bạn vào tình huống thật. Mỗi lựa chọn dẫn đến một hệ quả khác nhau.",
    },
    {
      iconKey: "QuestionMarkIcon",
      title: "Kiểm tra sau mỗi bài",
      desc: "Câu hỏi bám sát tình huống khẩn cấp, chốt chắc kiến thức và đánh dấu bài học hoàn thành.",
    },
    {
      iconKey: "ChatBubbleIcon",
      title: "Diễn đàn cộng đồng",
      desc: "Trao đổi kỹ năng PCCC cùng hàng trăm học viên, có huy hiệu xác thực và đánh giá sao.",
    },
    {
      iconKey: "NotifyBellIcon",
      title: "Thông báo từ chuyên gia",
      desc: "Cập nhật nhanh các lưu ý an toàn và tình huống thực tế từ Ban quản trị nền tảng.",
    },
  ]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/homepage`)
      .then((res) => {
        if (res.data?.success && res.data.config) {
          const cfg = res.data.config;
          if (cfg.heroTitle) setHeroTitle(cfg.heroTitle);
          if (cfg.heroSubtitle) setHeroSubtitle(cfg.heroSubtitle);
          if (Array.isArray(cfg.featuredLessons) && cfg.featuredLessons.length > 0) {
            setFeaturedLessons(cfg.featuredLessons);
          }
          if (Array.isArray(cfg.features) && cfg.features.length > 0) {
            setFeatures(cfg.features);
          }
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy cấu hình trang chủ từ database:", err);
      });
  }, []);

  const getIcon = (key) => {
    switch (key) {
      case "PlayMenuIcon":
        return <PlayMenuIcon />;
      case "QuestionMarkIcon":
        return <QuestionMarkIcon />;
      case "ChatBubbleIcon":
        return <ChatBubbleIcon />;
      case "NotifyBellIcon":
        return <NotifyBellIcon />;
      default:
        return <PlayMenuIcon />;
    }
  };

  const stats = [
    { value: totalStudents ?? "—", label: "Học viên đang học" },
    { value: videoCount ?? "—", label: "Bài học video" },
    { value: "30 phút", label: "Mỗi ngày" },
    { value: "24/7", label: "Hỗ trợ chuyên gia" },
  ];

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const renderHeroTitle = () => {
    if (heroTitle === "Học cách phòng cháy chữa cháy để bảo vệ bản thân & gia đình") {
      return (
        <h1 className="hp-hero-title">
          Học cách <span className="hp-accent">phòng cháy chữa cháy</span>
          <br />
          để bảo vệ bản thân & gia đình
        </h1>
      );
    }
    
    // Fallback: Try to highlight "phòng cháy chữa cháy" in custom title
    const highlightText = "phòng cháy chữa cháy";
    if (heroTitle.toLowerCase().includes(highlightText)) {
      const parts = heroTitle.split(new RegExp(`(${highlightText})`, 'gi'));
      return (
        <h1 className="hp-hero-title">
          {parts.map((part, index) => 
            part.toLowerCase() === highlightText 
              ? <span key={index} className="hp-accent">{part}</span> 
              : part
          )}
        </h1>
      );
    }
    
    return <h1 className="hp-hero-title">{heroTitle}</h1>;
  };

  return (
    <div className="hp-page">
      {/* ===================== NAVBAR ===================== */}
      <nav className="hp-nav">
        <div className="hp-nav-inner">
          <div className="hp-brand" onClick={() => scrollToSection("hp-top")}>
            <div className="hp-brand-logo">
              <img src="/logo_e.png" alt="FIREGUARD" />
            </div>
            <span className="hp-brand-name">FIREGUARD</span>
          </div>

          <div className={`hp-nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <span onClick={() => scrollToSection("hp-lessons")}>Bài học</span>
            <span onClick={() => scrollToSection("hp-features")}>Tính năng</span>
            <span onClick={() => scrollToSection("hp-stats")}>Số liệu</span>
            <span onClick={() => scrollToSection("hp-contact")}>Liên hệ</span>
            <button
              className="hp-nav-login"
              onClick={() => {
                setMobileMenuOpen(false);
                setView("login");
              }}
            >
              Đăng nhập
            </button>
          </div>

          <button
            className="hp-burger"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Mở menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <header id="hp-top" className="hp-hero">
        <div className="hp-hero-bg" />
        <div className="hp-hero-inner">
          <div className="hp-hero-badge">
            <span className="hp-live-dot" />
            {totalStudents !== null
              ? `Đang có ${totalStudents} học viên cùng học`
              : "Cộng đồng học viên PCCC đang hoạt động"}
          </div>

          {renderHeroTitle()}

          <p className="hp-hero-sub">
            {heroSubtitle}
          </p>

          <div className="hp-hero-cta">
            <button
              className="hp-btn-primary"
              onClick={() => setView("register")}
            >
              Bắt đầu học miễn phí
            </button>
            <button
              className="hp-btn-ghost"
              onClick={() => scrollToSection("hp-lessons")}
            >
              Xem bài học thử
            </button>
          </div>

          <div className="hp-hero-trust">
            <FiretruckIcon />
            <span>
              Phát triển theo quy định PCCC Việt Nam · Miễn phí cho người học
            </span>
          </div>
        </div>
      </header>

      {/* ===================== LESSONS ===================== */}
      <section id="hp-lessons" className="hp-section hp-lessons-section">
        <div className="hp-container">
          <div className="hp-section-head">
            <span className="hp-eyebrow">Lộ trình học</span>
            <h2 className="hp-section-title">
              3 kịch bản sinh tử bạn sẽ phải vượt qua
            </h2>
            <p className="hp-section-desc">
              Đăng ký tài khoản để mở khóa toàn bộ bài học, làm quiz và lưu tiến
              độ.
            </p>
          </div>

          <div className="hp-lesson-grid">
            {featuredLessons.map((l) => (
              <div className="hp-lesson-card" key={l.id}>
                <div className="hp-lesson-top">
                  <span className="hp-lesson-icon">{l.icon}</span>
                  <span className="hp-lesson-cat">{l.category}</span>
                </div>
                <h3 className="hp-lesson-title">{l.title}</h3>
                <p className="hp-lesson-desc">{l.desc}</p>
                <button
                  className="hp-lesson-btn"
                  onClick={() => setView("register")}
                >
                  Đăng ký để học →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section id="hp-features" className="hp-section">
        <div className="hp-container">
          <div className="hp-section-head">
            <span className="hp-eyebrow">Tại sao chọn FIREGUARD?</span>
            <h2 className="hp-section-title">
              Học PCCC bằng trải nghiệm, không phải lý thuyết suông
            </h2>
            <p className="hp-section-desc">
              Mỗi bài học là một tình huống khẩn cấp có thật. Bạn được đưa vào
              vai nạn nhân và tự đưa ra quyết định — sai một bước có thể mất
              mạng.
            </p>
          </div>

          <div className="hp-feature-grid">
            {features.map((f, i) => (
              <div className="hp-feature-card" key={i}>
                <div className="hp-feature-icon">{f.iconKey ? getIcon(f.iconKey) : f.icon}</div>
                <h3 className="hp-feature-title">{f.title}</h3>
                <p className="hp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section id="hp-stats" className="hp-section hp-stats-section">
        <div className="hp-container hp-stats-grid">
          {stats.map((s, i) => (
            <div className="hp-stat" key={i}>
              <span className="hp-stat-value">{s.value}</span>
              <span className="hp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="hp-section">
        <div className="hp-container">
          <div className="hp-cta-banner">
            <div className="hp-cta-bg" />
            <div className="hp-cta-content">
              <h2>Sẵn sàng bảo vệ chính mình và người thân?</h2>
              <p>
                Đăng ký ngay — hoàn toàn miễn phí. Hoàn thành 80% khóa học để
                nhận chứng chỉ.
              </p>
              <div className="hp-cta-actions">
                <button
                  className="hp-btn-primary hp-btn-lg"
                  onClick={() => setView("register")}
                >
                  Tạo tài khoản miễn phí
                </button>
                <button
                  className="hp-btn-ghost hp-btn-ghost-light"
                  onClick={() => setView("login")}
                >
                  Tôi đã có tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONTACT + FOOTER ===================== */}
      <footer id="hp-contact" className="hp-footer">
        <div className="hp-container hp-footer-inner">
          <div className="hp-footer-brand">
            <div className="hp-brand">
              <div className="hp-brand-logo">
                <img src="/logo_e.png" alt="FIREGUARD" />
              </div>
              <span className="hp-brand-name">FIREGUARD</span>
            </div>
            <p className="hp-footer-tag">
              Nền tảng học tập PCCC tương tác — kiến thức chuẩn xác, ứng phó an
              toàn.
            </p>
          </div>

          <div className="hp-footer-cols">
            <div className="hp-footer-col">
              <h4>Liên hệ</h4>
              <p>📞 0848 986 575</p>
              <p>✉️ taicahe@gmail.com</p>
              <p>📍 Hà Nội, Việt Nam</p>
            </div>
            <div className="hp-footer-col">
              <h4>Nền tảng</h4>
              <p onClick={() => setView("login")}>Đăng nhập</p>
              <p onClick={() => setView("register")}>Đăng ký</p>
            </div>
            <div className="hp-footer-col">
              <h4>Khám phá</h4>
              <p onClick={() => scrollToSection("hp-lessons")}>Bài học</p>
              <p onClick={() => scrollToSection("hp-features")}>Tính năng</p>
              <p onClick={() => scrollToSection("hp-stats")}>Số liệu</p>
            </div>
          </div>
        </div>
        <div className="hp-footer-bottom">
          © {new Date().getFullYear()} FIREGUARD · Học để bảo vệ — bảo vệ để
          sống.
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
