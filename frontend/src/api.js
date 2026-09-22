// frontend/src/api.js
import axios from 'axios';

// Axios instance that respects Vite proxy to /api
const api = axios.create({
  baseURL: '/api/books',
  timeout: 10000,
});

export default api;
