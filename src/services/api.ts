import type { Product } from '../data/products';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  address?: {
    street?: string;
    city?: string;
    district?: string;
    note?: string;
  };
  createdAt: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  paymentMethod: 'cod' | 'khqr' | 'card';
  paymentStatus: 'pending' | 'paid';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusTextKh: string;
  createdAt: string;
  timeline: {
    title: string;
    time: string;
    description: string;
    completed: boolean;
  }[];
}

export interface CategoryInfo {
  category: string;
  categoryKh: string;
  count: number;
  image: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('esokein_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data.error || data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ message: string; user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: { name: string; email: string; phone?: string; password: string }) =>
      request<{ message: string; user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    me: () => request<{ user: User }>('/auth/me'),

    updateProfile: (profile: Partial<User>) =>
      request<{ message: string; user: User }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      }),

    changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
      request<{ message: string }>('/auth/password', {
        method: 'PUT',
        body: JSON.stringify(passwords),
      }),
  },

  // Products
  products: {
    list: (params?: {
      category?: string;
      brand?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      isNew?: boolean;
      isFeatured?: boolean;
      sort?: string;
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') {
            query.append(k, String(v));
          }
        });
      }
      const qs = query.toString();
      return request<{ products: Product[]; total: number; page: number; totalPages: number }>(
        `/products${qs ? `?${qs}` : ''}`
      );
    },

    getById: (id: number | string) =>
      request<{ product: Product; related: Product[] }>(`/products/${id}`),

    featured: () => request<Product[]>('/products/featured'),

    categories: () => request<CategoryInfo[]>('/products/categories'),

    brands: () => request<string[]>('/products/brands'),
  },

  // Orders
  orders: {
    create: (orderData: {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      shippingAddress: string;
      paymentMethod: string;
      items: OrderItem[];
      subtotal?: number;
      shippingFee?: number;
      discount?: number;
      total?: number;
    }) =>
      request<{ message: string; order: Order }>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),

    getUserOrders: () => request<{ orders: Order[] }>('/orders/user'),

    getById: (id: string) => request<{ order: Order }>(`/orders/${id}`),

    track: (orderNumber: string) =>
      request<{
        orderId: string;
        status: Order['status'];
        statusTextKh: string;
        createdAt: string;
        customerName: string;
        shippingAddress: string;
        total: number;
        itemCount: number;
        timeline: Order['timeline'];
        items: OrderItem[];
      }>(`/orders/track/${encodeURIComponent(orderNumber)}`),
  },

  // Contact
  contact: {
    submit: (messageData: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
      request<{ message: string; contact: any }>('/contact', {
        method: 'POST',
        body: JSON.stringify(messageData),
      }),
  },

  // Admin
  admin: {
    stats: () =>
      request<{
        totalUsers: number;
        totalOrders: number;
        totalRevenue: number;
        pendingOrders: number;
        deliveredOrders: number;
        totalProducts: number;
      }>('/admin/stats'),

    getUsers: () =>
      request<{
        users: (User & { ordersCount: number; totalSpent: number })[];
      }>('/admin/users'),

    updateUserRole: (userId: string, role: 'admin' | 'customer') =>
      request<{ message: string; user: User }>(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      }),

    deleteUser: (userId: string) =>
      request<{ message: string }>(`/admin/users/${userId}`, {
        method: 'DELETE',
      }),

    getOrders: () =>
      request<{ orders: Order[] }>('/admin/orders'),

    updateOrderStatus: (orderId: string, status: Order['status'], note?: string) =>
      request<{ message: string; order: Order }>(`/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note }),
      }),

    getContacts: () =>
      request<{ messages: any[] }>('/admin/contacts'),
  },
};
