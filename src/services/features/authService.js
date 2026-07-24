import { postData } from '../api/postData';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { ROLES } from '../../constants/roles';

export const registerUser = async (userData) => {
  return await postData(API_ENDPOINTS.AUTH.REGISTER, userData);
};

export const loginUser = async (credentials) => {
  const response = await postData(API_ENDPOINTS.AUTH.LOGIN, credentials);
  
  // Save real JWT credentials on successful response
  if (response && response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user_role', response.role || ROLES.STUDENT);
    localStorage.setItem('user_email', response.email || credentials.email);
    localStorage.setItem('isLoggedIn', 'true');
  }
  
  return response;
};

export const resetPassword = async (data) => {
  return await postData(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_email');
  localStorage.setItem('isLoggedIn', 'false');
};