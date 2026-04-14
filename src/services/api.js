import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fitness-supplements-store.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Product APIs
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

export const fetchProductsByCategoryId = async (categoryId, displayInStock = true) => {
  try {
    const response = await api.get(`/fs/product/category/${categoryId}`, {
      params: { displayInStock: displayInStock.toString() }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products by category');
  }
};

export const fetchFilteredProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.brands && filters.brands.length > 0) {
      filters.brands.forEach(brand => params.append('brands', brand));
    }
    if (filters.minPrice !== undefined && filters.minPrice !== '') params.append('minPrice', filters.minPrice);
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') params.append('maxPrice', filters.maxPrice);
    if (filters.displayInStock !== undefined) params.append('displayInStock', filters.displayInStock.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);

    const response = await api.get('/fs/product/filter', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch filtered products');
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
  } catch (error) {
    throw new Error('Health check failed');
  }
};

export default api;
