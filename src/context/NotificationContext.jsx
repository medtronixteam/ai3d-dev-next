import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { baseURL } from '../config';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { v4 as uuidv4 } from 'uuid';

export const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children, fetchCoins }) => {
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [togglingNotifications, setTogglingNotifications] = useState(new Set());
  const [fcmToken, setFcmToken] = useState(null);

  const getUserUniqueId = useCallback(() => {
    let userId = localStorage.getItem('userUniqueId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userUniqueId', userId);
    }
    return userId;
  }, []);

  const firebaseConfig = {
    apiKey: 'AIzaSyC98Sgqe_JTdWt9PXB5oaNsmD9aUFakEgo',
    authDomain: 'ai-3d-scanning.firebaseapp.com',
    projectId: 'ai-3d-scanning',
    storageBucket: 'ai-3d-scanning.firebasestorage.app',
    messagingSenderId: '662482395801',
    appId: '1:662482395801:web:f910b703a44a4588f1ce08',
    measurementId: 'G-X3KS58GML6',
  };

  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  const handleUnauthorized = useCallback(() => {
    localStorage.setItem('tokens', JSON.stringify([]));
    window.location.replace('/signin');
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let notificationsArr = res.data?.all || res.data?.data || res.data || [];
      if (!Array.isArray(notificationsArr)) {
        const possibleArrays = Object.values(res.data).filter(Array.isArray);
        notificationsArr = possibleArrays[0] || [];
      }

      setNotifications(notificationsArr);
      setUnreadCount(notificationsArr.filter((n) => !n.read_at).length);
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [token, handleUnauthorized]);

  const sendFCMToken = async (fcmToken) => {
    try {
      const userUniqueId = getUserUniqueId();
      const res = await axios.post(
        `${baseURL}/update-token`,
        {
          token: fcmToken,
          device_id: userUniqueId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log('✅ FCM Token sent to backend');
    } catch (err) {
      console.error('❌ FCM token update failed:', err.response?.data || err.message);
    }
  };

  const storeTokenInArray = async (fcmToken) => {
    let tokens = JSON.parse(localStorage.getItem('fcmTokens')) || [];

    if (tokens[0] !== fcmToken) {
      await sendFCMToken(fcmToken);
    }

    tokens = [fcmToken, ...tokens.filter((t) => t !== fcmToken)];
    localStorage.setItem('fcmTokens', JSON.stringify(tokens));
  };

  const setupFirebaseMessaging = useCallback(async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey:
          'BOU5C5tz_IZrKxNVrkDS40TfzmbJZX2OFPjoimXxx9SdoCvZsLzncmsDqLdbA9Tk9fv4lO_Ssx4ONi-ovdBygaA',
      });

      if (token) {
        setFcmToken(token);
        await storeTokenInArray(token);
      } else {
        console.warn('⚠️ FCM token not generated.');
      }

      onMessage(messaging, async (payload) => {
        if (payload?.notification) {
          const newNotif = {
            id: Date.now(),
            title: payload.notification.title,
            message: payload.notification.body || payload.notification.title,
            created_at: new Date().toISOString(),
            read_at: null,
          };

          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);

          toast.success(newNotif.title, {
            className: 'pink-toast',
          });

          console.log('FCM Notification received in foreground:', payload);
          const title = (payload.notification.title || '').toLowerCase();
          const body = (payload.notification.body || '').toLowerCase();
          const combined = `${title} ${body}`;
          
          if (combined.includes('notification')) {
            setTimeout(() => {
              fetchNotifications();
            }, 500);
          } 
          else if (combined.includes('coin')) {
            if (typeof fetchCoins === 'function') {
              await fetchCoins();
            }
          } 
          else if (combined.includes('extraction')) {
            window.dispatchEvent(new CustomEvent('videoProcessingComplete', {
              detail: { 
                notification: payload.notification,
                body: payload.notification.body 
              }
            }));
            
            setTimeout(() => {
              fetchNotifications();
            }, 500);
          }
          else if (combined.includes('complete') || combined.includes('ready') || combined.includes('success') || combined.includes('generated') || combined.includes('finish') || combined.includes('done')) {
            console.log('Project completion matched, dispatching projectProcessingComplete event');
            window.dispatchEvent(new CustomEvent('projectProcessingComplete', {
              detail: { 
                notification: payload.notification,
                body: payload.notification.body 
              }
            }));
            
            setTimeout(() => {
              fetchNotifications();
            }, 500);
          }
        }
      });
    } catch (error) {
      console.error('Firebase messaging setup error:', error);
    }
  }, [messaging, fetchNotifications, fetchCoins]);

  useEffect(() => {
    if (token) {
      fetchNotifications();
      setupFirebaseMessaging();
    }
  }, [token, fetchNotifications, setupFirebaseMessaging]);

  const markAllAsRead = async () => {
    try {
      await axios.get(
        `${baseURL}/notification/markasread`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Mark all read failed:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.post(
        `${baseURL}/notifications/${id}/mark-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date() } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Mark read failed:', err);
    }
  };

  const toggleNotificationRead = useCallback(
    async (notificationId) => {
      if (!token) return;

      setTogglingNotifications((prev) => new Set(prev).add(notificationId));
      try {
        const currentNotification = notifications.find((n) => n.id === notificationId);
        const isCurrentlyRead = !!currentNotification?.read_at;
        const action = isCurrentlyRead ? 'mark_as_unread' : 'mark_as_read';

        await axios.post(
          `${baseURL}/notification/markasread`,
          {
            action,
            notification_id: notificationId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        fetchNotifications();
      } catch (err) {
        if (err.response?.status === 401) handleUnauthorized();
      } finally {
        setTogglingNotifications((prev) => {
          const newSet = new Set(prev);
          newSet.delete(notificationId);
          return newSet;
        });
      }
    },
    [token, notifications, fetchNotifications, handleUnauthorized],
  );

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        loading,
        togglingNotifications,
        fcmToken,
        refresh: fetchNotifications,
        markAllAsRead,
        markAsRead,
        toggleNotificationRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};