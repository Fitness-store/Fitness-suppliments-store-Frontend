import api from './api';

const ADMIN_TOKEN_KEY = 'fitness_store_admin_token';

const adminApi = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

/**
 * Extracts a human-readable error message from API error responses.
 * Handles BusinessException ({ errors: [{ message }] }) and direct ({ message }).
 */
const extractAdminError = (error, fallback = 'Something went wrong') => {
  const data = error.response?.data;
  if (!data) return fallback;
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map(e => e.message).join(', ');
  }
  if (data.message) return data.message;
  return fallback;
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
  try {
    const response = await api.put(`/fs/admin/users/${id}`, data, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to update user'));
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/fs/admin/users/${id}`, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to delete user'));
  }
};

// =================== PRODUCTS ===================
export const adminFetchProducts = async () => {
  const response = await api.get('/fs/admin/products', adminApi());
  return response.data;
};

export const adminUpdateProduct = async (id, data) => {
  try {
    const response = await api.put(`/fs/admin/products/${id}`, data, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to update product'));
  }
};

export const adminDeleteProduct = async (id) => {
  try {
    const response = await api.delete(`/fs/admin/products/${id}`, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to delete product'));
  }
};

export const adminUpdateStock = async (id, stock) => {
  try {
    const response = await api.patch(`/fs/admin/products/${id}/stock`, { stock }, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to update stock'));
  }
};

export const adminUploadProductImage = async (id, file) => {
  try {
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
  } catch (error) {
    throw new Error(extractAdminError(error, 'Image upload failed'));
  }
};

export const adminUploadProductImageForCreate = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const response = await api.post('/fs/admin/products/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Image upload failed'));
  }
};

// =================== CATEGORIES ===================
export const adminFetchCategories = async () => {
  const response = await api.get('/fs/admin/categories', adminApi());
  return response.data;
};

export const adminAddCategory = async (data) => {
  try {
    const response = await api.post('/fs/admin/categories', data, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to add category'));
  }
};

export const adminUpdateCategory = async (id, data) => {
  try {
    const response = await api.put(`/fs/admin/categories/${id}`, data, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to update category'));
  }
};

export const adminDeleteCategory = async (id) => {
  try {
    const response = await api.delete(`/fs/admin/categories/${id}`, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to delete category'));
  }
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
  try {
    const response = await api.patch(`/fs/admin/orders/${id}/status`, { status }, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to update order status'));
  }
};

// =================== ADMIN MANAGEMENT ===================
export const fetchAllAdmins = async () => {
  const response = await api.get('/fs/admin/admins', adminApi());
  return response.data;
};

export const addAdmin = async (data) => {
  try {
    const response = await api.post('/fs/admin/admins', data, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to add admin'));
  }
};

export const deleteAdmin = async (id) => {
  try {
    const response = await api.delete(`/fs/admin/admins/${id}`, adminApi());
    return response.data;
  } catch (error) {
    throw new Error(extractAdminError(error, 'Failed to delete admin'));
  }
};
