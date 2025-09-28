import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  loginWithOTP: (data: any) => api.post('/auth/login-otp', data),
  verifyOTP: (data: any) => api.post('/auth/verify-otp', data),
  resendOTP: (data: any) => api.post('/auth/resend-otp', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: (params?: any) => api.get('/analytics/dashboard', { params }),
  getUserStats: (userId: string, params?: any) => api.get(`/analytics/users/${userId}`, { params }),
  getVillageStats: (villageId: string, params?: any) => api.get(`/analytics/villages/${villageId}`, { params }),
  getHubStats: (hubId: string, params?: any) => api.get(`/analytics/hubs/${hubId}`, { params }),
  getSHGStats: (shgId: string, params?: any) => api.get(`/analytics/shg/${shgId}`, { params }),
};

// Orders API
export const ordersAPI = {
  getOrders: (params?: any) => api.get('/orders', { params }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: string, data: any) => api.put(`/orders/${id}/status`, data),
  cancelOrder: (id: string, data: any) => api.post(`/orders/${id}/cancel`, data),
};

// Users API
export const usersAPI = {
  getUsers: (params?: any) => api.get('/users', { params }),
  getUser: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
};

// Villages API
export const villagesAPI = {
  getVillages: (params?: any) => api.get('/villages', { params }),
  getVillage: (id: string) => api.get(`/villages/${id}`),
  createVillage: (data: any) => api.post('/villages', data),
  updateVillage: (id: string, data: any) => api.put(`/villages/${id}`, data),
};

// Hubs API
export const hubsAPI = {
  getHubs: (params?: any) => api.get('/hubs', { params }),
  getHub: (id: string) => api.get(`/hubs/${id}`),
  createHub: (data: any) => api.post('/hubs', data),
  updateHub: (id: string, data: any) => api.put(`/hubs/${id}`, data),
  getHubOrders: (id: string, params?: any) => api.get(`/hubs/${id}/orders`, { params }),
};

// Marketplace API
export const marketplaceAPI = {
  searchListings: (params?: any) => api.get('/marketplace/listings/search', { params }),
  getListing: (id: string) => api.get(`/marketplace/listings/${id}`),
  createListing: (data: any) => api.post('/marketplace/listings', data),
  updateListing: (id: string, data: any) => api.put(`/marketplace/listings/${id}`, data),
  deleteListing: (id: string) => api.delete(`/marketplace/listings/${id}`),
  getMyListings: (params?: any) => api.get('/marketplace/listings/my-listings', { params }),
  getNearbyListings: (params?: any) => api.get('/marketplace/listings/nearby', { params }),
  getTrendingProducts: () => api.get('/marketplace/listings/trending'),
  createBid: (listingId: string, data: any) => api.post(`/marketplace/listings/${listingId}/bids`, data),
  getBids: (listingId: string, params?: any) => api.get(`/marketplace/listings/${listingId}/bids`, { params }),
  acceptBid: (listingId: string, bidId: string) => api.post(`/marketplace/listings/${listingId}/bids/${bidId}/accept`),
  getMarketPrices: () => api.get('/marketplace/prices'),
  getPriceTrends: (params?: any) => api.get('/marketplace/price-trends', { params }),
};

// SHG API
export const shgAPI = {
  getSHGMembers: (shgId: string) => api.get(`/shg/${shgId}/members`),
  getSHGStats: (shgId: string) => api.get(`/shg/${shgId}/stats`),
};

export default api;