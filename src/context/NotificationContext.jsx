import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { baseURL } from '../config';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { v4 as uuidv4 } from 'uuid';
import Subscription from '../pages/settings/Subscription';

export const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children,  fetchCoins }) => {
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [togglingNotifications, setTogglingNotifications] = useState(new Set());


  const getUserUniqueId = useCallback(() => {
    let userId = localStorage.getItem('userUniqueId');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('userUniqueId', userId);
      console.log('New User Unique ID generated:', userId);
    } else {
      console.log('Existing User Unique ID:', userId);
    }
    return userId;
  }, []);

  // 🔹 Firebase Config & Init
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

  // 🔹 Unauthorized handler
  const handleUnauthorized = useCallback(() => {
    localStorage.setItem('tokens', JSON.stringify([]));
    window.location.replace('/signin');
  }, []);

  // 🔹 Fetch notifications
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

  // 🔹 Send FCM token to backend
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
      console.log(' ' + res.data.message);
    } catch (err) {
      console.error('FCM token update failed:', err.response?.data || err.message);
    }
  };

  // 🔹 Compare and store FCM token (keep history, update latest only)
  const storeTokenInArray = async (fcmToken) => {
    let tokens = JSON.parse(localStorage.getItem('fcmTokens')) || [];
    console.log('Previous tokens:', tokens);

    // Sirf latest token ko backend bhejna hai
    if (tokens[0] !== fcmToken) {
      console.log('New token detected, sending to backend...');
      await sendFCMToken(fcmToken);
    } else {
      console.log('Token same as previous, skipping API call');
    }

    // History maintain karna hai → naya token hamesha pehle push hoga
    tokens = [fcmToken, ...tokens.filter((t) => t !== fcmToken)];

    localStorage.setItem('fcmTokens', JSON.stringify(tokens));
  };

  // 🔹 Setup Firebase Messaging
  const setupFirebaseMessaging = useCallback(async () => {
    try {
      const fcmToken = await getToken(messaging, {
        vapidKey:
          'BOU5C5tz_IZrKxNVrkDS40TfzmbJZX2OFPjoimXxx9SdoCvZsLzncmsDqLdbA9Tk9fv4lO_Ssx4ONi-ovdBygaA',
      });

      if (fcmToken) {
        console.log('✅ FCM Token:', fcmToken);
        await storeTokenInArray(fcmToken);
      } else {
        console.warn('⚠️ FCM token not generated.');
      }

      onMessage(messaging, async (payload) => {
        console.log('📩 Foreground message:', payload);

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

          if (payload.notification.body.includes('notification')) {
            console.log('Notification type received');
            setTimeout(() => {
              fetchNotifications();
            }, 500);
          } else if (payload.notification.body.includes('coin')) {
            console.log('Coin type received');
            if (typeof fetchCoins === 'function') {
              await fetchCoins();
            }
          } else {
            console.log('Unknown notification type:', payload.notification.body);
          }
        }
      });
    } catch (error) {
      console.error('Firebase messaging setup error:', error);
    }
  }, [messaging, fetchNotifications, fetchCoins]);

  // 🔹 Setup on mount
  useEffect(() => {
    if (token) {
      fetchNotifications();
      setupFirebaseMessaging();
    }
  }, [token, fetchNotifications, setupFirebaseMessaging]);

  // 🔹 Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${baseURL}/notifications/markasread`,
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

  // 🔹 Mark single notification as read
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

  // 🔹 Toggle read/unread for a single notification
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
