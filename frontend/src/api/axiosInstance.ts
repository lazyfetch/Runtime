import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  // Always include cookies — the HttpOnly JWT cookie is sent automatically by the browser
  withCredentials: true,
});

// No request interceptor: the browser handles the cookie, no Authorization header needed.

// On 401, clear any stale client state and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
