import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Dynamic extraction of query parameters for testing/Incognito isolation
    const searchParams = new URLSearchParams(window.location.search);
    const paramEmail = searchParams.get('email');
    const paramRole = searchParams.get('role');

    if (paramEmail) {
      localStorage.setItem('user_email', paramEmail);
    }
    if (paramRole) {
      localStorage.setItem('user_role', paramRole);
    }

    const token = localStorage.getItem('token') || 'mock-jwt-token-xyz123';
    const email = localStorage.getItem('user_email') || 'trainer1@gmail.com';

    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['X-User-Email'] = email ? email.trim().toLowerCase() : '';

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;