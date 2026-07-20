import axiosInstance from '../auth/axiosSetup';

export const getData = async (endpoint) => {
  const token = localStorage.getItem('token') || 'mock-jwt-token-from-backend-xyz123';
  const email = localStorage.getItem('user_email') || 'trainer1@gmail.com'; 

  const headers = {
    'Authorization': `Bearer ${token}`,
    'X-User-Email': email.strip ? email.strip().toLowerCase() : email.trim().toLowerCase()
  };

  const response = await axiosInstance.get(endpoint, { headers });
  return response.data;
};