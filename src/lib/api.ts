import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://65.1.107.141:5000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    console.log('Interceptor - Request URL:', config.url);
    console.log('Interceptor - Token:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Interceptor - Headers:', config.headers);
    } else {
      console.warn('Interceptor - No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Interceptor - Error:', error);
    return Promise.reject(error);
  }
);

export const apiClient = {
  login: (username: string, password: string) =>
    api.post('/api/auth/login', { username, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/api/auth/register', { username, email, password }),
  logout: (token: string) =>
    api.post('/api/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  createCampaign: (data: { name: string; job_description: string }) =>
    api.post('/api/campaigns', data),
  getCampaigns: () => api.get('/api/campaigns'),
  uploadCandidates: (campaignId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/campaigns/${campaignId}/candidates`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  startCampaign: (campaignId: number, csvId?: number) => {
    const body = csvId ? { csv_id: csvId } : {};
    console.log('Sending start campaign request:', { campaignId, body });
    return api.post(`/api/campaigns/${campaignId}/start`, body);
  },
  getCampaignResults: (campaignId: number) =>
    api.get(`/api/campaigns/${campaignId}/results`),
  getUploadedCSVs: () => api.get('/api/csvs'),
};

export interface User {
  id: string;
  username: string;
  email: string;
}

export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
  console.log('Token set in localStorage:', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  console.log('Token removed from localStorage');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');
  console.log('isAuthenticated - Token exists:', !!token);
  return !!token;
};