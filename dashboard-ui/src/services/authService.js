// src/services/authService.js
import apiClient from './api';
import { setAuthToken, removeAuthToken } from '../utils/jwt';

export const login = async (credentials) => {
  try {
    // console.log('authService.login: Sending credentials to /auth/login', credentials);
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data && response.data.token) {
      setAuthToken(response.data.token);
    } else {
      // This case might happen if the server response is 2xx but token is missing
      console.warn('Login successful, but no token received.', response.data);
    }
    return response.data;
  } catch (error) {
    console.error('authService.login: Error during login', error.response?.data?.message || error.message);
    throw error; // Re-throw to be caught by the component
  }
};

export const register = async (userData) => {
  try {
    // console.log('authService.register: Sending user data to /auth/register', userData);
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('authService.register: Error during registration', error.response?.data?.message || error.message);
    throw error;
  }
};

export const logout = () => {
  // This is primarily a client-side action.
  // If backend had a session/token invalidation endpoint, call it here.
  // e.g., try { await apiClient.post('/auth/logout'); } catch (e) { console.error("Logout API call failed", e); }
  removeAuthToken();
  // Redirection is typically handled by the component calling logout.
};
