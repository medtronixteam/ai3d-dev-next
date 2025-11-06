import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const GOOGLE_AUTH_URL = 'https://dev-backend.ai3dscanning.com/auth/google';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('token');
    setToken(t);
    if (!t) {
      setError('No token found in URL.');
      setLoading(false);
      return;
    }
    axios.get('https://app.ai3dscanning.com/api/user', {
      headers: {
        Authorization: `Bearer ${t}`
      }
    })
      .then(res => {
        login(t, res.data.user || res.data);
        navigate('/');
      })
      .catch(() => {
        setError('Login failed, please try again.');
        setLoading(false);
      });
  }, [login, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      {loading && (
        <>
          <div className="spinner-border" style={{ color: '#de3996', width: 48, height: 48 }} role="status" />
          <div style={{ marginTop: 24, fontWeight: 600, color: '#de3996', fontSize: 20 }}>Signing you in with Google...</div>
        </>
      )}
      {!loading && error && (
        <>
          <div style={{ color: '#de3996', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Login Failed</div>
          <div style={{ color: '#888', fontSize: 16, marginBottom: 24 }}>{error}</div>
          <a
            href={GOOGLE_AUTH_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', background: '#de3996', padding: '10px 28px', borderRadius: 30, fontWeight: 600, fontSize: 16, textDecoration: 'none', marginTop: 12, boxShadow: '0 2px 12px rgba(222,57,150,0.08)' }}
          >
            Try Again with Google
          </a>
        </>
      )}
    </div>
  );
};

export default OAuthSuccess; 