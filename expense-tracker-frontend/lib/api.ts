import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (email: string, password: string, fullname: string) => {
    const response = await api.post('/users/register', { email, password, fullname });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      // localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  verifyOTP: async (otp: string, email: string) => {
    const response = await api.post('/users/verify-otp', { email ,otp });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/current-user');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  sendPasswordResetEmail: async (email: string) => {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (newPassword: string) => {
    const response = await api.post('/users/reset-password', { newPassword });
    return response.data;
  },
};

export default api; 