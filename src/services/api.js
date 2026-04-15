import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fitness-supplements-store.onrender.com';
let accessToken = null;
let refreshPromise = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

const isAuthRefreshPath = (url = '') => url.includes('/fs/auth/refresh');

const isAuthActionPath = (url = '') =>
  url.includes('/fs/auth/login') ||
  url.includes('/fs/auth/signup') ||
  url.includes('/fs/auth/otp/');

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRefreshPath(requestUrl) &&
      !isAuthActionPath(requestUrl)
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAuthSession().finally(() => {
            refreshPromise = null;
          });
        }
        await refreshPromise;
        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const fetchProducts = async (displayInStock = true) => {
  try {
    const response = await api.get('/fs/product/all', {
      params: { displayInStock: displayInStock.toString() }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/fs/product/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const fetchProductsByCategoryId = async (categoryId) => {
  try {
    const response = await api.get(`/fs/product/category/${categoryId}`, {
      params: { displayInStock: true }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products by category');
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await api.post('/fs/product/add', productData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add product');
  }
};

// Category APIs
export const fetchCategories = async () => {
  try {
    const response = await api.get('/fs/category/all');
    return response.data;
  } catch {
    return { success: false, categories: [] };
  }
};

export const addCategory = async (categoryData) => {
  try {
    const response = await api.post('/fs/category/add', categoryData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add category');
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch {
    throw new Error('Health check failed');
  }
};

export const sendOtp = async (phone) => {
  try {
    const response = await api.post('/fs/auth/otp/send', { phone });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

export const verifyOtp = async ({ phone, otp }) => {
  try {
    const response = await api.post('/fs/auth/otp/verify', { phone, otp });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};

export const signupUser = async (payload) => {
  try {
    const response = await api.post('/fs/auth/signup', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to signup');
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await api.post('/fs/auth/login', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

export const refreshAuthSession = async () => {
  try {
    const response = await api.post('/fs/auth/refresh');
    if (response?.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to refresh session');
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/fs/auth/logout');
    clearAccessToken();
    return response.data;
  } catch (error) {
    clearAccessToken();
    throw new Error(error.response?.data?.message || 'Failed to logout');
  }
};

export const fetchMe = async () => {
  try {
    const response = await api.get('/fs/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

export const placeOrder = async (payload) => {
  try {
    const response = await api.post('/fs/order/place', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to place order');
  }
};

export default api;
