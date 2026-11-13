import type { RidersApi } from './types';
import type { Member, MenuItem, Order, Rider, StockAllocation, Transaction } from '../types';
import { addDays, isoDate } from '../utils/format';

// Data contoh supaya semua layar bisa dicoba tanpa backend.
// Akun demo: nomor 081234567890 (atau username budi.grb012), password naspad2026

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

const now = new Date();
const at = (daysAgo: number, h: number, m: number) => {
  const d = addDays(now, -daysAgo);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const minutesAgo = (min: number) => new Date(Date.now() - min * 60000).toISOString();

let rider: Rider = {
  id: 'rdr-012',
  name: 'Budi Santoso',
  phone: '081234567890',
  username: 'budi.grb012',
  cartId: 'GRB-012',
  warehouse: 'Kertajaya',
  isWorking: false,
};

let menu: MenuItem[] = [
  { id: 'rendang', name: 'Rendang Sapi', price: 18000, stock: 5 },
  { id: 'dendeng', name: 'Dendeng Balado', price: 17000, stock: 6 },
  { id: 'gulai', name: 'Ayam Gulai', price: 10000, stock: 8 },
  { id: 'ayampop', name: 'Ayam Pop', price: 10000, stock: 8 },
  { id: 'telor', name: 'Telor Balado', price: 7000, stock: 2 },
  { id: 'perkedel', name: 'Perkedel Kentang', price: 5000, stock: 0 },
];

let allocations: StockAllocation[] = [
  {
    id: 'OUT-' + isoDate(now).replace(/-/g, '').slice(2) + '-004',
    createdAt: minutesAgo(30),
    warehouse: 'Kertajaya',
    status: 'menunggu',
    items: [
      { menuId: 'perkedel', name: 'Perkedel Kentang', qty: 10 },
      { menuId: 'telor', name: 'Telor Balado', qty: 6 },
    ],
  },
];

const members: Member[] = [
  { phone: '081298765432', name: 'Dinda Putri', completedTransactions: 7, rewardAvailable: false },
  { phone: '085712345678', name: 'Raka Aditya', completedTransactions: 10, rewardAvailable: true },
];

let orders: Order[] = [
  {
    id: 'ORD-0230', customerName: 'Nanda Pratama', customerPhone: '6281234500230', type: 'antar', status: 'diproses',
    createdAt: minutesAgo(18), distanceKm: 1.1, address: 'Kos Melati, Jl. Gayungsari 7', note: 'Kamar 3, lantai 2',
    location: { lat: -7.3305, lng: 112.7311 }, paymentMethod: 'qris',
    items: [{ menuId: 'gulai', name: 'Ayam Gulai', qty: 1, price: 10000 }, { menuId: 'telor', name: 'Telor Balado', qty: 1, price: 7000 }],
  },
  {
    id: 'ORD-0229', customerName: 'Raka Aditya', customerPhone: '6285712345678', type: 'pickup', status: 'verifikasi',
    createdAt: minutesAgo(9), distanceKm: 0.12, paymentMethod: 'tunai',
    items: [{ menuId: 'ayampop', name: 'Ayam Pop', qty: 1, price: 10000 }, { menuId: 'perkedel', name: 'Perkedel Kentang', qty: 1, price: 5000 }],
  },
  {
    id: 'ORD-0226', customerName: 'Sari Wulandari', customerPhone: '6281234500226', type: 'antar', status: 'diantar',
    createdAt: minutesAgo(40), distanceKm: 0.65, address: 'Jl. Ketintang Madya 21', note: 'Rumah cat hijau',
    location: { lat: -7.3165, lng: 112.7262 }, paymentMethod: 'qris',
    items: [{ menuId: 'rendang', name: 'Rendang Sapi', qty: 2, price: 18000 }],
  },
];

// Permintaan baru yang masuk beberapa detik setelah rider mulai bekerja.
const incoming: Order = {
  id: 'ORD-0231', customerName: 'Dinda Putri', customerPhone: '6281298765432', type: 'antar', status: 'baru',
  createdAt: '', distanceKm: 0.8, address: 'Jl. Ketintang Baru II No. 14', note: 'Pagar hijau',
  location: { lat: -7.3195, lng: 112.733 },
  // Customer sudah memilih menu saat memesan (sesuai aplikasi Customer).
  items: [{ menuId: 'rendang', name: 'Rendang Sapi', qty: 2, price: 18000 }, { menuId: 'ayampop', name: 'Ayam Pop', qty: 1, price: 10000 }],
};
let incomingSent = false;

let transactions: Transaction[] = [
  { id: 'TRX-0410', source: 'offline', method: 'qris', items: [{ name: 'Rendang Sapi', qty: 2 }], total: 36000, createdAt: at(0, 11, 20) },
  { id: 'ORD-0221', source: 'online', method: 'qris', orderType: 'antar', items: [{ name: 'Dendeng Balado', qty: 1 }, { name: 'Ayam Pop', qty: 1 }], total: 27000, createdAt: at(0, 10, 48) },
  { id: 'TRX-0398', source: 'offline', method: 'tunai', items: [{ name: 'Ayam Pop', qty: 1 }, { name: 'Ayam Gulai', qty: 1 }], total: 20000, createdAt: at(1, 13, 5), cashReceived: 50000, change: 30000 },
  { id: 'ORD-0215', source: 'online', method: 'qris', orderType: 'antar', items: [{ name: 'Rendang Sapi', qty: 2 }, { name: 'Ayam Pop', qty: 1 }], total: 46000, createdAt: at(1, 12, 10) },
  { id: 'TRX-0395', source: 'offline', method: 'tunai', items: [{ name: 'Telor Balado', qty: 1 }], total: 7000, createdAt: at(1, 11, 42), cashReceived: 10000, change: 3000 },
  { id: 'TRX-0371', source: 'offline', method: 'qris', items: [{ name: 'Ayam Pop', qty: 1 }, { name: 'Dendeng Balado', qty: 1 }], total: 27000, createdAt: at(4, 12, 31) },
  { id: 'ORD-0190', source: 'online', method: 'tunai', orderType: 'pickup', items: [{ name: 'Rendang Sapi', qty: 1 }], total: 18000, createdAt: at(4, 11, 58) },
];
let trxCounter = 412;

const orderTotal = (o: Order) => o.items.reduce((s, i) => s + i.qty * i.price, 0);
const findOrder = (id: string) => {
  const o = orders.find((x) => x.id === id);
  if (!o) throw new Error('Pesanan tidak ditemukan.');
  return o;
};
const normPhone = (p: string) => p.replace(/\D/g, '').replace(/^62/, '0');

export const mockApi: RidersApi = {
  async login(identifier, password) {
    await wait(600);
    const id = identifier.trim().toLowerCase();
    const okId = id === rider.username || normPhone(id) === rider.phone;
    if (!okId || password !== 'naspad2026') throw new Error('Nomor/username atau password salah.');
    return { token: 'mock-token', rider: clone(rider) };
  },
  async logout() {
    await wait(200);
    rider = { ...rider, isWorking: false };
  },

  async setWorking(working) {
    await wait();
    rider = { ...rider, isWorking: working };
    if (working && !incomingSent) {
      incomingSent = true;
      setTimeout(() => {
        orders = [{ ...clone(incoming), createdAt: new Date().toISOString() }, ...orders];
      }, 5000);
    }
    return clone(rider);
  },
  sendLocation() {
    // Backend asli menerima posisi lewat WebSocket untuk peta Korlap & customer.
  },

  async getOrders(statuses) {
    await wait(250);
    return clone(orders.filter((o) => statuses.includes(o.status)));
  },
  async acceptOrder(id) {
    await wait();
    const o = findOrder(id);
    o.status = 'menunggu_bayar';
    // Simulasi: customer membayar lewat chatbot WhatsApp.
    if (id === incoming.id) {
      setTimeout(() => {
        const x = orders.find((y) => y.id === id);
        if (x && x.status === 'menunggu_bayar') Object.assign(x, { paymentMethod: 'qris' as const, status: 'verifikasi' as const });
      }, 6000);
    }
    return clone(o);
  },
  async rejectOrder(id) {
    await wait();
    findOrder(id).status = 'ditolak';
  },
  async verifyPayment(id) {
    await wait();
    const o = findOrder(id);
    o.status = 'diproses';
    return clone(o);
  },
  async startDelivery(id) {
    await wait();
    const o = findOrder(id);
    o.status = 'diantar';
    return clone(o);
  },
  async completeOrder(id) {
    await wait();
    const o = findOrder(id);
    o.status = 'selesai';
    transactions = [
      {
        id: o.id, source: 'online', method: o.paymentMethod ?? 'qris', orderType: o.type,
        items: o.items.map((i) => ({ name: i.name, qty: i.qty })), total: orderTotal(o), createdAt: new Date().toISOString(),
      },
      ...transactions,
    ];
    return clone(o);
  },

  async getMenu() {
    await wait(250);
    return clone(menu);
  },
  async findMember(phone) {
    await wait(400);
    const m = members.find((x) => x.phone === normPhone(phone));
    return m ? clone(m) : null;
  },
  async getQrisPayload(total) {
    await wait(200);
    return `SIPALING-DEMO|${rider.cartId}|${total}`;
  },
  async createOfflineTransaction({ items, method, cashReceived, memberPhone }) {
    await wait(500);
    let total = 0;
    const lines = items.map(({ menuId, qty }) => {
      const m = menu.find((x) => x.id === menuId);
      if (!m) throw new Error('Menu tidak ditemukan.');
      total += m.price * qty;
      return { m, qty };
    });
    if (method === 'tunai' && (cashReceived ?? 0) < total) throw new Error('Uang yang diterima kurang.');
    const member = memberPhone ? members.find((x) => x.phone === normPhone(memberPhone)) : undefined;
    if (member) member.completedTransactions += 1;
    // Sesuai SDD: stok TIDAK berkurang otomatis, rider memperbaruinya sendiri (UC-35).
    trxCounter += 1;
    const trx: Transaction = {
      id: `TRX-0${trxCounter}`, source: 'offline', method, total,
      items: lines.map(({ m, qty }) => ({ name: m.name, qty })),
      createdAt: new Date().toISOString(),
      ...(method === 'tunai' ? { cashReceived, change: (cashReceived ?? 0) - total } : {}),
      ...(member ? { memberName: member.name } : {}),
    };
    transactions = [trx, ...transactions];
    return clone(trx);
  },

  async getAllocations() {
    await wait(250);
    return clone(allocations);
  },
  async confirmAllocation(id) {
    await wait();
    const a = allocations.find((x) => x.id === id);
    if (!a) throw new Error('Kiriman stok tidak ditemukan.');
    if (a.status === 'menunggu') {
      a.status = 'dikonfirmasi';
      a.items.forEach((it) => {
        const m = menu.find((x) => x.id === it.menuId);
        if (m) m.stock += it.qty;
      });
    }
    return clone(a);
  },
  async updateStock(stocks) {
    await wait(400);
    stocks.forEach(({ menuId, stock }) => {
      const m = menu.find((x) => x.id === menuId);
      if (m) m.stock = Math.max(0, Math.round(stock));
    });
    return clone(menu);
  },

  async getTransactions({ from, to, source }) {
    await wait(250);
    return clone(
      transactions
        .filter((t) => {
          const d = isoDate(new Date(t.createdAt));
          return d >= from && d <= to && (!source || t.source === source);
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  },
};
