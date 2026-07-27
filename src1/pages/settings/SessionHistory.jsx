import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../../config';
import axios from 'axios';

const SessionHistory = () => {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError('');
    axios.get(`${baseURL}/session/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSessions(res.data.sessions || res.data.data || []))
      .catch(() => setError('Failed to load session history.'))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div >
      <div style={{ maxWidth: 1200, margin: '3rem auto', padding: '32px 12px' }}>
        <div style={{ flex: 1,  borderRadius: 14, boxShadow: '0 2px 16px rgba(230,51,154,0.07)', padding: '2rem 1.5rem', minHeight: 400 }}>
          <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Session History</h2>
          {loading ? (
            <div style={{ color: '#e6339a', fontWeight: 500, fontSize: 16 }}>Loading...</div>
          ) : error ? (
            <div style={{ color: '#e6339a', fontWeight: 500, fontSize: 16 }}>{error}</div>
          ) : sessions.length === 0 ? (
            <div style={{ color: '#888', fontSize: 15 }}>No session history found.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {sessions.map((s, i) => (
                <div key={s.id || i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i < sessions.length - 1 ? '1px solid #f3e6f3' : 'none',
                  fontSize: 14,
                  gap: 8,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontWeight: 600, color: '#23232a', fontSize: 15 }}>{s.device || 'Unknown Device'}</span>
                    <span style={{ color: '#888', fontSize: 13 }}>{s.location || 'Unknown Location'}</span>
                  </div>
                  <div style={{ color: '#a259e6', fontSize: 13, minWidth: 120, textAlign: 'right' }}>{s.time || s.timestamp || ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .session-history-flex { flex-direction: column !important; }
          .session-history-sidebar { min-width: 0 !important; margin-right: 0 !important; }
        }
        @media (max-width: 600px) {
          .session-history-flex { padding: 8px !important; }
          .session-history-content { padding: 1rem 4px !important; }
        }
      `}</style>
    </div>
  );
};

export default SessionHistory; 