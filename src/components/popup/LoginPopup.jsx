import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import './LoginPopup.css';
import Google from "../../assets/images/google.png";
import { goToPostLogin, startGoogleLogin } from '../../utils/authRedirect';
import TurnstileWidget, { verifyTurnstile } from '../security/TurnstileWidget';

const LoginPopup = ({ onClose, onLoginSuccess, stayOnPage = false, onBeforeSocialLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, tokens, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);
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
    if (!turnstileToken) {
      toast.error('Please complete the security check.');
      return;
    }
    setLoading(true);
    try {
      const captchaOk = await verifyTurnstile(turnstileToken);
      if (!captchaOk) {
        toast.error('Security check failed. Please try again.');
        setTurnstileToken('');
        turnstileRef.current?.reset();
        setLoading(false);
        return;
      }
      const res = await axios.post(
        `${baseURL}/login`,
        { email, password },
        { skipAuthInterceptor: true },
      );

      // Debug: Response ko check karte hain
      console.log('API Response:', res.data);
      console.log('Token:', res.data.token);
      console.log('User data:', res.data.user);

      // Check karte hain ke response mein proper data hai ya nahi
      if (!res.data.token) {
        throw new Error('Token not received from server');
      }


      // User data ko validate aur format karte hain
      let userData = res.data.user;
      if (!userData || !userData.email) {
        // Fallback: agar user object nahi mila to email se basic object banate hain
        userData = {
          email: email,
          name: res.data.name || email.split('@')[0], // Default name
          ...res.data // Baaki jo bhi data hai wo merge kar dete hain
        };
      }

      console.log('Formatted user data:', userData);

      // Login function call karte hain
      login(res.data.token, userData);

      toast.success(res.data?.message || 'Login successful!');
      handleClose();

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      if (!stayOnPage) {
        goToPostLogin();
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
            New user? <Link to="/signup" onClick={handleClose} style={{ color: '#e6339a' }}>Create an account.</Link>
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
                autoComplete="off"
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
              />
              <span
                style={{ position: 'absolute', right: 9, top: 46, cursor: 'pointer', zIndex: 2 }}
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
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
            <TurnstileWidget ref={turnstileRef} onToken={setTurnstileToken} theme="light" />
            <div className="text-center mb-3">
              <button type="submit" className="btn btn-primary w-100" disabled={loading || !turnstileToken}>
                {loading ? 'Sign in...' : 'Continue'}
              </button>
            </div>
            <div className="or-divider">OR</div>
            <div className="social-buttons-container mt-3">
              <button
                type="button"
                className="btn social-btn"
                onClick={() => {
                  onBeforeSocialLogin?.();
                  startGoogleLogin(stayOnPage ? `${window.location.pathname}${window.location.search}` : '/3dio/');
                }}
              >
                <span className="social-icon">
                  <img src={Google} alt="Google" />
                </span>
                <span className="social-text">Continue with Google</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup; 
