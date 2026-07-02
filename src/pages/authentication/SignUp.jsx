import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './SignUp.css';
import Logo from 'pages/images/logo.png';
import Robot from '../../assets/images/robot-img.png';
import { useSearchParams } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const referral = searchParams.get("referral");
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== cPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/signup`, {
        name: username,
        email,
        password,
        referral: referral || null,
      });

      const message =
        res.data?.message || 'Account created successfully! Please verify your email.';
      const isSuccess = res.status >= 200 && res.status < 300 && res.data?.success !== false;

      if (isSuccess) {
        toast.success(message);
        navigate('/signin');
      } else {
        toast.error(message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid signup-form">
        <div className="row">
          <div className="col-1">
            <Link to="/">
              <img src={Logo} alt="Logo" className="img-fluid d-block my-3 logo-animated" />
            </Link>
          </div>
        </div>
        <div className="row justify-content-center ">
          {/* Left Image (Always Visible) */}
          <div className="col-md-4 col-lg-6 col-12 p-0">
            <img src={Robot} alt="Robot" className="robot-img" />
          </div>
          {/* Right Form */}
          <div className="col-md-7 col-lg-5 d-flex align-items-center justify-content-center pb-5">
            <div className="cards w-100 mx-lg-4">
              <div className="card-body">
                <h2>Sign up</h2>
                <p>
                  Already have an account? <Link to="/signin">Sign in.</Link>
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="form-group" style={{ animationDelay: '0.4s' }}>
                    <label htmlFor="username">
                      <i className="bx bx-user mr-2" />
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      placeholder="Enter your User name"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ animationDelay: '0.2s' }}>
                    <label htmlFor="email">
                      <i className="bx bx-envelope mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your Email address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div
                    className="form-group"
                    style={{ animationDelay: '0.6s', position: 'relative' }}
                  >
                    <label htmlFor="password">
                      <i className="bx bx-lock mr-2" />
                      Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Enter your Password"
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
                        right: 6,
                        top: 36,
                        cursor: 'pointer',
                        zIndex: 2,
                      }}
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                    </span>
                  </div>
                  <div
                    className="form-group"
                    style={{ animationDelay: '0.8s', position: 'relative' }}
                  >
                    <label htmlFor="c_password">
                      <i className="bx bx-lock mr-2" />
                      Confirm Password
                    </label>
                    <input
                      type={showCPassword ? 'text' : 'password'}
                      className="form-control"
                      id="c_password"
                      name="c_password"
                      placeholder="Confirm your Password"
                      required
                      value={cPassword}
                      onChange={(e) => setCPassword(e.target.value)}
                      maxLength={30}
                      autoComplete="off"
                      onCopy={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        right: 6,
                        top: 36,
                        cursor: 'pointer',
                        zIndex: 2,
                      }}
                      onClick={() => setShowCPassword((s) => !s)}
                    >
                      {showCPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                    </span>
                  </div>
                  <div className="text-center">
                    <button
                      className="btn btn-primary rounded-pill px-5 py-2 mt-2"
                      disabled={loading}
                    >
                      {loading ? 'SignUp..' : 'SignUp'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;
