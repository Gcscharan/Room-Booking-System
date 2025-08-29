import axios from 'axios';

// Get the backend URL from environment variable or use the production URL
const backendURL = process.env.REACT_APP_BACKEND_URL || 'https://room-booking-system-backend.vercel.app';

// Create axios instance with base URL
const api = axios.create({
  baseURL: backendURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;