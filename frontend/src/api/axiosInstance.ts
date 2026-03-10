import axios from 'axios';

let _token: string | null = null;

export const setAuthToken = (token: string | null) => {
  _token = token;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicPaths = ['/login', '/signup', '/oauth2/callback'];
      if (!publicPaths.includes(window.location.pathname)) {
        localStorage.removeItem('runtime_token');
        localStorage.removeItem('runtime_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
