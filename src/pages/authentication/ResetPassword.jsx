import React, { useState, useEffect, useRef } from 'react';
import Logo from '../../assets/images/Logo.png';
import './SignIn.css';
import axios from 'axios';
import { baseURL } from '../../config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import successImg from '../../assets/images/success-img.png';

const themeColor = '#DE3996'; // Project's main color

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(120);
  const navigate = useNavigate();
  
  // Refs for OTP input boxes
  const otpRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === 2 && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, otpTimer]);

  useEffect(() => {
    if (step === 2) setOtpTimer(120);
  }, [step]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseURL}/forget-password`, { email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send OTP!');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP!');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${baseURL}/verify-otp`, { email, otp: otpString });
      toast.success('OTP verified!');
      setStep(3);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid OTP!');
    } finally {
      setLoading(false);
    }
  };

  // Step 2b: Resend OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(`${baseURL}/resend-otp`, { email });
      toast.success('OTP resent to your email!');
      setOtpTimer(120);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to resend OTP!');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== cPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${baseURL}/reset-password`, { email, password });
      toast.success('Password reset successful!');
      setStep(4);
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setPassword('');
      setCPassword('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reset password!');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Confirmation
  const handleGoToSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="container-fluid signin-form d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#fff' }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%', borderRadius: 16 }}>
        <div className="text-center mb-4">
          <img src={Logo} alt="Logo" style={{ width: 120 }} />
        </div>
        
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <h4 className="mb-3" style={{ color: themeColor }}>Forgot Password</h4>
            <p className="mb-3">Enter your email to receive an OTP.</p>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <FiMail 
                  style={{ 
                    position: 'absolute', 
                    left: 12, 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#999',
                    fontSize: 18
                  }} 
                />
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 40 }}
              />
            </div>
            </div>
            <div className="text-center">
              <button className="btn" style={{ background: themeColor, color: '#fff', width: '150px', padding: '10px 0' }} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
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
              <input
                    key={index}
                    ref={el => otpRefs.current[index] = el}
                type="tel"
                className="form-control"
                    style={{ 
                      width: 45, 
                      height: 45, 
                      textAlign: 'center', 
                      fontSize: 18,
                      fontWeight: 'bold',
                      border: digit ? `2px solid ${themeColor}` : '2px solid #ddd'
                    }}
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(index, e)}
                    onFocus={e => e.target.select()}
                  />
                ))}
              </div>
            </div>
            <div className="mb-2" style={{ textAlign: 'center', color: '#888', fontSize: 15 }}>
              {otpTimer > 0 ? `Resend available in ${Math.floor(otpTimer/60)}:${(otpTimer%60).toString().padStart(2,'0')}` : ''}
            </div>
            <div className="text-center mb-2">
              <button className="btn mb-2" style={{ background: themeColor, color: '#fff', width: '150px', padding: '10px 0' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            </div>
            <div className="text-center">
              <button type="button" className="btn btn-link" style={{ color: themeColor, width: '150px', padding: '10px 0' }} onClick={handleResendOtp} disabled={loading || otpTimer > 0}>
              Resend OTP
            </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h4 className="mb-3" style={{ color: themeColor }}>Reset Password</h4>
            
            <div className="mb-3" style={{ position: 'relative' }}>
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock 
                  style={{ 
                    position: 'absolute', 
                    left: 12, 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#999',
                    fontSize: 18
                  }} 
                />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="New password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                maxLength={30}
                autoComplete="off"
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                  style={{ paddingLeft: 40,  backgroundColor: '#F9F9F9',border: 'none' }}
              />
              <span
                  style={{ 
                    position: 'absolute', 
                    right: 12, 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    cursor: 'pointer', 
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                  }}
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
              </div>
            </div>

            <div className="mb-3" style={{ position: 'relative' }}>
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock 
                  style={{ 
                    position: 'absolute', 
                    left: 12, 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#999',
                    fontSize: 18
                  }} 
                />
                
              <input
                type={showCPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Confirm new password"
                required
                value={cPassword}
                onChange={e => setCPassword(e.target.value)}
                maxLength={30}
                autoComplete="off"
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                  style={{ paddingLeft: 40, backgroundColor: '#F9F9F9', border: 'none' }}
              />
              <span
                  style={{ 
                    position: 'absolute', 
                    right: 12, 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    cursor: 'pointer', 
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                  }}
                onClick={() => setShowCPassword(s => !s)}
              >
                {showCPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
            </div>
            </div>

            
            <div className="text-center">
              <button className="btn" style={{ background: themeColor, color: '#fff', width: '150px', padding: '10px 0' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="text-center">
            <img
              src={successImg}
              alt="Password reset success"
              style={{
                width: 127,
                height: 120,
                objectFit: 'cover',
                margin: '0 auto 20px',
                display: 'block'
              }}
            />
            <h4 className="mb-3" style={{ color: themeColor, fontWeight: 'bold' }}>Password Changed Successfully!</h4>
            <p className="mb-4" style={{ color: '#666', fontSize: 14, lineHeight: 1.5 }}>
              Your password has been changed successfully, we will let you know if there are more problems with your account.
            </p>
            <button className="btn" style={{ background: themeColor, color: '#fff', width: '150px', padding: '10px 0' }} onClick={handleGoToSignIn}>
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;