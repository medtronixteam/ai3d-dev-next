import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../config';
import { useAuth } from '../../context/AuthContext';

const InviteAccept = () => {
  const { token: inviteTokenParam } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Save token from URL if present
    if (inviteTokenParam) {
      localStorage.setItem('invite_token', inviteTokenParam);
    }
    setChecking(false);
  }, [inviteTokenParam]);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!token && !checking) {
      navigate('/signin');
    }
  }, [token, checking, navigate]);

  // Always check localStorage for invite_token
  const inviteToken = localStorage.getItem('invite_token');

  useEffect(() => {
    // If logged in and no invite_token, redirect to home
    if (token && !inviteToken && !checking) {
      navigate('/');
    }
  }, [token, inviteToken, checking, navigate]);

  if (checking || (!token && !checking)) {
    return (
      <div className="animated-success-modal-overlay">
        <div className="animated-success-modal">
          <div className="animated-checkmark-wrap">
            <svg className="animated-checkmark" viewBox="0 0 52 52"><circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/></svg>
          </div>
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  // If inviteToken exists and user is logged in, show accept card
  if (token && inviteToken) {
    return <InviteAcceptCard inviteToken={inviteToken} />;
  }

  // Otherwise, nothing (or could show a message)
  return null;
};

const InviteAcceptCard = ({ inviteToken }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const handleAccept = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${baseURL}/team/invite/accept`,
        { token: inviteToken },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setSuccess(true);
        localStorage.removeItem('invite_token');
        setTimeout(() => navigate('/'), 1200);
      } else {
        setError(res.data?.message || 'Failed to accept invitation.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to accept invitation.');
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <div className="animated-success-modal-overlay">
        <div className="animated-success-modal">
          <div className="animated-checkmark-wrap">
            <svg className="animated-checkmark" viewBox="0 0 52 52"><circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark-check" fill="none" d="M14 27l7 7 16-16"/></svg>
          </div>
          <h3>Invitation accepted!</h3>
          <p>You have joined the team. Redirecting to home...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="animated-success-modal-overlay">
      <div className="animated-success-modal">
        <div className="animated-checkmark-wrap">
          <svg className="animated-checkmark" viewBox="0 0 52 52"><circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/><path className="checkmark-check" fill="none" d="M14 27l7 7 16-16"/></svg>
        </div>
        <h3>Accept Team Invitation</h3>
        <p>Click below to accept your invitation and join the team.</p>
        {error && <div className="confirm-modal-error">{error}</div>}
        <button className="btn btn-create" onClick={handleAccept} disabled={loading}>
          {loading ? 'Accepting...' : 'Accept Invitation'}
        </button>
      </div>
    </div>
  );
};

export default InviteAccept; 