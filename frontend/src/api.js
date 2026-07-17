import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token.trim() !== '') {
    config.headers.Authorization = `Token ${token}`;
  } else {
    // Remove Authorization header if no token
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
