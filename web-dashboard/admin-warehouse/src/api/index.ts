import { apiClient } from './client';
import { mockApi } from './mockApi';
import type { Admin, StockInBatch, StockOutBatch, Rider, PurchaseReport } from '../types';

const USE_MOCK = !import.meta.env.VITE_API_URL;

export const warehouseApi = {
  // Login
  async login(username: string, password: string): Promise<{ user: Admin; token: string }> {
    if (USE_MOCK) return mockApi.login(username, password);

    const res = await apiClient<{ user: Admin; token: string }>('/api/warehouse/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (!res.success || !res.data) throw new Error(res.message || 'Login gagal');
    return res.data;
  },

  // Stock In
  async getStockIns(): Promise<StockInBatch[]> {
    if (USE_MOCK) return mockApi.getStockIns();

    const res = await apiClient<StockInBatch[]>('/api/warehouse/stock-in');
    if (!res.success || !res.data) throw new Error(res.message || 'Gagal memuat stok masuk');
    return res.data;
  },

  async addStockIn(batch: Omit<StockInBatch, 'id'>): Promise<StockInBatch> {
    if (USE_MOCK) return mockApi.addStockIn(batch);

    const res = await apiClient<StockInBatch>('/api/warehouse/stock-in', {
      method: 'POST',
      body: JSON.stringify(batch),
    });
    if (!res.success || !res.data) throw new Error(res.message || 'Gagal menyimpan stok masuk');
    return res.data;
  },

  // Stock Out
  async getStockOuts(): Promise<StockOutBatch[]> {
    if (USE_MOCK) return mockApi.getStockOuts();

    const res = await apiClient<StockOutBatch[]>('/api/warehouse/stock-out');
    if (!res.success || !res.data) throw new Error(res.message || 'Gagal memuat stok keluar');
    return res.data;
  },

  async addStockOut(batch: Omit<StockOutBatch, 'id'>): Promise<StockOutBatch> {
    if (USE_MOCK) return mockApi.addStockOut(batch);

    const res = await apiClient<StockOutBatch>('/api/warehouse/stock-out', {
      method: 'POST',
      body: JSON.stringify(batch),
    });
    if (!res.success || !res.data) throw new Error(res.message || 'Gagal menyimpan alokasi stok');
    return res.data;
  },

  // Inventory
  async getInventory(): Promise<Record<string, number>> {
    if (USE_MOCK) return mockApi.getInventory();

    const res = await apiClient<Record<string, number>>('/api/warehouse/inventory');
    if (!res.success || !res.data) throw new Error(res.message || 'Gagal memuat sisa stok riil');
    return res.data;
  },

  // Riders
  async getRiders(): Promise<Rider[]> {
    if (USE_MOCK) return mockApi.getRiders();

    const res = await apiClient<Rider[]>('/api/warehouse/riders');
    if (!res.success || !res.data) throw new Error(res.message || 'Gagal memuat daftar rider');
    return res.data;
  },

  // Reports
  async getReports(): Promise<PurchaseReport[]> {
    if (USE_MOCK) return mockApi.getReports();

    const res = await apiClient<PurchaseReport[]>('/api/warehouse/reports');
    if (!res.success || !res.data) throw new Error(res.message || 'Gagal memuat laporan setoran');
    return res.data;
  },
};

export * from './client';
export * from './mockApi';
