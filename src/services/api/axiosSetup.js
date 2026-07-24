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

    // Retrieve live token and user details from Local Storage
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('user_email');

    // Attach Authorization header ONLY if a real token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (email) {
      config.headers['X-User-Email'] = email.trim().toLowerCase();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;