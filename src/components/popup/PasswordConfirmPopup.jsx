import React, { useState, useEffect } from 'react';
import { FiX, FiLock } from 'react-icons/fi';
import './LoginPopup.css';

const PasswordConfirmPopup = ({ open, onClose, onConfirm, loading, error, label }) => {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) setVisible(true);
    else setVisible(false);
    setPassword('');
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) onConfirm(password);
  };

  return open ? (
    <div className={`login-popup-overlay${visible ? ' visible' : ''}`} onClick={onClose}>
      <div className={`login-popup-content${visible ? ' visible' : ''}`} onClick={e => e.stopPropagation()} style={{ maxWidth: 380 , marginLeft : "10px" , marginRight : "10px"}}>
        <button className="close-btn" onClick={onClose}><FiX /></button>
        <div className="login-form-container" style={{ paddingTop: 8 }}>
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <FiLock style={{ fontSize: 36, color: '#e6339a', marginBottom: 6 }} />
            <h4 style={{ fontWeight: 700, margin: 0, fontSize: 20 }}>{label || 'Enter your password'}</h4>
            <div style={{ color: '#888', fontSize: 14, marginTop: 2 }}>For security, please confirm your password.</div>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ marginBottom: 12, height: 44, borderRadius: 8, border: '1px solid #ddd' }}
              autoFocus
              required
              maxLength={30}
            />
            {error && <div style={{ color: '#e6339a', fontSize: 14, marginBottom: 8 }}>{error}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={loading || !password.trim()} style={{ marginTop: 2 }}>
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default PasswordConfirmPopup; 