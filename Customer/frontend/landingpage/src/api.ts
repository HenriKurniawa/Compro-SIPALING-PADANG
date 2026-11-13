// Semua pemanggilan data landing page ada di sini.
// Isi VITE_API_URL di file .env untuk memakai backend asli; kosong = data contoh.

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
export const USE_MOCK = API_URL === '';

export type CartInfo = { id: string; riderName: string };
export type MenuItem = { id: string; name: string; price: number; imageUrl: string };

async function request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const res = await fetch(API_URL + path, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const m = data?.message;
    throw new Error(Array.isArray(m) ? m.join(', ') : m || `Terjadi kesalahan (${res.status})`);
  }
  return data as T;
}

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

const MOCK_MENU: MenuItem[] = [
  { id: 'rendang', name: 'Rendang Sapi', price: 18000, imageUrl: '/menu/rendang.jpg' },
  { id: 'dendeng', name: 'Dendeng Balado', price: 17000, imageUrl: '/menu/dendeng.jpg' },
  { id: 'gulai', name: 'Ayam Gulai', price: 10000, imageUrl: '/menu/gulai.jpg' },
  { id: 'ayampop', name: 'Ayam Pop', price: 10000, imageUrl: '/menu/ayampop.jpg' },
  { id: 'telor', name: 'Telor Balado', price: 7000, imageUrl: '/menu/telor.jpg' },
  { id: 'perkedel', name: 'Perkedel Kentang', price: 5000, imageUrl: '/menu/perkedel.jpg' },
];
const MOCK_CARTS: Record<string, CartInfo> = {
  'GRB-012': { id: 'GRB-012', riderName: 'Budi' },
  'GRB-007': { id: 'GRB-007', riderName: 'Sinta' },
};

export const api = {
  /** Info gerobak dari tag NFC / QR (?gerobak=GRB-012). */
  async getCart(id: string): Promise<CartInfo | null> {
    if (USE_MOCK) {
      await wait(200);
      return MOCK_CARTS[id.toUpperCase()] ?? null;
    }
    try {
      return await request<CartInfo>('GET', `/public/carts/${encodeURIComponent(id)}`);
    } catch {
      return null;
    }
  },

  /** UC-23 Lihat menu (tanpa login). */
  async getMenu(): Promise<MenuItem[]> {
    if (USE_MOCK) {
      await wait(200);
      return MOCK_MENU;
    }
    return request<MenuItem[]>('GET', '/public/menu');
  },

  /** UC-01 Daftar: kirim OTP ke WhatsApp. phone format 62812xxxx */
  async requestOtp(input: { name: string; phone: string; cartId?: string }): Promise<void> {
    if (USE_MOCK) {
      await wait(800);
      if (input.phone === '6281111111111') throw new Error('Nomor ini sudah terdaftar. Silakan masuk lewat aplikasi.');
      return;
    }
    await request('POST', '/auth/register/request-otp', input);
  },

  /** UC-02 Verifikasi OTP. Kode demo: 123456 */
  async verifyOtp(phone: string, code: string): Promise<{ registrationToken: string }> {
    if (USE_MOCK) {
      await wait(700);
      if (code !== '123456') throw new Error('Kode OTP salah atau sudah kedaluwarsa.');
      return { registrationToken: 'mock-registration-token' };
    }
    return request('POST', '/auth/register/verify-otp', { phone, code });
  },

  /** UC-01 selesai: buat password akun. */
  async completeRegistration(registrationToken: string, password: string): Promise<void> {
    if (USE_MOCK) {
      await wait(700);
      return;
    }
    await request('POST', '/auth/register/complete', { registrationToken, password });
  },
};

export const LINKS = {
  playStore: import.meta.env.VITE_PLAY_STORE_URL || '#unduh',
  appStore: import.meta.env.VITE_APP_STORE_URL || '#unduh',
  whatsapp: import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/6280000000000',
  download: import.meta.env.VITE_DOWNLOAD_URL || 'https://sipaling.id/unduh',
};
