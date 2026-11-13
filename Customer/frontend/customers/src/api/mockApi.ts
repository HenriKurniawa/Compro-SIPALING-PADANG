// Data contoh supaya aplikasi bisa dicoba tanpa backend.
// Akun demo: 081234567890 / naspad2026 — kode OTP daftar: 123456
import { ApiError } from './client';
import type { CustomerApi } from './types';
import type { Cart, Customer, LatLng, Loyalty, MenuItem, Order, OrderStatus } from '../types';

const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));

// Posisi contoh pelanggan (bisa diganti GPS asli di HP).
export const DEMO_POSITION: LatLng = { lat: -6.3628, lng: 106.8269 };

const MENU: MenuItem[] = [
  { id: 'rendang', name: 'Nasi Rendang', price: 23000, stock: 12 },
  { id: 'ayampop', name: 'Nasi Ayam Pop', price: 20000, stock: 8 },
  { id: 'dendeng', name: 'Nasi Dendeng Balado', price: 22000, stock: 6 },
  { id: 'gulai', name: 'Nasi Gulai Tunjang', price: 21000, stock: 0 },
  { id: 'telor', name: 'Nasi Telor Balado', price: 15000, stock: 10 },
  { id: 'perkedel', name: 'Perkedel Kentang', price: 5000, stock: 14 },
];

const CARTS: Cart[] = [
  {
    id: 'GRB-012',
    riderName: 'Budi',
    riderPhone: '6281234567890',
    location: { lat: -6.3609, lng: 106.8281 },
    distanceKm: 0.3,
    stock: [],
  },
  {
    id: 'GRB-025',
    riderName: 'Dani',
    riderPhone: '6281311122233',
    location: { lat: -6.3667, lng: 106.8236 },
    distanceKm: 0.6,
    stock: [],
  },
];
const cartMenu: Record<string, MenuItem[]> = {
  'GRB-012': MENU.map((m) => ({ ...m })),
  'GRB-025': MENU.map((m) => ({ ...m, stock: Math.max(0, m.stock - 5) })),
};

type Account = Customer & { password: string };
const accounts: Account[] = [{ id: 'CUS-001', name: 'Sasaw', phone: '6281234567890', password: 'naspad2026' }];
let me: Account | null = null;
let loyalty: Loyalty = { points: 1, target: 10, rewards: 0 };
const pending = new Map<string, { name: string; phone: string }>();
const regTokens = new Map<string, { name: string; phone: string }>();

const ago = (days: number, h: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(h, 15, 0, 0);
  return d.toISOString();
};
const orders: Order[] = [
  {
    id: 'ORD-0198',
    cartId: 'GRB-012',
    riderName: 'Budi',
    riderPhone: '6281234567890',
    type: 'pickup',
    status: 'selesai',
    items: [{ menuId: 'rendang', name: 'Nasi Rendang', qty: 2, price: 23000 }],
    total: 46000,
    createdAt: ago(2, 12),
  },
  {
    id: 'ORD-0174',
    cartId: 'GRB-025',
    riderName: 'Dani',
    riderPhone: '6281311122233',
    type: 'antar',
    status: 'selesai',
    items: [
      { menuId: 'ayampop', name: 'Nasi Ayam Pop', qty: 1, price: 20000 },
      { menuId: 'perkedel', name: 'Perkedel Kentang', qty: 2, price: 5000 },
    ],
    total: 30000,
    createdAt: ago(5, 19),
    address: 'Jl.Ketintang No. 12, Kos Melati kamar 4',
  },
];

const normalize = (phone: string) => {
  const d = phone.replace(/\D/g, '');
  if (d.startsWith('62')) return d;
  if (d.startsWith('0')) return '62' + d.slice(1);
  return '62' + d;
};
const requireLogin = () => {
  if (!me) throw new ApiError(401, 'Sesi berakhir. Silakan masuk lagi.');
  return me;
};

/* ---- Simulasi rider & chatbot ---- */
function setStatus(o: Order, status: OrderStatus, extra: Partial<Order> = {}) {
  Object.assign(o, { status }, extra);
  if (status === 'selesai') {
    loyalty = { ...loyalty, points: loyalty.points + 1 };
    if (loyalty.points >= loyalty.target) loyalty = { ...loyalty, points: 0, rewards: loyalty.rewards + 1 };
  }
}
function after(ms: number, o: Order, from: OrderStatus, fn: () => void) {
  setTimeout(() => {
    if (o.status === from) fn();
  }, ms);
}

/** Mode demo saja: pura-pura sudah konfirmasi bayar di chatbot WhatsApp. */
export function demoPay(orderId: string) {
  const o = orders.find((x) => x.id === orderId);
  if (!o || o.status !== 'menunggu_bayar') return;
  setStatus(o, 'verifikasi');
  after(5000, o, 'verifikasi', () => {
    setStatus(o, 'diproses');
    after(8000, o, 'diproses', () => {
      if (o.type === 'antar') {
        setStatus(o, 'diantar', { cartLocation: { lat: -6.3618, lng: 106.8276 } });
        after(9000, o, 'diantar', () => setStatus(o, 'selesai'));
      } else {
        after(4000, o, 'diproses', () => setStatus(o, 'selesai'));
      }
    });
  });
}

let seq = 231;
export const mockApi: CustomerApi = {
  async login(phone, password) {
    await wait();
    const acc = accounts.find((a) => a.phone === normalize(phone));
    if (!acc || acc.password !== password) throw new ApiError(401, 'Nomor WhatsApp atau password salah.');
    me = acc;
    return { token: 'demo-token', customer: { id: acc.id, name: acc.name, phone: acc.phone } };
  },
  async requestRegisterOtp(name, phone) {
    await wait();
    const p = normalize(phone);
    if (accounts.some((a) => a.phone === p)) throw new ApiError(409, 'Nomor ini sudah terdaftar. Silakan masuk.');
    pending.set(p, { name, phone: p });
  },
  async verifyRegisterOtp(phone, code) {
    await wait();
    const p = normalize(phone);
    const data = pending.get(p);
    if (!data) throw new ApiError(400, 'Minta kode OTP dulu.');
    if (code !== '123456') throw new ApiError(400, 'Kode OTP salah. (Demo: 123456)');
    const token = 'reg-' + p;
    regTokens.set(token, data);
    return { registrationToken: token };
  },
  async completeRegistration(token, password) {
    await wait();
    const data = regTokens.get(token);
    if (!data) throw new ApiError(400, 'Pendaftaran kedaluwarsa. Ulangi dari awal.');
    accounts.push({ id: 'CUS-' + (accounts.length + 1), ...data, password });
  },
  async logout() {
    await wait(200);
    me = null;
  },

  async getNearbyCarts() {
    await wait();
    return CARTS.map((c) => ({
      ...c,
      stock: cartMenu[c.id].filter((m) => m.id !== 'perkedel').map((m) => ({ menuId: m.id, name: m.name.replace('Nasi ', ''), stock: m.stock })),
    }));
  },
  async getCartMenu(cartId) {
    await wait();
    const m = cartMenu[cartId];
    if (!m) throw new ApiError(404, 'Gerobak tidak ditemukan.');
    return m.map((x) => ({ ...x }));
  },

  async createOrder(input) {
    await wait(700);
    requireLogin();
    if (orders.some((o) => !['selesai', 'ditolak'].includes(o.status)))
      throw new ApiError(409, 'Kamu masih punya pesanan aktif. Selesaikan dulu ya.');
    const cart = CARTS.find((c) => c.id === input.cartId);
    if (!cart) throw new ApiError(404, 'Gerobak tidak ditemukan.');
    const menu = cartMenu[cart.id];
    const items = input.items.map((i) => {
      const m = menu.find((x) => x.id === i.menuId);
      if (!m) throw new ApiError(400, 'Menu tidak tersedia.');
      return { menuId: m.id, name: m.name, qty: i.qty, price: m.price };
    });
    const o: Order = {
      id: `ORD-0${seq++}`,
      cartId: cart.id,
      riderName: cart.riderName,
      riderPhone: cart.riderPhone,
      type: input.type,
      status: 'menunggu_rider',
      items,
      total: items.reduce((s, i) => s + i.qty * i.price, 0),
      createdAt: new Date().toISOString(),
      address: input.address,
      note: input.note,
      location: input.location,
      cartLocation: cart.location,
    };
    orders.unshift(o);
    // Gerobak #025 menolak untuk contoh notifikasi "pesanan ditolak".
    after(5000, o, 'menunggu_rider', () =>
      cart.id === 'GRB-025'
        ? setStatus(o, 'ditolak', { rejectReason: 'Stok menu habis' })
        : setStatus(o, 'menunggu_bayar', { whatsappUrl: 'https://wa.me/6281100000000?text=Bayar%20' + o.id }),
    );
    return { ...o };
  },
  async getOrder(id) {
    await wait(200);
    const o = orders.find((x) => x.id === id);
    if (!o) throw new ApiError(404, 'Pesanan tidak ditemukan.');
    return { ...o };
  },
  async getActiveOrder() {
    await wait(200);
    if (!me) return null;
    const o = orders.find((x) => !['selesai', 'ditolak'].includes(x.status));
    return o ? { ...o } : null;
  },
  async cancelOrder(id) {
    await wait();
    const o = orders.find((x) => x.id === id);
    if (!o) throw new ApiError(404, 'Pesanan tidak ditemukan.');
    if (o.status !== 'menunggu_rider' && o.status !== 'menunggu_bayar')
      throw new ApiError(400, 'Pesanan sudah diproses rider, tidak bisa dibatalkan.');
    const idx = orders.indexOf(o);
    orders.splice(idx, 1);
  },

  async getHistory() {
    await wait();
    requireLogin();
    return orders.filter((o) => o.status === 'selesai' || o.status === 'ditolak').map((o) => ({ ...o }));
  },
  async getLoyalty() {
    await wait(250);
    requireLogin();
    return { ...loyalty };
  },

  async updateProfile({ name }) {
    await wait();
    const acc = requireLogin();
    acc.name = name;
    return { id: acc.id, name: acc.name, phone: acc.phone };
  },
  async changePassword(oldPassword, newPassword) {
    await wait();
    const acc = requireLogin();
    if (acc.password !== oldPassword) throw new ApiError(400, 'Password lama salah.');
    acc.password = newPassword;
  },
  async deleteAccount(password) {
    await wait();
    const acc = requireLogin();
    if (acc.password !== password) throw new ApiError(400, 'Password salah.');
    accounts.splice(accounts.indexOf(acc), 1);
    me = null;
  },
};
