import { postData } from '../api/postData';

export const registerUser = async (userData) => {
  return await postData('/api/register/', userData);
};

export const loginUser = async (credentials) => {
  return await postData('/api/login/', credentials);
};

export const resetPassword = async (data) => {
  return await postData('/api/reset-password/', data);
};