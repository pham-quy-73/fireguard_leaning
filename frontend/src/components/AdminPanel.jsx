import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function AdminPanel({ showToast, videos = [], onRefreshVideos }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Editor states
  const [editingVideo, setEditingVideo] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Cơ bản');
  const [formIsNew, setFormIsNew] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('/anhdemo.png');
  const [formDescription, setFormDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAdminStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/admin/stats`);
      if (response.data.success) {
        setStats(response.data);
      } else {
        setError("Không thể tải thông tin thống kê.");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi kết nối cơ sở dữ liệu server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleRemindStudent = (studentName) => {
    showToast(`✉ Đã gửi thông báo nhắc nhở học tập tới học viên ${studentName}!`, 'success');
  };

  const handleOpenForm = (video) => {
    setEditingVideo(video);
    if (video) {
      setFormTitle(video.title || '');
      setFormCategory(video.category || 'Cơ bản');
      setFormIsNew(video.isNew || false);
      setFormUrl(video.videoUrl || '');
      setFormThumbnail(video.thumbnail || '/anhdemo.png');
      setFormDescription(video.description || '');
    } else {
      setFormTitle('');
      setFormCategory('Cơ bản');
      setFormIsNew(false);
      setFormUrl('');
      setFormThumbnail('/anhdemo.png');
      setFormDescription('');
    }
    setIsFormOpen(true);
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!formTitle || !formCategory || !formUrl) {
      showToast('Vui lòng điền đủ thông tin bắt buộc!', 'error');
      return;
    }

    // Dynamic processing to parse videoUrl from full iframe snippet if provided
    let cleanUrl = formUrl.trim();
    if (cleanUrl.toLowerCase().includes('<iframe')) {
      const match = cleanUrl.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        cleanUrl = match[1];
      }
    }

    setSaving(true);
    try {
      let response;
      if (editingVideo?.id) {
        // Edit existing
        response = await axios.put(`${API_BASE_URL}/api/auth/videos/${editingVideo.id}`, {
          title: formTitle,
          category: formCategory,
          videoUrl: cleanUrl,
          description: formDescription,
          thumbnail: formThumbnail,
          isNew: formIsNew
        });
      } else {
        // Create new
        response = await axios.post(`${API_BASE_URL}/api/auth/videos`, {
          title: formTitle,
          category: formCategory,
          videoUrl: cleanUrl,
          description: formDescription,
          thumbnail: formThumbnail,
          isNew: formIsNew
        });
      }

      if (response.data.success) {
        showToast(response.data.message || 'Lưu thành công!', 'success');
        setIsFormOpen(false);
        setEditingVideo(null);
        if (onRefreshVideos) onRefreshVideos();
        fetchAdminStats(); 
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin video!', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài học video này khỏi hệ thống?')) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/auth/videos/${id}`);
      if (response.data.success) {
        showToast('Đã xóa thành công bài học video!', 'success');
        if (onRefreshVideos) onRefreshVideos();
        fetchAdminStats();
      }
    } catch (err) {
      console.error(err);
      showToast('Không thể xóa bài học này!', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
        <h2>Đang đồng bộ dữ liệu MongoDB Admin...</h2>
        <p style={{ fontSize: '0.85rem', marginTop: '10px' }}>Vui lòng đợi giây lát.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2', color: '#b91c1c' }}>
        <h3>⚠️ Lỗi hệ thống</h3>
        <p>{error}</p>
        <button onClick={fetchAdminStats} style={{ marginTop: '15px', padding: '8px 16px', backgroundColor: '#b91c1c', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Thử lại</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', paddingBottom: '50px' }}>

      {/* Head row */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>👑</span>
          <div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#1e293b' }}>Hệ thống quản trị FIREGUARD</h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Trung tâm thống kê dữ liệu đào tạo PCCC và quản lý bài học tương tác H5P.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of cards */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Metric 1 */}
        <div style={{
          flex: '1',
          minWidth: '220px',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '2rem', opacity: '0.15' }}>👤</div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Tổng học viên</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1e293b', marginTop: '8px' }}>
            {stats.totalStudents || 0}
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '5px', fontWeight: '600' }}>👥 Hoạt động trực tiếp</p>
        </div>

        {/* Metric 2 */}
        <div style={{
          flex: '1',
          minWidth: '220px',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '2rem', opacity: '0.15' }}>💬</div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Lượt đánh giá</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#3b82f6', marginTop: '8px' }}>
            {stats.totalComments || 0}
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#3b82f6', marginTop: '5px', fontWeight: '600' }}>⭐ Thảo luận bài học</p>
        </div>

        {/* Metric 3 */}
        <div style={{
          flex: '1',
          minWidth: '220px',
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '2rem', opacity: '0.15' }}>🎬</div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Bài học trên lưới</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#c2182c', marginTop: '8px' }}>
            {videos.length}
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#c2182c', marginTop: '5px', fontWeight: '600' }}>🛡️ Chuẩn PCCC Quốc gia</p>
        </div>
      </div>

      {/* Dynamic Video CRUD section */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
            🎬 Quản lý bài học & giáo án video PCCC (H5P tương tác)
          </h3>
          <button 
            onClick={() => handleOpenForm(null)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#c2182c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ➕ Thêm bài học mới
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>ID bài</th>
                <th style={{ padding: '12px 16px' }}>Tên tiêu đề bài học</th>
                <th style={{ padding: '12px 16px' }}>Danh mục</th>
                <th style={{ padding: '12px 16px' }}>Embed URL</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                    Chưa có bài học nào được đăng tải trong hệ thống.
                  </td>
                </tr>
              ) : (
                videos.map((vid) => (
                  <tr key={vid.id || vid._id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#64748b' }}>
                      Bài {vid.id}
                    </td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#1e293b', maxWidth: '280px' }}>
                      {vid.title}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: vid.categoryKey === 'co-ban' ? '#eff6ff' : '#fff1f2',
                        color: vid.categoryKey === 'co-ban' ? '#3b82f6' : '#c2182c'
                      }}>
                        {vid.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#64748b', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href={vid.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
                        {vid.videoUrl}
                      </a>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenForm(vid)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#f1f5f9',
                            border: 'none',
                            color: '#3b82f6',
                            fontWeight: '700',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#f1f5f9',
                            border: 'none',
                            color: '#c2182c',
                            fontWeight: '700',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Stats table details block */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', marginBottom: '18px' }}>
          📈 Thống kê đánh giá & lượt học nâng cao từng Video
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Tên Video Bài Giảng</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Lượt đã xem</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Số Đánh giá</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Điểm trung bình</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => {
                const liveStat = stats.videoStats?.find(s => s.videoId === video.id) || {
                  watchedCount: 0,
                  commentsCount: 0,
                  avgRating: "5.0"
                };

                return (
                  <tr key={video.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.88rem' }} className="admin-table-row">
                    <td style={{ padding: '16px', fontWeight: '600', color: '#1e293b', maxWidth: '350px' }}>
                      Bài {video.id}: {video.title}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: '700', color: '#475569' }}>
                      👤 {liveStat.watchedCount} học viên
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', color: '#3b82f6', fontWeight: '700' }}>
                      💬 {liveStat.commentsCount} bình luận
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={{ color: '#fbbf24', fontWeight: '800' }}>★ {liveStat.avgRating}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Student registry block */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#1e293b', marginBottom: '18px' }}>
          📑 Danh sách tài khoản đăng ký hệ thống ({stats.studentList?.length || 0})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Họ và tên</th>
                <th style={{ padding: '12px 16px' }}>Điện thoại</th>
                <th style={{ padding: '12px 16px' }}>Địa chỉ liên hệ</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Đã xem</th>
                <th style={{ padding: '12px 16px' }}>Vai trò</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {stats.studentList?.map((stud) => (
                <tr key={stud.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{stud.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{stud.email}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#475569' }}>{stud.phone}</td>
                  <td style={{ padding: '16px', color: '#475569', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stud.address}</td>
                  <td style={{ padding: '16px', textAlign: 'center', fontWeight: '700', color: '#10b981' }}>
                    {stud.watchedCount} / {videos.length || 3} video
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      backgroundColor: stud.role === 'admin' ? '#fee2e2' : '#f1f5f9',
                      color: stud.role === 'admin' ? '#c2182c' : '#475569',
                      textTransform: 'uppercase'
                    }}>
                      {stud.role === 'admin' ? 'ADMIN' : 'STUDENT'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {stud.role !== 'admin' && (
                      <button
                        onClick={() => handleRemindStudent(stud.fullName)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f1f5f9',
                          border: 'none',
                          color: '#c2182c',
                          fontWeight: '700',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          transition: 'background-color 0.2s'
                        }}
                        className="back-hover-red"
                      >
                        ✉ Nhắc học
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal editor form rendering */}
      {isFormOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }} onClick={() => { setIsFormOpen(false); setEditingVideo(null); }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                {editingVideo?.id ? `✏️ Cập nhật bài học (Bài ${editingVideo.id})` : '➕ Thêm bài học mới'}
              </h3>
              <button 
                onClick={() => { setIsFormOpen(false); setEditingVideo(null); }}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVideo} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Tiêu đề bài học *</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Nhập tiêu đề hoặc tình huống bài học..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Danh mục bài học *</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Thoát hiểm">Thoát hiểm</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Tag bài học mới</label>
                  <select 
                    value={formIsNew ? 'true' : 'false'}
                    onChange={(e) => setFormIsNew(e.target.value === 'true')}
                    style={{
                      width: '100%',
                      padding: '10px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="false">Không (Thường)</option>
                    <option value="true">Có (Gắn tag MỚI)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Đường dẫn video / Embed H5P code Link *</label>
                <input 
                  type="text" 
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://fireguards.h5p.com/content/.../embed"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Đường dẫn ảnh Thumbnail</label>
                <input 
                  type="text" 
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="/anhdemo.png"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Mô tả chi tiết giáo án</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Nhập bối cảnh tình huống thực tế và các thử thách để hướng dẫn học viên thoát hiểm..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '10px'
              }}>
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditingVideo(null); }}
                  style={{
                    padding: '9px 16px',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '9px 18px',
                    backgroundColor: '#c2182c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    opacity: saving ? 0.6 : 1
                  }}
                >
                  {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPanel;
