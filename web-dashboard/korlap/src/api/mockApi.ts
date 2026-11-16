import { MOCK_KORLAP_ACCOUNTS, createMockRiders } from '../data/mockData';
import type { Korlap, Rider } from '../types';

/** Interval kirim GPS rider sesuai SRS/SDD: setiap 10 detik */
export const GPS_INTERVAL_MS = 10_000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let riders: Rider[] = createMockRiders();

export const mockApi = {
  async login(username: string, password: string): Promise<{ user: Korlap; token: string }> {
    await delay(300);
    const account = MOCK_KORLAP_ACCOUNTS.find((a) => a.username === username.trim() && a.password === password);
    if (!account) throw new Error('Username atau password salah. Coba lagi.');
    const { password: _omit, ...user } = account;
    return { user, token: `mock-token-${user.id}` };
  },

  async changePassword(username: string, oldPassword: string, newPassword: string): Promise<void> {
    await delay(300);
    const account = MOCK_KORLAP_ACCOUNTS.find((a) => a.username === username);
    if (!account || account.password !== oldPassword) throw new Error('Password lama tidak sesuai.');
    account.password = newPassword;
  },

  async getRiders(): Promise<Rider[]> {
    await delay(200);
    return riders.map((r) => ({ ...r }));
  },

  /**
   * Simulasi siaran GPS (pengganti event WebSocket `rider:moved`).
   * Setiap rider aktif "mengirim" posisi baru setiap ±10 detik.
   */
  subscribeRiderUpdates(onUpdate: (rider: Rider) => void): () => void {
    const timer = setInterval(() => {
      const now = Date.now();
      riders = riders.map((r) => {
        if (r.status !== 'active' || !r.position || !r.lastUpdateAt) return r;
        if (now - new Date(r.lastUpdateAt).getTime() < GPS_INTERVAL_MS) return r;
        const moved: Rider = {
          ...r,
          position: {
            lat: r.position.lat + (Math.random() - 0.5) * 0.0006,
            lng: r.position.lng + (Math.random() - 0.5) * 0.0006,
          },
          lastUpdateAt: new Date(now).toISOString(),
        };
        onUpdate(moved);
        return moved;
      });
    }, 1000);
    return () => clearInterval(timer);
  },
};
