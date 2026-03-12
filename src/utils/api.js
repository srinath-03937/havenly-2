import axios from 'axios';
import { getCurrentTabToken } from './tabManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getCurrentTabToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getRooms: () => api.get('/admin/rooms'),
  createRoom: (data) => api.post('/admin/rooms', data),
  updateRoom: (id, data) => api.put(`/admin/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/admin/rooms/${id}`),
  getComplaints: () => api.get('/admin/complaints'),
  getComplaintsHistory: () => api.get('/admin/complaints-history'),
  updateComplaint: (id, data) => api.put(`/admin/complaints/${id}`, data),
  getTransactions: () => api.get('/admin/transactions'),
  getTransactionsByRoom: () => api.get('/admin/transactions-by-room'),
  createNotice: (data) => api.post('/admin/notices', data),
  getNotices: () => api.get('/admin/notices'),
  // Super Admin APIs
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`)
};

export const studentAPI = {
  getRoom: () => api.get('/student/room'),
  getRooms: () => api.get('/student/rooms'),
  getTransactions: () => api.get('/student/transactions'),
  getPendingDues: () => api.get('/student/pending-dues'),
  payTransaction: (id) => api.put(`/student/transactions/${id}`),
  createComplaint: (data) => api.post('/student/complaints', data),
  getComplaints: () => api.get('/student/complaints'),
  getComplaintsHistory: () => api.get('/student/complaints-history'),
  getNotices: () => api.get('/student/notices'),
  acknowledgeNotice: (id) => api.post(`/student/notices/${id}/acknowledge`),
  getRoomChangeRequests: () => api.get('/student/room-change-requests'),
  requestRoomChange: (data) => api.post('/student/room-change-requests', data),
  bookRoom: (roomId) => api.post(`/student/rooms/${roomId}/book`),
  previewRoomBooking: (roomId) => api.get(`/student/rooms/${roomId}/preview`)
};

export const aiAPI = {
  getFacilityInsights: (data) => api.post('/ai/facility-insights', data),
  draftNotice: (data) => api.post('/ai/draft-notice', data),
  enhanceComplaint: (data) => api.post('/ai/enhance-complaint', data)
};

export default api;
