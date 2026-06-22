import React, { useState } from 'react';
import axios from 'axios';
import { MailIcon, LockIcon, EyeIcon, UserSilhouetteIcon, PhoneIcon, MapMarkerIcon } from './Icons';
import { API_BASE_URL } from '../config';

function Register({ setView, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic empty validation
    if (!email.trim() || !password) {
      showToast('Vui lòng nhập đầy đủ Email và Mật khẩu!', 'error');
      return;
    }

    // 2. Full Name validation (At least 2 characters, no whitespaces only)
    const nameTrim = fullName.trim();
    if (!nameTrim) {
      showToast('Vui lòng nhập Họ và tên!', 'error');
      return;
    }
    if (nameTrim.length < 2) {
      showToast('Họ và tên phải dài ít nhất 2 ký tự!', 'error');
      return;
    }

    // 3. Phone Number validation (Vietnamese phone regex filter)
    const phoneTrim = phone.trim();
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneTrim) {
      showToast('Vui lòng nhập Số điện thoại liên hệ!', 'error');
      return;
    }
    if (!phoneRegex.test(phoneTrim)) {
      showToast('Số điện thoại không hợp lệ! Vui lòng nhập số Việt Nam (Ví dụ: 0912345678)', 'error');
      return;
    }

    // 4. Address validation
    const addressTrim = address.trim();
    if (!addressTrim) {
      showToast('Vui lòng cung cấp Địa chỉ cư trú!', 'error');
      return;
    }
    if (addressTrim.length < 5) {
      showToast('Vui lòng điền địa chỉ rõ ràng hơn (ít nhất 5 ký tự)!', 'error');
      return;
    }

    // 5. Email format validation
    const emailTrim = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      showToast('Định dạng Email không chính xác! (Ví dụ: abc@gmail.com)', 'error');
      return;
    }

    // 6. Password complexity length validation
    if (password.length < 6) {
      showToast('Mật khẩu đăng ký phải đạt tối thiểu từ 6 ký tự trở lên!', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { 
        email: emailTrim, 
        password,
        fullName: nameTrim,
        phone: phoneTrim,
        address: addressTrim
      });
      
      if (response.data.success) {
        showToast(response.data.message, 'success');
        setTimeout(() => {
          setView('login');
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đăng ký!';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="welcome-title">Đăng ký tài khoản</h1>
      <p className="welcome-subtitle">Bắt đầu lộ trình học tập để trang bị kỹ năng tự bảo vệ bản thân và cộng đồng.</p>

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
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>
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
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>
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
              onChange={(e) => setAddress(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <span className="form-label">Email tài khoản *</span>
          <div className="input-wrapper">
            <span className="input-icon-left"><MailIcon /></span>
            <input 
              type="email" 
              className="form-input" 
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
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
              onChange={(e) => setPassword(e.target.value)}
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
