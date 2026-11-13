import type {
  LatLng,
  Member,
  MenuItem,
  Order,
  OrderStatus,
  PaymentMethod,
  Rider,
  StockAllocation,
  Transaction,
  TransactionSource,
} from '../types';

// Daftar semua pemanggilan data aplikasi Riders.
// Ada 2 implementasi: httpApi (backend asli) dan mockApi (data contoh).
export interface RidersApi {
  /** identifier = nomor HP atau username (SDD: login semua role pakai nomor/username + password) */
  login(identifier: string, password: string): Promise<{ token: string; rider: Rider }>;
  logout(): Promise<void>;

  // UC-15 Mulai & Akhiri Bekerja
  setWorking(working: boolean): Promise<Rider>;
  sendLocation(pos: LatLng & { recordedAt: string }): void; // lewat WebSocket

  // UC-17 s.d. UC-20 Pesanan online
  getOrders(statuses: OrderStatus[]): Promise<Order[]>;
  acceptOrder(orderId: string): Promise<Order>;
  rejectOrder(orderId: string, reason: string, note?: string): Promise<void>;
  verifyPayment(orderId: string): Promise<Order>; // UC-20
  startDelivery(orderId: string): Promise<Order>; // UC-18
  completeOrder(orderId: string): Promise<Order>; // UC-19 (diterima / sudah diambil)

  // UC-16 Pesanan offline, UC-34 kaitkan member
  getMenu(): Promise<MenuItem[]>;
  findMember(phone: string): Promise<Member | null>;
  getQrisPayload(total: number): Promise<string>;
  createOfflineTransaction(input: {
    items: { menuId: string; qty: number }[];
    method: PaymentMethod;
    cashReceived?: number;
    memberPhone?: string;
  }): Promise<Transaction>;

  // UC-35 Perbarui stok gerobak
  getAllocations(): Promise<StockAllocation[]>;
  confirmAllocation(id: string): Promise<StockAllocation>;
  updateStock(stocks: { menuId: string; stock: number }[]): Promise<MenuItem[]>;

  // UC-21 Riwayat pembelian, UC-22 Laporan setoran
  getTransactions(filter: { from: string; to: string; source?: TransactionSource }): Promise<Transaction[]>;
}
