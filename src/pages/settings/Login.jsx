import React, { useState, useRef, useEffect } from 'react';
import PasswordConfirmPopup from '../../components/popup/PasswordConfirmPopup';
import { FiLock, FiSearch, FiEye, FiEyeOff, FiMail } from 'react-icons/fi';
import { RxHamburgerMenu } from 'react-icons/rx';
import SuccessImg from '../../assets/images/success-img.png';

import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import axios from 'axios';
import './LoginSettings.css';

const LoginSettings = () => {
  const { token, logout } = useAuth();
  const [popupType, setPopupType] = useState(null); // 'logout' | 'delete'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
    const event = new CustomEvent('sidebarToggle', { detail: { open: !sidebarOpen } });
    window.dispatchEvent(event);
  };

  const handleConfirm = async (password) => {
    setLoading(true);
    setError('');
    try {
      if (popupType === 'logout') {
        await axios.post(
          `${baseURL}/logout/all`,
          { password },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        await logout();
        window.location.href = '/signin';
      } else if (popupType === 'delete') {
        await axios.post(
          `${baseURL}/delete/account`,
          { password },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        await logout();
        window.location.href = '/signin';
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Incorrect password or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-login-bg">
      <style>{`
        .team-settings-page {
          min-height: 100vh;
          background: #fff;
          padding: 2rem 0;
        }
        
        .team-header-section {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-bottom: 2rem;
          padding: 0 2rem;
        }
        
        .team-search-container {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 237, 247, 1);
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          min-width: 265px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
          max-width: 400px;
          width: 100%;
        }
          .team-search-container input:focus + .team-search-container,
.team-search-container:has(input:focus) {
  box-shadow: 0 0 10px var(--primary-color) !important;
}
        
        .team-search-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          color: #232334;
          width: 100%;
        }
        
        .team-search-input::placeholder {
          color: #999;
        }
        
        .team-sidebar-toggle {
          display: none;
          background: #fff;
          color: #DE3996;
          border: 1px solid #eee;
          border-radius: 6px;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: background 0.2s, transform 0.3s, color 0.2s;
          position: relative;
          z-index: 1100;
          margin-right: 12px;
        }
        
        @media (max-width: 992px) {
          .team-header-section {
            justify-content: flex-start;
            padding: 0 1rem;
          }
          
          .team-sidebar-toggle {
            display: flex;
          }
          
          .team-search-container {
            flex: 1;
            min-width: 0;
            max-width: none;
            margin-left: 12px;
          }
        }
        
        [data-theme='dark'] .team-settings-page,
        .dark .team-settings-page {
          background: #18182a;
          color: #f3f3fa;
        }
        
        [data-theme='dark'] .team-search-container,
        .dark .team-search-container {
          background: #232334;
        }
        
        [data-theme='dark'] .team-search-input,
        .dark .team-search-input {
          color: #f3f3fa;
        }
        
        [data-theme='dark'] .team-search-input::placeholder,
        .dark .team-search-input::placeholder {
          color: #b3b3c6;
        }
        
        [data-theme='dark'] .team-sidebar-toggle,
        .dark .team-sidebar-toggle {
          background: #232334;
          color: #DE3996;
          border: 1px solid #39395a;
        }

        @media (max-width: 900px) {
          .settings-login-flex {
            flex-direction: column !important;
            gap: 0 !important;
            align-items: stretch !important;
          }
        }
        @media (max-width: 850px) {
          div[style*='max-width: 800px'] { max-width: 98vw !important; }
        }
        .settings-btn-primary:hover {
          background: #c91e7f !important;
          color: #fff !important;
        }
        .settings-btn-danger:hover {
          background: #e6339a !important;
          color: #fff !important;
          border-color: #e6339a !important;
        }
      `}</style>

      {/* Header with Search Bar */}
     

      <div
        className="settings-login-container"
        style={{ display: 'flex', flexDirection: 'column', gap: 0 }}
      >
         <div className="team-header-section">
        <button
          className="team-sidebar-toggle"
          onClick={handleSidebarToggle}
          aria-label="Open sidebar"
        >
          <RxHamburgerMenu />
        </button>
         <div className="team-search-container">
          <FiSearch style={{ color: '#999', fontSize: '18px', marginRight: '12px' }} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="team-search-input"
          />
        </div>
      </div>
       
        <div className="settings-note py-3">
          <div className="note-icon" aria-hidden="true">
            <FiLock />
          </div>

          <div className="note-content">
            <div className="note-title">Password</div>
         <div class="note-text">
             To add a password to your account for the first time, you will need to use the {" "}
             {/* <a onClick={() => setShowChangePassword(true)} */}
             <a 
              style={{ color: '#DE3996', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => setShowForgotPassword(true)}
              >password reset</a> page so we can verify your identity.
            </div>
            
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-heading">Security</div>
          <div className="settings-subheading">Sign out from all devices</div>
          <p className="settings-desc">
            Logged in on a shared device but forgot to sign out? End all sessions by sign out
            from all devices.
          </p>
          <button
            className="settings-btn-login"
            onClick={() => {
              setPopupType('logout');
              setError('');
            }}
          >
            Sign out from all devices
          </button>
        </div>

        <div className="settings-card">
          <div className="settings-heading">Delete your account</div>
          <div className="settings-subheading">Delete Account</div>
          <p className="settings-desc">
            By deleting your account, you'll no longer be able to access any of your data. This
            action cannot be undone.
          </p>
          <button
            className="settings-btn-login"
            onClick={() => {
              setPopupType('delete');
              setError('');
            }}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="profile-modal">
          <ChangePasswordModal
            onClose={() => setShowChangePassword(false)}
            onSuccess={() => {
              setShowChangePassword(false);
              setShowSuccess(true);
            }}
            onForgotPassword={() => {
              setShowChangePassword(false);
              setShowForgotPassword(true);
            }}
          />
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="profile-modal">
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="profile-modal">
          <SuccessModal
            onClose={() => setShowSuccess(false)}
            message="Password changed successfully!"
          />
        </div>
      )}

      <PasswordConfirmPopup
        open={!!popupType}
        onClose={() => {
          setPopupType(null);
          setError('');
        }}
        onConfirm={handleConfirm}
        loading={loading}
        error={error}
        label={
          popupType === 'logout'
            ? 'Sign out from all devices'
            : popupType === 'delete'
              ? 'Delete your account'
              : ''
        }
      />
    </div>
  );
};

// Modal styling constants
const modalBackdrop = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};
const modalAnim = {
  animation: 'modalPopIn 0.35s cubic-bezier(.68,-0.55,.27,1.55)',
};
const keyframes = `@keyframes modalPopIn { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }`;

const ChangePasswordModal = ({ onClose, onSuccess, onForgotPassword }) => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError('');
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${baseURL}/change-password`,
        {
          current_password: form.oldPassword,
          new_password: form.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={modalBackdrop}>
        <div
          className="change-password-modal"
          style={{
            borderRadius: 16,
            padding: 40,
            minWidth: 400,
            maxWidth: 520,
            minHeight: 340,
            position: 'relative',
            background: '#ffffffff',
            ...modalAnim,
          }}
        >
          <h3 style={{ fontWeight: 600, fontSize: 24, marginBottom: 28 }}>Change Your Password</h3>
          <div style={{ marginBottom: 20 }}>
            <label>Old Password</label>
            <div style={{ display: 'flex', alignItems: 'center' }} className='password'>
              <input
                name="oldPassword"
                type={showOld ? 'text' : 'password'}
                value={form.oldPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="Please enter your old password"
                required
                maxLength={30}
                
              />
               <span className="password-eye" onClick={() => setShowOld((s) => !s)}>
                {showOld ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
             
            </div>
            <button
              type="button"
              onClick={() => onForgotPassword && onForgotPassword()}
              className="forgot-link"
              style={{
                marginTop: 8,
                background: 'none',
                border: 'none',
                color: '#DE3996',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: 0,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Forgot password?
            </button>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label>New Password</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                name="newPassword"
                type={showNew ? 'text' : 'password'}
                placeholder="Please enter your new password"
                value={form.newPassword}
                onChange={handleChange}
                className="form-control"
                required
                maxLength={30}
              />
              <span className="password-eye" onClick={() => setShowNew((s) => !s)}>
                {showNew ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <label>Confirm Password</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Please confirm your new password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="form-control"
                required
                maxLength={30}
              />
              <span className="password-eye" onClick={() => setShowConfirm((s) => !s)}>
                {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </div>
          {error && (
            <div style={{ color: '#DE3996', marginBottom: 14, fontWeight: 500 }}>{error}</div>
          )}
          <div
            className="modal-actions"
            style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}
          >
            <button
              className="cancel-btn"
              onClick={onClose}
              style={{
                border: 'none',
                borderRadius: 6,
                padding: '10px 28px',
                fontWeight: 500,
                fontSize: 16,
                background: '#eee',
                color: '#22223b',
              }}
            >
              Cancel
            </button>
            <button
              className="save-btn"
              onClick={handleSave}
              style={{
                border: 'none',
                borderRadius: 6,
                padding: '10px 28px',
                fontWeight: 500,
                fontSize: 16,
                background: '#e6339a',
                color: '#fff',
                cursor: 'pointer',
              }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Forgot Password flow inside modal (reuses the same endpoints as ResetPassword page)
const ForgotPasswordModal = ({ onClose }) => {
  const themeColor = '#DE3996';
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(120);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === 2 && otpTimer > 0) timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  useEffect(() => { if (step === 2) setOtpTimer(120); }, [step]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) otpRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${baseURL}/forget-password`, { email });
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${baseURL}/verify-otp`, { email, otp: otpString });
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };
  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(`${baseURL}/resend-otp`, { email });
      setOtpTimer(120);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to resend OTP');
    } finally { setLoading(false); }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== cPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${baseURL}/reset-password`, { email, password });
      setStep(4);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="forgot-modal-backdrop">
        <div className="forgot-modal-content" style={{ position: 'relative', marginLeft : "10px", marginRight : "10px" }}>
<button className="forgot-modal-close" onClick={onClose}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
</button>


        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <h4 className="mb-3" style={{ color: themeColor }}>Forgot Password</h4>
            <p className="mb-3">Enter your email to receive an OTP.</p>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" className="form-control" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {error && <div style={{ color: '#DE3996', marginBottom: 14, fontWeight: 500 }}>{error}</div>}
            <div className="text-center">
              <button className="btn" style={{ background: themeColor, color: '#fff', width: 150, padding: '10px 0' }} disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP'}</button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <h4 className="mb-3" style={{ color: themeColor }}>Verify OTP</h4>
            <p className="mb-3">Enter the OTP sent to your email.</p>
            <div className="mb-3">
              <label className="form-label">OTP</label>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                {otp.map((digit, index) => (
                  <input key={index} ref={(el) => (otpRefs.current[index] = el)} type="tel" className="form-control" style={{ width: 45, height: 45, textAlign: 'center', fontSize: 18 }} maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} onFocus={(e) => e.target.select()} />
                ))}
              </div>
            </div>
            <div className="mb-2" style={{ textAlign: 'center', color: '#888', fontSize: 15 }}>
              {otpTimer > 0 ? `Resend available in ${Math.floor(otpTimer / 60)}:${(otpTimer % 60).toString().padStart(2, '0')}` : ''}
            </div>
            {error && <div style={{ color: '#DE3996', marginBottom: 14, fontWeight: 500, textAlign: 'center' }}>{error}</div>}
            <div className="text-center mb-2">
              <button className="btn mb-2" style={{ background: themeColor, color: '#fff', width: 150, padding: '10px 0' }} disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            </div>
            <div className="text-center">
              <button type="button" className="btn btn-link" style={{ color: themeColor, width: 150, padding: '10px 0' }} onClick={handleResendOtp} disabled={loading || otpTimer > 0}>Resend OTP</button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h4 className="mb-3" style={{ color: themeColor }}>Reset Password</h4>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="form-control" placeholder="New password" required value={password} onChange={(e) => setPassword(e.target.value)} maxLength={30} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setShowPassword((s) => !s)}>{showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}</span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' , width: '100%' }}>
                <input type={showCPassword ? 'text' : 'password'} className="form-control" placeholder="Confirm new password" required value={cPassword} onChange={(e) => setCPassword(e.target.value)} maxLength={30} />
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => setShowCPassword((s) => !s)}>{showCPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}</span>
              </div>
            </div>
            {error && <div style={{ color: '#DE3996', marginBottom: 14, fontWeight: 500 }}>{error}</div>}
            <div className="text-center">
              <button className="btn" style={{ background: themeColor, color: '#fff', width: 150, padding: '10px 0' }} disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </div>
          </form>
        )}
        {step === 4 && (
          <div className="text-center">
            <img src={SuccessImg} alt="Success" style={{ width: 127, height: 120, objectFit: 'cover', margin: '0 auto 20px', display: 'block' }} />
            <h4 className="mb-3" style={{ color: themeColor, fontWeight: 'bold' }}>Password Changed Successfully!</h4>
            <p className="mb-4" style={{ color: '#666', fontSize: 14, lineHeight: 1.5 }}>Your password has been changed successfully.</p>
            <div className="text-center"><button className="btn" style={{ background: themeColor, color: '#fff', width: 150, padding: '10px 0' }} onClick={onClose}>Close</button></div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

const SuccessModal = ({ onClose, message }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes checkmark { 0% { stroke-dashoffset: 50; } 100% { stroke-dashoffset: 0; } }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: isDarkMode ? '#232334' : '#fff',
            color: isDarkMode ? '#f3f3fa' : '#232334',
            borderRadius: 16,
            padding: 40,
            minWidth: 320,
            maxWidth: 420,
            minHeight: 220,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'popIn 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
            boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(34,34,59,0.13)',
          }}
        >
          <img
            src={SuccessImg}
            alt="Success"
            style={{
              width: 160,
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 8,
            }}
          />
          <h5
            style={{
              color: isDarkMode ? '#b3b3c6' : '#888',
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            {message || 'Your password has been changed successfully!'}
          </h5>
          <button
            onClick={onClose}
            style={{
              background: '#DE3996',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '8px 24px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#c91e7b')}
            onMouseLeave={(e) => (e.target.style.background = '#DE3996')}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginSettings;
