import type { Admin, StockInBatch, StockOutBatch, Rider, PurchaseReport } from '../types';
import { ADMINS, MENUS, RIDERS, STOCK_IN, STOCK_OUT, PURCHASES } from '../data/mockData';

// Simulated delay helper
const delay = (ms: number = 50) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // 1. Auth Login
  async login(username: string, password: string): Promise<{ user: Admin; token: string }> {
    await delay();
    const storedAccounts = localStorage.getItem('sipaling_warehouse_accounts');
    const accounts: Admin[] = storedAccounts ? JSON.parse(storedAccounts) : ADMINS;

    const user = accounts.find(
      (a) => a.activated && a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
    );

    if (!user) {
      throw new Error('Username atau kata sandi admin gudang tidak valid');
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    return { user, token };
  },

  // 2. Stock In API
  async getStockIns(): Promise<StockInBatch[]> {
    await delay();
    const saved = localStorage.getItem('sipaling_stock_ins');
    return saved ? JSON.parse(saved) : STOCK_IN;
  },

  async addStockIn(batch: Omit<StockInBatch, 'id'>): Promise<StockInBatch> {
    await delay();
    const current = await this.getStockIns();
    const newBatch: StockInBatch = {
      ...batch,
      id: `IN-${Date.now().toString().slice(-6)}`,
    };
    const updated = [newBatch, ...current];
    localStorage.setItem('sipaling_stock_ins', JSON.stringify(updated));
    return newBatch;
  },

  // 3. Stock Out API
  async getStockOuts(): Promise<StockOutBatch[]> {
    await delay();
    const saved = localStorage.getItem('sipaling_stock_outs');
    return saved ? JSON.parse(saved) : STOCK_OUT;
  },

  async addStockOut(batch: Omit<StockOutBatch, 'id'>): Promise<StockOutBatch> {
    await delay();
    const current = await this.getStockOuts();
    const newBatch: StockOutBatch = {
      ...batch,
      id: `OUT-${Date.now().toString().slice(-6)}`,
    };
    const updated = [newBatch, ...current];
    localStorage.setItem('sipaling_stock_outs', JSON.stringify(updated));
    return newBatch;
  },

  // 4. Inventory / Sisa Stok Riil
  async getInventory(): Promise<Record<string, number>> {
    await delay();
    const stockIns = await this.getStockIns();
    const stockOuts = await this.getStockOuts();

    const stock: Record<string, number> = {};
    MENUS.forEach((m) => {
      stock[m.name] = 0;
    });

    stockIns.forEach((batch) => {
      batch.items.forEach((item) => {
        stock[item.menu] = (stock[item.menu] || 0) + Number(item.qty || 0);
      });
    });

    stockOuts.forEach((batch) => {
      batch.items.forEach((item) => {
        stock[item.menu] = (stock[item.menu] || 0) - Number(item.qty || 0);
      });
    });

    return stock;
  },

  // 5. Riders
  async getRiders(): Promise<Rider[]> {
    await delay();
    return RIDERS;
  },

  // 6. Reports
  async getReports(): Promise<PurchaseReport[]> {
    await delay();
    return PURCHASES;
  },
};
