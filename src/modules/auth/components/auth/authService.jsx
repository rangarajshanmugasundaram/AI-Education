import axios from 'axios';

// Define the base URL for your Django backend
const API_URL = 'http://localhost:8000'; 

// This is the function your components are trying to import
export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const registerUser = async (userData) => {
  return await postData('/api/register/', userData);
};

export const loginUser = async (credentials) => {
  return await postData('/api/login/', credentials);
};

// You can add your reset password helper here too
export const resetPassword = async (data) => {
  return await postData('/api/reset-password/', data);
};