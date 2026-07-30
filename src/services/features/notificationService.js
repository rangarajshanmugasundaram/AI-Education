import axiosInstance from '../api/axiosSetup';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const notificationService = {
  // GET /api/notifications/
  getAll: async (params = {}) => {
    return await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.ALL, { params });
  },

  // GET /api/notifications/my/
  getMy: async () => {
    const email = localStorage.getItem('user_email') || '';
    return await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.MY, {
      headers: {
        'X-User-Email': email,
      },
    });
  },

  // GET /api/notifications/:id/
  getById: async (id) => {
    return await axiosInstance.get(`/api/notifications/${id}/`);
  },

  // POST /api/notifications/
  create: async (data) => {
    return await axiosInstance.post(API_ENDPOINTS.NOTIFICATIONS.CREATE, data);
  },

  // PUT /api/notifications/:id/
  update: async (id, data) => {
    return await axiosInstance.put(`/api/notifications/${id}/`, data);
  },

  // PUT /api/notifications/:id/read/
  markAsRead: async (id) => {
    return await axiosInstance.put(`/api/notifications/${id}/read/`);
  },

  // DELETE /api/notifications/:id/
  delete: async (id) => {
    return await axiosInstance.delete(`/api/notifications/${id}/`);
  },
};

export default notificationService;