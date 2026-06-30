import axios from 'axios';

const baseURL = import.meta.env.MODE === 'production'
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const API = axios.create({ baseURL });

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('coinly_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
