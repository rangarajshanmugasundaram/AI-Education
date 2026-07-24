import axiosSetup from '../api/axiosSetup'; // Adjust path to match your axios instance if needed

export const notificationService = {
  // GET /api/notifications/ - Trainer/Admin fetch
  getAll: async (params = {}) => {
    const response = await axiosSetup.get('/api/notifications/', { params });
    return response;
  },

  // GET /api/notifications/my/ - Student fetch
  getMy: async () => {
    const email = localStorage.getItem('user_email') || '';
    const response = await axiosSetup.get('/api/notifications/my/', {
      headers: {
        'X-User-Email': email,
      },
    });
    return response;
  },

  // GET /api/notifications/:id/
  getById: async (id) => {
    return await axiosSetup.get(`/api/notifications/${id}/`);
  },

  // POST /api/notifications/
  create: async (data) => {
    return await axiosSetup.post('/api/notifications/', data);
  },

  // PUT /api/notifications/:id/
  update: async (id, data) => {
    return await axiosSetup.put(`/api/notifications/${id}/`, data);
  },

  // PUT /api/notifications/:id/read/
  markAsRead: async (id) => {
    return await axiosSetup.put(`/api/notifications/${id}/read/`);
  },

  // DELETE /api/notifications/:id/
  delete: async (id) => {
    return await axiosSetup.delete(`/api/notifications/${id}/`);
  },
};

export default notificationService;