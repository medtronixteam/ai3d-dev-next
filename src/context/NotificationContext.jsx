import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { baseURL } from '../config';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [togglingNotifications, setTogglingNotifications] = useState(new Set());
  const pollingRef = useRef();

  // Fetch notifications and unread count
  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }
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
      const unread = notificationsArr.filter(n => !n.read_at).length;
      setUnreadCount(unread);
    } catch (err) {
      setUnreadCount(0);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    setMarkAllLoading(true);
    try {
      await axios.get(`${baseURL}/notification/markasread`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // After marking as read, refresh notifications
      fetchNotifications();
    } catch (err) {
      // Ignore error
    } finally {
      setMarkAllLoading(false);
    }
  }, [token, fetchNotifications]);

  // Toggle individual notification read status
  const toggleNotificationRead = useCallback(async (notificationId) => {
    if (!token) return;
    
    // Add to toggling set to show loading state
    setTogglingNotifications(prev => new Set(prev).add(notificationId));
    
    try {
      // Find the current notification to check if it's read or unread
      const currentNotification = notifications.find(n => n.id === notificationId);
      const isCurrentlyRead = !!currentNotification?.read_at;
      
      // Determine action based on current state
      const action = isCurrentlyRead ? 'mark_as_unread' : 'mark_as_read';
      
      // Make POST request with action and notification_id
      await axios.post(`${baseURL}/notification/markasread`, {
        action: action,
        notification_id: notificationId
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh notifications to get updated state
      fetchNotifications();
    } catch (err) {
      console.error('Error toggling notification read status:', err);
    } finally {
      // Remove from toggling set
      setTogglingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  }, [token, notifications, fetchNotifications]);

  // Poll every 10 seconds
  useEffect(() => {
    fetchNotifications();
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(fetchNotifications, 10000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchNotifications]);

  // Removed automatic markAllAsRead on mount to preserve unread notifications
  // Users must manually mark notifications as read by clicking on them

  return (
    <NotificationContext.Provider value={{ 
      unreadCount, 
      notifications, 
      loading, 
      markAllLoading,
      togglingNotifications, 
      refresh: fetchNotifications, 
      markAllAsRead, 
      toggleNotificationRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}; 