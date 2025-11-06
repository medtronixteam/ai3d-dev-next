import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './SignIn.css';
import Logo from '../../assets/images/Logo.png';
import Robot from '../../assets/images/robot-img.png';
import Google from '../../assets/images/google.png';
import Facebook from '../../assets/images/facebook.png';
// import Apple from "../../assets/images/apple-img.png";

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [updatesCheck, setUpdatesCheck] = useState(true);
  const { login, tokens, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (email === 'demo@demo.com' && password === 'demo123') {
        const demoUser = { email: 'demo@demo.com', name: 'Demo User' };
        login('demo-token', demoUser);
        
        // Login ke baad wait karte hain ke state update ho jaye
        setTimeout(() => {
          const inviteToken = localStorage.getItem('invite_token');
          if (inviteToken) {
            navigate(`/platform/team/invite/accept/${inviteToken}`);
          } else {
            navigate('/platform/');
          }
        }, 100);
        
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
      
      // Login ke baad wait karte hain ke state update ho jaye
      setTimeout(() => {
        const inviteToken = localStorage.getItem('invite_token');
        if (inviteToken) {
          navigate(`/platform/team/invite/accept/${inviteToken}`);
        } else {
          navigate('/platform/');
        }
      }, 100);
      
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sirf tab navigate karte hain jab user already logged in ho
    if (user && user.email) {
      const inviteToken = localStorage.getItem('invite_token');
      if (inviteToken) {
        navigate(`/platform/team/invite/accept/${inviteToken}`);
      }
    }
  }, []); 


  return (
    <>
      <div className="container-fluid signin-form">
        <div className="row">
          <div className="col-1">
            <Link to="/">
              <img src={Logo} alt="Logo" className="img-fluid d-block my-3 logo-animated" />
            </Link>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-6 col-12 p-0">
            <img src={Robot} alt="Robot" className="robot-img" />
          </div>
          <div className="col-md-7 col-lg-5 d-flex align-items-center justify-content-center pb-5">
            <div className="card w-100 mx-lg-4">
              <h3 className="fw-bold mb-2">Sign in</h3>
              <p className="mb-3">
                New user? <Link to="/signup">Create an account.</Link>
              </p>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-2 input-group-icon" style={{ position: 'relative' }}>
                  <label className="form-label">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={30}
                    autoComplete="off"
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: 9,
                      top: 46,
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check d-flex justify-content-center align-items-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label mx-1 mt-1" style={{fontSize: '15px !importamt'}} htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-decoration-none"
                    style={{ color: '#DE3996', fontSize: '15px' }}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="text-center mb-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Sign in...' : 'Continue'}
                  </button>
                </div>
                <div className="form-check mb-3 checkbox-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="updatesCheck"
                    checked={updatesCheck}
                    onChange={(e) => setUpdatesCheck(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="updatesCheck">
                    &nbsp;Send me updates via <a href="#">Email</a>.
                  </label>
                </div>
                <div className="or-divider">OR</div>
                {/* ================ social buttons ===================== */}
                <div className="social-buttons-container mt-3">
                  <button
                    type="button"
                    className="btn social-btn"
                    onClick={() => {
                      window.location.href = 'https://dev-backend.ai3dscanning.com/auth/google';
                    }}
                  >
                    <span className="social-icon">
                      <img src={Google} alt="Google" />
                    </span>
                    <span className="social-text">Continue with Google</span>
                  </button>
                  <button
                    type="button"
                    className="btn social-btn"
                    onClick={() => {
                      window.location.href = 'https://dev-backend.ai3dscanning.com/auth/facebook';
                    }}
                  >
                    <span className="social-icon">
                      <img src={Facebook} alt="Facebook" />
                    </span>
                    <span className="social-text">Continue with Facebook</span>
                  </button>
                  {/* <button type="button" className="btn social-btn">
                    <span className="social-icon">
                      <img src={Apple} alt="Apple" />
                    </span>
                    <span className="social-text">Continue with Apple</span>
                  </button> */}
                </div>
                {/* ================ social buttons  end ===================== */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
