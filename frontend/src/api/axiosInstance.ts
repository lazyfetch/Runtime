import axios from 'axios';

// In-memory token storage — cleared on page refresh (acceptable until backend supports cookies)
let _token: string | null = null;

export const setAuthToken = (token: string | null) => {
  _token = token;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

// Inject Bearer token on every request if we have one
axiosInstance.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

// On 401, redirect to login — but only if not already on a public page
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicPaths = ['/login', '/signup', '/oauth2/callback'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
