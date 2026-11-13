import { API_BASE_URL, getAuthToken, qs, request } from './client';
import type { RidersApi } from './types';
import type { Member, MenuItem, Order, Rider, StockAllocation, Transaction } from '../types';

// Implementasi ke backend asli (NestJS). Endpoint lengkap ada di API.md.

/* ---------- WebSocket untuk kirim posisi GPS (SDD: UC-15, tiap 10 detik) ---------- */
const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/ws/tracking';
let socket: WebSocket | null = null;

function trackingSocket(): WebSocket | null {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return socket;
  const token = getAuthToken();
  if (!token) return null;
  socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
  socket.onclose = () => {
    socket = null; // tersambung ulang otomatis saat posisi berikutnya dikirim
  };
  return socket;
}

function closeTrackingSocket() {
  socket?.close();
  socket = null;
}

export const httpApi: RidersApi = {
  login: (identifier, password) =>
    request<{ token: string; rider: Rider }>('POST', '/auth/login', { identifier, password, role: 'rider' }),
  logout: async () => {
    closeTrackingSocket();
    await request<void>('POST', '/auth/logout');
  },

  setWorking: async (working) => {
    const rider = await request<Rider>('PATCH', '/riders/me/status', { isWorking: working });
    if (!working) closeTrackingSocket();
    return rider;
  },
  sendLocation: (pos) => {
    const ws = trackingSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'location', ...pos }));
    }
  },

  getOrders: (statuses) => request<Order[]>('GET', `/riders/me/orders${qs({ status: statuses.join(',') })}`),
  acceptOrder: (id) => request<Order>('POST', `/orders/${id}/accept`),
  rejectOrder: (id, reason, note) => request<void>('POST', `/orders/${id}/reject`, { reason, note }),
  verifyPayment: (id) => request<Order>('POST', `/orders/${id}/verify-payment`),
  startDelivery: (id) => request<Order>('POST', `/orders/${id}/deliver`),
  completeOrder: (id) => request<Order>('POST', `/orders/${id}/complete`),

  getMenu: () => request<MenuItem[]>('GET', '/riders/me/menu'),
  findMember: async (phone) => {
    try {
      return await request<Member>('GET', `/members/${encodeURIComponent(phone)}`);
    } catch (e) {
      if ((e as { status?: number }).status === 404) return null;
      throw e;
    }
  },
  getQrisPayload: async (total) => (await request<{ payload: string }>('POST', '/riders/me/qris', { total })).payload,
  createOfflineTransaction: (input) => request<Transaction>('POST', '/riders/me/transactions', input),

  getAllocations: () => request<StockAllocation[]>('GET', '/riders/me/allocations'),
  confirmAllocation: (id) => request<StockAllocation>('POST', `/riders/me/allocations/${id}/confirm`),
  updateStock: (stocks) => request<MenuItem[]>('PUT', '/riders/me/stock', { stocks }),

  getTransactions: ({ from, to, source }) =>
    request<Transaction[]>('GET', `/riders/me/transactions${qs({ from, to, source })}`),
};
