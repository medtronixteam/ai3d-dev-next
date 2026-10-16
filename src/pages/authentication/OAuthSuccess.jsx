import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import { goToPostLogin, startGoogleLogin } from '../../utils/authRedirect';

const OAuthSuccess = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
      setError('No token found in URL.');
      setLoading(false);
      return;
    }

    axios
      .get(`${baseURL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let userData = res.data?.user || res.data;

        if (!userData?.email && res.data?.email) {
          userData = { ...res.data, email: res.data.email };
        }

        if (!userData?.email) {
          throw new Error('User email missing from OAuth response');
        }

        login(token, userData);
        goToPostLogin();
      })
      .catch((err) => {
        console.error('OAuth success handling failed:', err);
        setError(err?.response?.data?.message || 'Login failed, please try again.');
        setLoading(false);
      });
  }, [login]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
      }}
    >
      {loading && (
        <>
          <div
            className="spinner-border"
            style={{ color: '#de3996', width: 48, height: 48 }}
            role="status"
          />
          <div style={{ marginTop: 24, fontWeight: 600, color: '#de3996', fontSize: 20 }}>
            Signing you in with Google...
          </div>
        </>
      )}
      {!loading && error && (
        <>
          <div style={{ color: '#de3996', fontWeight: 700, fontSize: 22, marginBottom: 16 }}>
            Login Failed
          </div>
          <div style={{ color: '#888', fontSize: 16, marginBottom: 24 }}>{error}</div>
          <button
            type="button"
            onClick={startGoogleLogin}
            style={{
              color: '#fff',
              background: '#de3996',
              padding: '10px 28px',
              borderRadius: 30,
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              marginTop: 12,
              boxShadow: '0 2px 12px rgba(222,57,150,0.08)',
              cursor: 'pointer',
            }}
          >
            Try Again with Google
          </button>
        </>
      )}
    </div>
  );
};

export default OAuthSuccess;
