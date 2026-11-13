// Model data yang dipakai aplikasi Riders (mengikuti SDD Sipaling NasPad).
// Bentuk JSON dari backend sebaiknya mengikuti tipe-tipe ini (lihat API.md).

export type Rider = {
  id: string;
  name: string;
  phone: string;
  username: string;
  cartId: string; // ID gerobak, mis. "GRB-012"
  warehouse: string; // "Kertajaya" | "Darmo"
  isWorking: boolean;
};

export type LatLng = { lat: number; lng: number };

export type OrderType = 'antar' | 'pickup'; // Call Rider (antar) | Pick Up

/**
 * Alur status pesanan online (SDD UC-17 s.d. UC-20):
 * baru            -> permintaan customer masuk, rider menerima / menolak
 * menunggu_bayar  -> rider menerima, customer membayar lewat chatbot WhatsApp
 * verifikasi      -> customer sudah konfirmasi bayar, rider mengecek pembayaran (UC-20)
 * diproses        -> pembayaran valid, rider menyiapkan makanan
 * diantar         -> rider menuju lokasi customer (khusus antar)
 * selesai         -> diterima customer / sudah diambil
 * ditolak         -> rider menolak dengan alasan
 */
export type OrderStatus = 'baru' | 'menunggu_bayar' | 'verifikasi' | 'diproses' | 'diantar' | 'selesai' | 'ditolak';

export type OrderItem = {
  menuId: string;
  name: string;
  qty: number;
  price: number; // harga satuan (Rupiah)
};

export type PaymentMethod = 'qris' | 'tunai';

export type Order = {
  id: string; // "ORD-0231"
  customerName: string;
  customerPhone: string; // format 62812xxxx
  type: OrderType;
  status: OrderStatus;
  createdAt: string; // ISO 8601
  distanceKm: number;
  address?: string; // wajib untuk antar
  note?: string;
  location?: LatLng; // pin peta customer (antar)
  paymentMethod?: PaymentMethod; // diisi setelah customer konfirmasi via WhatsApp
  items: OrderItem[]; // menu sudah dipilih customer sejak memesan
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  stock: number; // sisa porsi di gerobak, diperbarui rider (UC-35)
  imageUrl?: string;
};

/** Kiriman stok dari gudang yang perlu dikonfirmasi rider. */
export type StockAllocation = {
  id: string; // "OUT-301026-004"
  createdAt: string;
  warehouse: string;
  status: 'menunggu' | 'dikonfirmasi';
  items: { menuId: string; name: string; qty: number }[];
};

/** Member customer untuk hitungan loyalitas (UC-34). */
export type Member = {
  phone: string;
  name: string;
  completedTransactions: number; // menuju 10 transaksi
  rewardAvailable: boolean; // punya bonus 1 paket nasi + lauk
};

export type TransactionSource = 'online' | 'offline';

export type Transaction = {
  id: string; // "TRX-0412" atau "ORD-0230"
  source: TransactionSource;
  method: PaymentMethod;
  items: { name: string; qty: number }[];
  total: number;
  createdAt: string; // ISO 8601
  orderType?: OrderType;
  cashReceived?: number;
  change?: number;
  memberName?: string;
};

export const REJECT_REASONS = ['Stok menu habis', 'Lokasi terlalu jauh', 'Sedang ramai pembeli', 'Lainnya'] as const;
export type RejectReason = (typeof REJECT_REASONS)[number];
