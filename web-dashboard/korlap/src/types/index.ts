export type RiderStatus = 'active' | 'inactive';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Rider {
  id: string;
  name: string;
  /** ID gerobak, mis. "GRB-012" */
  cartId: string;
  phone: string;
  status: RiderStatus;
  /** Nama jalan / area lokasi terakhir; null jika rider belum pernah mengirim lokasi */
  lastLocationLabel: string | null;
  /** Posisi GPS terakhir; null jika belum tersedia */
  position: LatLng | null;
  /** Waktu update lokasi terakhir (ISO string); null jika belum pernah */
  lastUpdateAt: string | null;
  /** Jam mulai bekerja (ISO) untuk rider aktif */
  shiftStartedAt: string | null;
  /** Jam berhenti bekerja (ISO) untuk rider tidak aktif */
  shiftEndedAt: string | null;
  /** Gudang asal stok rider */
  warehouse: string;
}

export interface Korlap {
  id: string;
  name: string;
  username: string;
  /** Wilayah yang dipantau, mis. "Kertajaya" */
  region: string;
  phone: string;
}

export type RiderFilter = 'all' | 'active' | 'inactive';
