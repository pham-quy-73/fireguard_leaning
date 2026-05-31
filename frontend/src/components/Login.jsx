import React, { useState } from 'react';
import axios from 'axios';
import { MailIcon, LockIcon, EyeIcon, FiretruckIcon } from './Icons';
import { API_BASE_URL } from '../config';

function Login({ setView, setUser, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Vui lòng nhập Email và Mật khẩu!', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      
      if (response.data.success) {
        showToast(response.data.message, 'success');
        const loggedUser = response.data.user;
        setUser(loggedUser);
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(loggedUser));
        } else {
          sessionStorage.setItem('user', JSON.stringify(loggedUser));
        }
        
        setTimeout(() => {
          setView('videos_dashboard');
        }, 800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể kết nối đến máy chủ!';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="welcome-title">Chào mừng trở lại</h1>
      <p className="welcome-subtitle">Vui lòng đăng nhập để tiếp tục lộ trình học an toàn PCCC của bạn.</p>

      <form className="auth-form" onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <span className="form-label">Email</span>
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
          <div className="form-label-row">
            <span className="form-label">Mật khẩu</span>
            <span className="forgot-password-link" onClick={() => showToast('Tính năng khôi phục mật khẩu sẽ được hỗ trợ sơm!', 'success')}>Quên mật khẩu?</span>
          </div>
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

        <div className="remember-row">
          <input 
            type="checkbox" 
            id="remember" 
            className="checkbox-custom" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="remember" className="checkbox-label">Ghi nhớ đăng nhập</label>
        </div>

        <button type="submit" className="submit-btn" style={{ marginBottom: '30px' }} disabled={loading}>
          {loading ? 'Đang xác thực...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="auth-footer">
        Chưa có tài khoản?{' '}
        <span className="auth-redirect-link" onClick={() => setView('register')}>
          Đăng ký ngay
        </span>
      </div>
    </>
  );
}

export default Login;
