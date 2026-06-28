import React, { useState } from 'react';
import axios from 'axios';
import { MailIcon, LockIcon, EyeIcon, UserSilhouetteIcon, PhoneIcon, MapMarkerIcon } from './Icons';
import { API_BASE_URL } from '../config';

function Register({ setView, showToast }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formMsg, setFormMsg] = useState({ text: '', type: '' });

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Basic empty validation for Username
    const usernameTrim = username.trim();
    if (!usernameTrim) {
      newErrors.username = 'Vui lòng nhập Tên đăng nhập!';
    }

    // 2. Full Name validation
    const nameTrim = fullName.trim();
    if (!nameTrim) {
      newErrors.fullName = 'Vui lòng nhập Họ và tên!';
    } else if (nameTrim.length < 2) {
      newErrors.fullName = 'Họ và tên phải dài ít nhất 2 ký tự!';
    }

    // 3. Phone Number validation
    const phoneTrim = phone.trim();
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneTrim) {
      newErrors.phone = 'Vui lòng nhập Số điện thoại!';
    } else if (!phoneRegex.test(phoneTrim)) {
      newErrors.phone = 'Số điện thoại không hợp lệ! Vui lòng nhập số Việt Nam (Ví dụ: 0912345678).';
    }

    // 4. Address validation
    const addressTrim = address.trim();
    if (!addressTrim) {
      newErrors.address = 'Vui lòng nhập Địa chỉ!';
    } else if (addressTrim.length < 5) {
      newErrors.address = 'Địa chỉ liên hệ phải từ 5 ký tự trở lên!';
    }

    // 5. Email format validation (only if provided)
    const emailTrim = email.trim();
    if (emailTrim) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrim)) {
        newErrors.email = 'Định dạng Email không chính xác! (Ví dụ: name@gmail.com)';
      }
    }

    // 6. Password complexity validation
    if (!password) {
      newErrors.password = 'Vui lòng nhập Mật khẩu!';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu đăng ký phải từ 6 ký tự trở lên!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setFormMsg({ text: '', type: '' });
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { 
        username: usernameTrim,
        email: emailTrim || undefined, 
        password,
        fullName: nameTrim,
        phone: phoneTrim,
        address: addressTrim
      });
      
      if (response.data.success) {
        setFormMsg({ text: response.data.message || 'Đăng ký tài khoản thành công!', type: 'success' });
        setTimeout(() => {
          setView('login');
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đăng ký!';
      if (msg.includes('Tên đăng nhập')) {
        setErrors({ username: msg });
      } else if (msg.includes('Email')) {
        setErrors({ email: msg });
      } else {
        setFormMsg({ text: msg, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="welcome-title">Đăng ký tài khoản</h1>
      <p className="welcome-subtitle">Bắt đầu lộ trình học tập để trang bị kỹ năng tự bảo vệ bản thân và cộng đồng.</p>

      {formMsg.text && (
        <div style={{
          padding: '12px 14px',
          borderRadius: '8px',
          fontSize: '0.84rem',
          marginBottom: '16px',
          border: `1px solid ${formMsg.type === 'success' ? '#10b981' : '#f87171'}`,
          backgroundColor: formMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: formMsg.type === 'success' ? '#065f46' : '#991b1b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '500'
        }}>
          <span>{formMsg.type === 'success' ? '✅' : '❌'}</span>
          <span>{formMsg.text}</span>
        </div>
      )}

      <form className="auth-form" onSubmit={handleRegisterSubmit}>
        <div className="form-group">
          <span className="form-label">Họ và tên</span>
          <div className="input-wrapper">
            <span className="input-icon-left"><UserSilhouetteIcon /></span>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: null }));
              }}
              style={errors.fullName ? { border: '1px solid #c2182c', backgroundColor: '#fff5f5' } : {}}
              disabled={loading}
            />
          </div>
          {errors.fullName && <span style={{ color: '#c2182c', fontSize: '0.78rem', marginTop: '2px', fontWeight: '500' }}>{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <span className="form-label">Số điện thoại</span>
          <div className="input-wrapper">
            <span className="input-icon-left"><PhoneIcon /></span>
            <input 
              type="tel" 
              className="form-input" 
              placeholder="0912345678"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
              }}
              style={errors.phone ? { border: '1px solid #c2182c', backgroundColor: '#fff5f5' } : {}}
              disabled={loading}
            />
          </div>
          {errors.phone && <span style={{ color: '#c2182c', fontSize: '0.78rem', marginTop: '2px', fontWeight: '500' }}>{errors.phone}</span>}
        </div>

        <div className="form-group">
          <span className="form-label">Địa chỉ</span>
          <div className="input-wrapper">
            <span className="input-icon-left"><MapMarkerIcon /></span>
            <input 
              type="text" 
              className="form-input" 
              placeholder="123 Đường ABC, Hà Nội"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address) setErrors(prev => ({ ...prev, address: null }));
              }}
              style={errors.address ? { border: '1px solid #c2182c', backgroundColor: '#fff5f5' } : {}}
              disabled={loading}
            />
          </div>
          {errors.address && <span style={{ color: '#c2182c', fontSize: '0.78rem', marginTop: '2px', fontWeight: '500' }}>{errors.address}</span>}
        </div>

        <div className="form-group">
          <span className="form-label">Tên đăng nhập *</span>
          <div className="input-wrapper">
            <span className="input-icon-left"><UserSilhouetteIcon /></span>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Nhập tên đăng nhập (ví dụ: nguyenvanan)"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors(prev => ({ ...prev, username: null }));
              }}
              style={errors.username ? { border: '1px solid #c2182c', backgroundColor: '#fff5f5' } : {}}
              required
              disabled={loading}
            />
          </div>
          {errors.username && <span style={{ color: '#c2182c', fontSize: '0.78rem', marginTop: '2px', fontWeight: '500' }}>{errors.username}</span>}
        </div>

        <div className="form-group">
          <span className="form-label">Email tài khoản (không bắt buộc)</span>
          <div className="input-wrapper">
            <span className="input-icon-left"><MailIcon /></span>
            <input 
              type="email" 
              className="form-input" 
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: null }));
              }}
              style={errors.email ? { border: '1px solid #c2182c', backgroundColor: '#fff5f5' } : {}}
              disabled={loading}
            />
          </div>
          {errors.email && <span style={{ color: '#c2182c', fontSize: '0.78rem', marginTop: '2px', fontWeight: '500' }}>{errors.email}</span>}
        </div>

        <div className="form-group">
          <span className="form-label">Mật khẩu *</span>
          <div className="input-wrapper">
            <span className="input-icon-left"><LockIcon /></span>
            <input 
              type={showPassword ? "text" : "password"} 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: null }));
              }}
              style={errors.password ? { border: '1px solid #c2182c', backgroundColor: '#fff5f5' } : {}}
              required
              disabled={loading}
            />
            <button 
              type="button" 
              className="input-icon-right"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <EyeIcon visible={showPassword} />
            </button>
          </div>
          {errors.password && <span style={{ color: '#c2182c', fontSize: '0.78rem', marginTop: '2px', fontWeight: '500' }}>{errors.password}</span>}
        </div>

        <button type="submit" className="submit-btn" style={{ marginTop: '5px', marginBottom: '20px' }} disabled={loading}>
          {loading ? 'Đang gửi...' : 'Đăng ký ngay'}
        </button>
      </form>

      <div className="auth-footer" style={{ marginBottom: '10px' }}>
        Đã có tài khoản?{' '}
        <span className="auth-redirect-link" onClick={() => setView('login')}>
          Đăng nhập tại đây
        </span>
      </div>
    </>
  );
}

export default Register;
