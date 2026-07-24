import { postData } from '../api/postData';

export const registerUser = async (userData) => {
  return await postData('/api/register/', userData);
};

export const loginUser = async (credentials) => {
  const response = await postData('/api/login/', credentials);
  
  // Save credentials on successful response
  if (response && response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user_role', response.role || 'Student');
    localStorage.setItem('user_email', response.email || credentials.email);
    localStorage.setItem('isLoggedIn', 'true');
  }
  
  return response;
};

export const resetPassword = async (data) => {
  return await postData('/api/reset-password/', data);
};