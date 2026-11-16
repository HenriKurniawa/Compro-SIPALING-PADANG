import { apiClient } from './client';
import { GPS_INTERVAL_MS, mockApi } from './mockApi';
import type { Korlap, Rider } from '../types';

/** Tanpa VITE_API_URL aplikasi berjalan dengan data dummy (backend belum tersedia). */
export const USE_MOCK = !import.meta.env.VITE_API_URL;

export const korlapApi = {
  // UC-03 Login — POST /auth/login (SDD §11)
  async login(username: string, password: string): Promise<{ user: Korlap; token: string }> {
    if (USE_MOCK) return mockApi.login(username, password);

    const res = await apiClient<{ user: Korlap; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (!res.success || !res.data) throw new Error(res.message || 'Username atau password salah. Coba lagi.');
    return res.data;
  },

  // UC-04 Logout — POST /auth/logout (SDD §11)
  async logout(): Promise<void> {
    if (USE_MOCK) return;
    await apiClient('/auth/logout', { method: 'POST' });
  },

  // Ubah password Korlap.
  // BELUM DIIMPLEMENTASIKAN di backend: SDD §11 belum mendefinisikan endpoint ubah password untuk Korlap.
  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    if (USE_MOCK) return mockApi.changePassword(username, oldPassword, newPassword);
    throw new Error('Fitur ubah password belum tersedia: endpoint belum didefinisikan di SDD.');
  },

  // UC-13/UC-14 — GET /riders/active (SDD §11)
  async getRiders(): Promise<Rider[]> {
    if (USE_MOCK) return mockApi.getRiders();

    const res = await apiClient<Rider[]>('/riders/active');
    if (!res.success || !res.data) throw new Error(res.message || 'Gagal memuat data rider');
    return res.data;
  },

  /**
   * Pembaruan posisi rider secara real-time.
   * Mode mock: simulasi event `rider:moved`.
   * Mode API: sementara polling GET /riders/active tiap 10 detik.
   * TODO: ganti dengan socket.io-client (event rider:moved / rider:active / rider:inactive, SDD §12)
   *       setelah WebSocket server backend tersedia.
   */
  subscribeRiderUpdates(onUpdate: (rider: Rider) => void): () => void {
    if (USE_MOCK) return mockApi.subscribeRiderUpdates(onUpdate);

    const timer = setInterval(async () => {
      const res = await apiClient<Rider[]>('/riders/active');
      if (res.success && res.data) res.data.forEach(onUpdate);
    }, GPS_INTERVAL_MS);
    return () => clearInterval(timer);
  },
};

export { GPS_INTERVAL_MS };
