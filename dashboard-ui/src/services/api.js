// src/services/api.js
import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/jwt';

const apiClient = axios.create({
  baseURL: '/api', // Using relative /api for proxying to backend later
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized access - 401. Token might be invalid or expired.');
      removeAuthToken();
      // Redirect to login. Using window.location for simplicity in a non-component file.
      // A more sophisticated app might use a global event emitter or pass navigate.
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
