import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const searchParams = new URLSearchParams(window.location.search);
    const paramEmail = searchParams.get('email');
    const paramRole = searchParams.get('role');

    if (paramEmail) localStorage.setItem('user_email', paramEmail);
    if (paramRole) localStorage.setItem('user_role', paramRole);

    // Fallback to active user or default trainer credentials
    const email = localStorage.getItem('user_email') || 'trainer@ai-education.com';
    const role = localStorage.getItem('user_role') || 'Trainer';

    // Set authorization headers expected by IsTrainerOrAdminForWrite
    config.headers['X-User-Email'] = email.trim().toLowerCase();
    config.headers['X-User-Role'] = role.trim();

    // Enforce trailing slashes for Django REST framework
    if (config.url && !config.url.endsWith('/') && !config.url.includes('?')) {
      config.url += '/';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;