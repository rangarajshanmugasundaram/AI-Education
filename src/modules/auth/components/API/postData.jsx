import axiosInstance from '../auth/axiosSetup';

export const postData = async (endpoint, data) => {
  const token = localStorage.getItem('token') || 'mock-jwt-token-from-backend-xyz123';
  const email = localStorage.getItem('user_email') || 'trainertest@gmail.com'; // Use a valid DB email here

  const headers = {
    'Authorization': `Bearer ${token}`,
    'X-User-Email': email.strip ? email.strip().toLowerCase() : email.trim().toLowerCase()
  };

  const response = await axiosInstance.post(endpoint, data, { headers });
  return response.data;
};