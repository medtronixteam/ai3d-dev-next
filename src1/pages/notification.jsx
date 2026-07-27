import React, { useState, useEffect } from 'react';
import './notification.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { baseURL } from '../config';

const PAGE_SIZE = 10;

const Notification = () => {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseURL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let notificationsArr = [];
        if (Array.isArray(res.data)) {
          notificationsArr = res.data;
        } else if (Array.isArray(res.data.data)) {
          notificationsArr = res.data.data;
        } else if (res.data.data && Array.isArray(res.data.data.data)) {
          notificationsArr = res.data.data.data;
        }
        setNotifications(notificationsArr);
        setTotalPages(1); 
      } catch (err) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchNotifications();
    }
  }, [page, token]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.get(`${baseURL}/notification/markasread/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (err) {
      // Ignore error
    }
  };

  return (
    <div className="notification-container">
      <h2 className="notification-title">Notifications</h2>
      <div className="notification-list">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>No notifications found.</div>
        ) : notifications.map((n) => (
          <div className={`notification-card${!n.read_at ? ' unread' : ''}`} key={n.id} onClick={() => !n.read_at && handleMarkAsRead(n.id)}>
            <div className="notification-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="notification-dot" />
              <div className="notification-message" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxHeight: '3em',
                lineHeight: '1.5em',
                width: '100%',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              }}>{(n.data?.message || n.message).replace(/\r\n|\n|\r/g, ' ')}</div>
            </div>
            <span className="notification-date">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</span>
          </div>
        ))}
      </div>
      <div className="notification-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Notification; 