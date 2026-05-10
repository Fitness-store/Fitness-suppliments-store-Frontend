import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fitness-supplements-store.onrender.com';
const AUTH_FLAG_KEY = 'fitness_store_auth';
// Keep TOKEN_KEY for backward compat during migration — will be removed once cookies are fully active
const TOKEN_KEY = 'fitness_store_token';
let accessToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
let refreshPromise = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Sends cookies automatically on every request
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export const setAccessToken = (token) => {
  accessToken = token || null;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(AUTH_FLAG_KEY, 'true');
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_FLAG_KEY);
    }
  }
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_FLAG_KEY);
  }
};

/**
 * Returns true if the user may be authenticated (based on local flag).
 * The actual auth is validated server-side via HttpOnly cookies.
 */
export const isAuthFlagSet = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_FLAG_KEY) === 'true' ||
           localStorage.getItem(TOKEN_KEY) !== null;
  }
  return false;
};

const isAuthRefreshPath = (url = '') => url.includes('/fs/auth/refresh');

const isAuthActionPath = (url = '') =>
  url.includes('/fs/auth/login') ||
  url.includes('/fs/auth/signup');

// Attach Authorization header if we have a token (backward compat + double security)
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

/**
 * Extracts a human-readable error message from API error responses.
 * Handles both BusinessException format ({ errors: [{ message }] })
 * and direct format ({ message }).
 */
const extractErrorMessage = (error, fallback = 'Something went wrong') => {
  const data = error.response?.data;
  if (!data) return fallback;
  // BusinessException / validation errors: { errors: [{ message }] }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map(e => e.message).join(', ');
  }
  // Direct message format: { message }
  if (data.message) return data.message;
  return fallback;
};

export const fetchProducts = async (displayInStock = true) => {
  try {
    const response = await api.get('/fs/product/all', {
      params: { displayInStock }
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to fetch products'));
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/fs/product/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to fetch product'));
  }
};

export const fetchProductsByCategoryId = async (categoryId) => {
  try {
    const response = await api.get(`/fs/product/category/${categoryId}`, {
      params: { displayInStock: true }
    });
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to fetch products by category'));
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await api.post('/fs/admin/products', productData);
    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to add product'));
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
    throw new Error(extractErrorMessage(error, 'Failed to add category'));
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

export const googleLoginUser = async (credential) => {
  try {
    const response = await api.post('/fs/auth/google', { credential });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Google login failed');
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

export const verifyPayment = async (payload) => {
  try {
    const response = await api.post('/fs/order/verify-payment', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify payment');
  }
};

export const fetchMyOrders = async () => {
  try {
    const response = await api.get('/fs/order/my-orders');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const addCartItem = async (payload) => {
  try {
    const response = await api.post('/fs/cart/items', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add cart item');
  }
};

export const fetchCart = async () => {
  try {
    const response = await api.get('/fs/cart');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch cart');
  }
};

export const updateCartItemQuantity = async (cartItemId, payload) => {
  try {
    const response = await api.put(`/fs/cart/items/${cartItemId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update cart item');
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    const response = await api.delete(`/fs/cart/items/${cartItemId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove cart item');
  }
};

export default api;
