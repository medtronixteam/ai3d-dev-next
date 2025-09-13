import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import './LoginPopup.css';
import Google from "../../assets/images/google.png";
import Facebook from "../../assets/images/facebook.png";

const LoginPopup = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Match animation duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/login`, { email, password }, { skipAuthInterceptor: true });
      login(res.data.token, res.data.user);
      toast.success(res.data?.message || 'Login successful!');
      handleClose();
      
      // Call onLoginSuccess callback if provided, otherwise reload page
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Reload to reflect login state
        window.location.reload();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-popup-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div className={`login-popup-content ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}><FiX /></button>
        <div className="login-form-container">
          <h3 className="fw-bold mb-2">Sign in</h3>
          <p className="mb-3">
            New user? <Link to="/signup" onClick={handleClose} style={{color: '#e6339a'}}>Create an account.</Link>
          </p>
          <form onSubmit={handleSubmit} autoComplete='off'>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2 input-group-icon" style={{ position: 'relative' }}>
              <label className="form-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                maxLength={30}
              />
              <span
                style={{ position: 'absolute', right: 9, top: 46, cursor: 'pointer', zIndex: 2 }}
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check d-flex justify-content-center align-items-center" >
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMePopup"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label mx-1 mt-1" style={{ fontSize: '12px' }} htmlFor="rememberMePopup">
                  Remember me
                </label>
              </div>
              <Link
                to="/reset-password"
                onClick={handleClose}
                className="text-decoration-none"
                style={{ color: "#DE3996" }}
              >
                Forgot Password?
              </Link>
            </div>
            <div className="text-center mb-3">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Sign in...' : 'Continue'}
              </button>
            </div>
            <div className="or-divider">OR</div>
            <div className="social-buttons-container mt-3">
              <button type="button" className="btn social-btn" onClick={() => {
                window.location.href = 'https://app.ai3dscanning.com/auth/google';
              }}>
                <span className="social-icon">
                  <img src={Google} alt="Google" />
                </span>
                <span className="social-text">Continue with Google</span>
              </button>
              <button type="button" className="btn social-btn" onClick={() => {
                // For social login, we'll need to handle the redirect back
                // For now, just redirect and let the main app handle the success
                window.location.href = 'https://app.ai3dscanning.com/auth/facebook';
              }}>
                <span className="social-icon">
                  <img src={Facebook} alt="Facebook" />
                </span>
                <span className="social-text">Continue with Facebook</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup; 
