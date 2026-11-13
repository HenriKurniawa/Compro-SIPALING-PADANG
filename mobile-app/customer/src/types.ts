// Model data aplikasi Customer Sipaling NasPad (lihat API.md).

export type LatLng = { lat: number; lng: number };

export type Customer = {
  id: string;
  name: string;
  phone: string; // 62812xxxx
};

/** Gerobak aktif di sekitar customer (radius 1,5 km). */
export type Cart = {
  id: string; // "GRB-012"
  riderName: string;
  riderPhone: string;
  location: LatLng;
  distanceKm: number;
  stock: { menuId: string; name: string; stock: number }[];
};

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

export type OrderType = 'pickup' | 'antar'; // Pick Up | Call Riders (antar)

/**
 * Status pesanan dari sisi customer:
 * menunggu_rider -> rider belum menjawab
 * ditolak        -> rider menolak (ada alasan)
 * menunggu_bayar -> rider menerima, customer konfirmasi bayar via chatbot WhatsApp
 * verifikasi     -> rider mengecek pembayaran
 * diproses       -> rider membuat makanan
 * diantar        -> rider menuju lokasi customer (khusus antar)
 * selesai
 */
export type OrderStatus = 'menunggu_rider' | 'ditolak' | 'menunggu_bayar' | 'verifikasi' | 'diproses' | 'diantar' | 'selesai';

export type OrderItem = { menuId: string; name: string; qty: number; price: number };

export type Order = {
  id: string;
  cartId: string;
  riderName: string;
  riderPhone: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
  address?: string;
  note?: string;
  location?: LatLng; // titik antar (antar)
  cartLocation?: LatLng; // posisi gerobak terkini
  rejectReason?: string;
  whatsappUrl?: string; // tautan chatbot konfirmasi pembayaran
};

/** Kartu stempel: setiap 10 transaksi selesai = gratis 1 paket nasi + lauk (SDD UC-30). */
export type Loyalty = {
  points: number; // stempel terkumpul di kartu sekarang (0–9)
  target: number; // 10
  rewards: number; // paket gratis yang siap dipakai
};
