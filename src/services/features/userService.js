import api from '../api/axiosSetup';

export const fetchUsers = async (params = {}) => {
  const response = await api.get('/api/users/', { params });
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/api/users/', userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/api/users/${userId}/`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/users/${userId}/`);
  return response.data;
};

export const toggleUserStatus = async (userId) => {
  const response = await api.patch(`/api/users/${userId}/toggle-status/`);
  return response.data;
};

export const resetUserPassword = async (userId, newPassword) => {
  const response = await api.post(`/api/users/${userId}/reset-password/`, {
    new_password: newPassword,
  });
  return response.data;
};