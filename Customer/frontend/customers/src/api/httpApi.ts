import { qs, request } from './client';
import type { CustomerApi } from './types';
import type { Cart, Customer, Loyalty, MenuItem, Order } from '../types';

// Implementasi ke backend asli (NestJS). Daftar endpoint: API.md
export const httpApi: CustomerApi = {
  login: (phone, password) => request('POST', '/auth/login', { identifier: phone, password, role: 'customer' }),
  requestRegisterOtp: async (name, phone) => {
    await request('POST', '/auth/register/request-otp', { name, phone });
  },
  verifyRegisterOtp: (phone, code) => request('POST', '/auth/register/verify-otp', { phone, code }),
  completeRegistration: async (registrationToken, password) => {
    await request('POST', '/auth/register/complete', { registrationToken, password });
  },
  logout: async () => {
    await request('POST', '/auth/logout');
  },

  getNearbyCarts: (pos) => request<Cart[]>('GET', `/carts/nearby${qs({ lat: String(pos.lat), lng: String(pos.lng) })}`),
  getCartMenu: (cartId) => request<MenuItem[]>('GET', `/carts/${cartId}/menu`),

  createOrder: (input) => request<Order>('POST', '/orders', input),
  getOrder: (id) => request<Order>('GET', `/orders/${id}`),
  getActiveOrder: async () => {
    const list = await request<Order[]>('GET', '/customers/me/orders?active=true');
    return list[0] ?? null;
  },
  cancelOrder: async (id) => {
    await request('POST', `/orders/${id}/cancel`);
  },

  getHistory: () => request<Order[]>('GET', '/customers/me/orders'),
  getLoyalty: () => request<Loyalty>('GET', '/customers/me/loyalty'),

  updateProfile: (input) => request<Customer>('PATCH', '/customers/me', input),
  changePassword: async (oldPassword, newPassword) => {
    await request('POST', '/customers/me/password', { oldPassword, newPassword });
  },
  deleteAccount: async (password) => {
    await request('DELETE', '/customers/me', { password });
  },
};
