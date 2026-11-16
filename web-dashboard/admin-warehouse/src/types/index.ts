export interface Admin {
  id: string;
  name: string;
  warehouse: 'Kertajaya' | 'Darmo' | string;
  activated: boolean;
  username: string;
  password?: string;
  phone?: string;
  role?: string;
}

export interface MenuItem {
  name: string;
  price: number;
}

export interface StockInItem {
  menu: string;
  qty: number;
  note?: string;
}

export interface StockInBatch {
  id: string;
  date: string;
  time: string;
  by: string;
  items: StockInItem[];
}

export interface StockOutItem {
  menu: string;
  qty: number;
}

export interface StockOutBatch {
  id: string;
  date: string;
  riderId: string;
  gerobak: string;
  status: 'Berjalan' | 'Selesai' | 'Menunggu' | 'Ditolak';
  items: StockOutItem[];
}

export interface Rider {
  id: string;
  name: string;
  gerobak: string;
  phone: string;
  status: 'Aktif' | 'Nonaktif' | 'Keliling' | 'Selesai';
}

export interface PurchaseItem {
  menu: string;
  qty: number;
  price: number;
}

export interface PurchaseReport {
  id: string;
  riderId: string;
  date: string;
  items: PurchaseItem[];
}
