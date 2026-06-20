import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://shop.tandurkarya.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Types
export interface Project {
  id: number;
  projectTitle: string;
  projectDescription: string;
  projectClass: string;
}

export interface Category {
  id: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  productStock: number;
  productImage: string;
  categoryId: number;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: 'wallet' | 'bank';
  logoUrl: string;
}

export interface Purchase {
  id: number;
  userId: number;
  totalAmount: number;
  address: string;
  status: string;
  paymentMethodId: number;
  paymentMethod?: PaymentMethod;
  items: PurchaseItem[];
  createdAt: string;
}

export interface PurchaseItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface User {
  id: number;
  name: string;
  email: string;
  projectId: number;
}

// API Functions
export const projectApi = {
  create: (data: { projectTitle: string; projectDescription: string; projectClass: string; projectTeam: any[] }) =>
    api.post('/projects', data),
  getAll: () => api.get('/projects'),
};

export const authApi = {
  register: (data: { projectId: number; name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

export const categoryApi = {
  create: (data: { categoryName: string }) => api.post('/categories', data),
  getAll: () => api.get('/categories'),
};

export const productApi = {
  create: (data: { categoryId: number; productName: string; productDescription: string; productPrice: number; productStock: number; productImage: string }) =>
    api.post('/products', data),
  getAll: (categoryId?: number) => {
    const url = categoryId ? `/products?categoryId=${categoryId}` : '/products';
    return api.get(url);
  },
  getById: (id: number) => api.get(`/products/${id}`),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

export const cartApi = {
  add: (data: { productId: number; quantity: number }) => api.post('/carts', data),
  getItems: () => api.get('/carts'),
  updateQuantity: (cartItemId: number, data: { quantity: number }) => api.put(`/carts/${cartItemId}`, data),
  deleteItem: (cartItemId: number) => api.delete(`/carts/${cartItemId}`),
  clearCart: () => api.delete('/carts'),
};

export const paymentMethodApi = {
  create: (data: { name: string; type: string; logoUrl: string }) => api.post('/payment-methods', data),
  getAll: () => api.get('/payment-methods'),
  getById: (id: number) => api.get(`/payment-methods/${id}`),
  update: (id: number, data: any) => api.put(`/payment-methods/${id}`, data),
  delete: (id: number) => api.delete(`/payment-methods/${id}`),
};

export const purchaseApi = {
  checkout: (data: { address: string; paymentMethodId: number }) => api.post('/purchases', data),
  getHistory: () => api.get('/purchases'),
  getById: (id: number) => api.get(`/purchases/${id}`),
  updateStatus: (id: number, data: { status: string }) => api.put(`/purchases/${id}`, data),
};

export default api;