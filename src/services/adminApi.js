import api from './api';

const ADMIN_TOKEN_KEY = 'fitness_store_admin_token';

const adminApi = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

// =================== DASHBOARD ===================
export const fetchDashboardStats = async () => {
  const response = await api.get('/fs/admin/dashboard/stats', adminApi());
  return response.data;
};

// =================== USERS ===================
export const fetchAllUsers = async () => {
  const response = await api.get('/fs/admin/users', adminApi());
  return response.data;
};

export const fetchUserById = async (id) => {
  const response = await api.get(`/fs/admin/users/${id}`, adminApi());
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/fs/admin/users/${id}`, data, adminApi());
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/fs/admin/users/${id}`, adminApi());
  return response.data;
};

// =================== PRODUCTS ===================
export const adminFetchProducts = async () => {
  const response = await api.get('/fs/admin/products', adminApi());
  return response.data;
};

export const adminUpdateProduct = async (id, data) => {
  const response = await api.put(`/fs/admin/products/${id}`, data, adminApi());
  return response.data;
};

export const adminDeleteProduct = async (id) => {
  const response = await api.delete(`/fs/admin/products/${id}`, adminApi());
  return response.data;
};

export const adminUpdateStock = async (id, stock) => {
  const response = await api.patch(`/fs/admin/products/${id}/stock`, { stock }, adminApi());
  return response.data;
};

export const adminUploadProductImage = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const response = await api.post(`/fs/admin/products/${id}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return response.data;
};

// =================== CATEGORIES ===================
export const adminFetchCategories = async () => {
  const response = await api.get('/fs/admin/categories', adminApi());
  return response.data;
};

export const adminAddCategory = async (data) => {
  const response = await api.post('/fs/admin/categories', data, adminApi());
  return response.data;
};

export const adminUpdateCategory = async (id, data) => {
  const response = await api.put(`/fs/admin/categories/${id}`, data, adminApi());
  return response.data;
};

export const adminDeleteCategory = async (id) => {
  const response = await api.delete(`/fs/admin/categories/${id}`, adminApi());
  return response.data;
};

// =================== ORDERS ===================
export const adminFetchOrders = async (status) => {
  const params = status ? `?status=${status}` : '';
  const response = await api.get(`/fs/admin/orders${params}`, adminApi());
  return response.data;
};

export const adminFetchOrderById = async (id) => {
  const response = await api.get(`/fs/admin/orders/${id}`, adminApi());
  return response.data;
};

export const adminUpdateOrderStatus = async (id, status) => {
  const response = await api.patch(`/fs/admin/orders/${id}/status`, { status }, adminApi());
  return response.data;
};

// =================== ADMIN MANAGEMENT ===================
export const fetchAllAdmins = async () => {
  const response = await api.get('/fs/admin/admins', adminApi());
  return response.data;
};

export const addAdmin = async (data) => {
  const response = await api.post('/fs/admin/admins', data, adminApi());
  return response.data;
};

export const deleteAdmin = async (id) => {
  const response = await api.delete(`/fs/admin/admins/${id}`, adminApi());
  return response.data;
};
