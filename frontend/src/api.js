// frontend/src/api.js
import axios from 'axios';

// Axios instance.
// - Local dev (no VITE_API_URL): relative '/api/books' via the Vite proxy.
// - Production (Vercel): set VITE_API_URL to the Render backend origin
//   (e.g. https://<service>.onrender.com) and requests go there directly.
const configuredBase = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const baseURL = configuredBase
  ? `${configuredBase.replace(/\/api\/books$/, '')}/api/books`
  : '/api/books';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

export default api;
