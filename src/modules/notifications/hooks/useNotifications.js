import { useState, useEffect, useCallback } from 'react';
import notificationService from '../../../services/features/notificationService';
import websocketService from '../../../services/features/websocketService';

export const useNotifications = (isStudent = false) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('');
  const [recipientType, setRecipientType] = useState('');
  const [readStatus, setReadStatus] = useState('');

  // Fetch Notifications from REST API
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isStudent) {
        response = await notificationService.getMy();
      } else {
        const params = {};
        if (priority) params.priority = priority;
        if (recipientType) params.recipient_type = recipientType;
        if (readStatus) params.read_status = readStatus;
        if (searchTerm) params.search = searchTerm;

        response = await notificationService.getAll(params);
      }

      const list = Array.isArray(response) ? response : response?.data || [];
      setNotifications(list);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.response?.data?.error || 'Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [isStudent, priority, recipientType, readStatus, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 🌟 REAL-TIME WEBSOCKET LISTENER FOR NEW BROADCAST ALERTS
  useEffect(() => {
    const handleNewNotification = (payload) => {
      if (!payload) return;
      
      const newNotification = payload.payload || payload;
      
      // Append new notification to top of list instantly
      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === newNotification.id);
        if (exists) return prev;
        return [newNotification, ...prev];
      });
    };

    websocketService.on('NEW_NOTIFICATION', handleNewNotification);

    return () => {
      websocketService.off('NEW_NOTIFICATION', handleNewNotification);
    };
  }, []);

  // POST /api/notifications/
  const createNotification = async (formData) => {
    try {
      await notificationService.create(formData);
      await fetchNotifications();
      return { success: true };
    } catch (err) {
      console.error('Error creating notification:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create notification';
      return { success: false, error: errorMessage };
    }
  };

  // PUT /api/notifications/:id/
  const updateNotification = async (id, formData) => {
    try {
      await notificationService.update(id, formData);
      await fetchNotifications();
      return { success: true };
    } catch (err) {
      console.error('Error updating notification:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update notification';
      return { success: false, error: errorMessage };
    }
  };

  // PUT /api/notifications/:id/read/
  const markAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
      );
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      fetchNotifications();
    }
  };

  // DELETE /api/notifications/:id/
  const deleteNotification = async (id) => {
    try {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      await notificationService.delete(id);
      return { success: true };
    } catch (err) {
      console.error('Error deleting notification:', err);
      fetchNotifications();
      return { success: false, error: 'Failed to delete notification' };
    }
  };

  // Calculated Statistics
  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read_status).length,
    highPriority: notifications.filter((n) => n.priority === 'High' || n.priority === 'Emergency').length,
  };

  return {
    notifications,
    loading,
    error,
    stats,
    searchTerm,
    setSearchTerm,
    priority,
    setPriority,
    recipientType,
    setRecipientType,
    readStatus,
    setReadStatus,
    fetchNotifications,
    createNotification,
    updateNotification,
    markAsRead,
    deleteNotification,
  };
};

export default useNotifications;