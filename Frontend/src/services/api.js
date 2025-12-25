import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  githubLogin: () => {
    window.location.href = `${API_URL}/auth/github`;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const reviewAPI = {
  createReview: async (code, language) => {
    const response = await api.post('/review', { code, language });
    return response.data;
  },
  
  getReviews: async () => {
    const response = await api.get('/review');
    return response.data;
  },
  
  getReviewById: async (id) => {
    const response = await api.get(`/review/${id}`);
    return response.data;
  },
  
  deleteReview: async (id) => {
    const response = await api.delete(`/review/${id}`);
    return response.data;
  },
};

export const repoAPI = {
  scanRepository: async (owner, repo) => {
    const response = await api.post('/repo/scan', { owner, repo });
    return response.data;
  },
};

export default api;

