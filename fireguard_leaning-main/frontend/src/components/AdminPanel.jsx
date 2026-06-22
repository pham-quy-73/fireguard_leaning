import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// 6 default course videos reference list matching catalog
const allCourseVideos = [
  { id: 1, title: "Mô phỏng tình huống cháy chung cư mini và kỹ năng thoát nạn an toàn." },
  { id: 2, title: "Thoát hiểm giữa đêm đông: Sinh tồn trong vụ cháy phòng trọ" },
  { id: 3, title: "Sơ cứu bỏng nhiệt và ngạt khói tại chỗ trong 5 phút đầu" }
];

function AdminPanel({ showToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>👑</span>
          <div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#1e293b' }}>Hệ thống quản trị FIREGUARD</h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Trung tâm thống kê dữ liệu đào tạo PCCC thời gian thực.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of cards */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Metric 1 */}
        <div className="admin-metric-card" style={{
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
        <div className="admin-metric-card" style={{
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
        <div className="admin-metric-card" style={{
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
            3
          </h2>
          <p style={{ fontSize: '0.72rem', color: '#c2182c', marginTop: '5px', fontWeight: '600' }}>🛡️ Chuẩn PCCC Quốc gia</p>
        </div>
      </div>

      {/* Main Stats table details block */}
      <div className="admin-table-wrapper" style={{
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
              {allCourseVideos.map((video) => {
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
      <div className="admin-table-wrapper" style={{
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
                    {stud.watchedCount} / 6 video
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

    </div>
  );
}

export default AdminPanel;
