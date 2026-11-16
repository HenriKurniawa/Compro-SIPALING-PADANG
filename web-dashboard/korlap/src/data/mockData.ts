import type { Korlap, Rider } from '../types';

/**
 * DATA DUMMY — hanya dipakai selama backend belum tersedia (VITE_API_URL kosong).
 * Nama rider, ID gerobak, area, dan status diambil dari mockup Figma Page Korlap.
 * Nomor HP rider selain Budi & Wati serta koordinat GPS adalah contoh.
 */

export const MOCK_KORLAP_ACCOUNTS: Array<Korlap & { password: string }> = [
  {
    id: 'korlap-kertajaya',
    name: 'Ari Rahman',
    username: 'korlap.kertajaya',
    password: 'korlap123',
    region: 'Kertajaya',
    phone: '0812-7788-1100',
  },
];

const secondsAgo = (s: number) => new Date(Date.now() - s * 1000).toISOString();
const todayAt = (hour: number, minute: number) => {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const createMockRiders = (): Rider[] => [
  {
    id: 'rdr-012',
    name: 'Budi Santoso',
    cartId: 'GRB-012',
    phone: '0812-3456-7890',
    status: 'active',
    lastLocationLabel: 'Jl. Kertajaya Indah',
    position: { lat: -7.2794, lng: 112.7792 },
    lastUpdateAt: secondsAgo(5),
    shiftStartedAt: todayAt(10, 2),
    shiftEndedAt: null,
    warehouse: 'Kertajaya',
  },
  {
    id: 'rdr-007',
    name: 'Sinta Maharani',
    cartId: 'GRB-007',
    phone: '0813-2211-4455',
    status: 'active',
    lastLocationLabel: 'Jl. Manyar Kertoarjo',
    position: { lat: -7.2772, lng: 112.7628 },
    lastUpdateAt: secondsAgo(8),
    shiftStartedAt: todayAt(9, 45),
    shiftEndedAt: null,
    warehouse: 'Kertajaya',
  },
  {
    id: 'rdr-019',
    name: 'Andi Saputra',
    cartId: 'GRB-019',
    phone: '0857-9900-1122',
    status: 'active',
    lastLocationLabel: 'Gubeng',
    position: { lat: -7.2853, lng: 112.7512 },
    lastUpdateAt: secondsAgo(6),
    shiftStartedAt: todayAt(10, 15),
    shiftEndedAt: null,
    warehouse: 'Kertajaya',
  },
  {
    id: 'rdr-021',
    name: 'Rudi Hartono',
    cartId: 'GRB-021',
    phone: '0821-3344-5566',
    status: 'active',
    lastLocationLabel: 'Klampis Ngasem',
    position: { lat: -7.2905, lng: 112.7801 },
    lastUpdateAt: secondsAgo(12),
    shiftStartedAt: todayAt(9, 30),
    shiftEndedAt: null,
    warehouse: 'Kertajaya',
  },
  {
    id: 'rdr-015',
    name: 'Joko Prasetyo',
    cartId: 'GRB-015',
    phone: '0819-7766-5544',
    status: 'active',
    lastLocationLabel: 'Jl. Dharmahusada',
    position: { lat: -7.2688, lng: 112.7699 },
    lastUpdateAt: secondsAgo(9),
    shiftStartedAt: todayAt(10, 40),
    shiftEndedAt: null,
    warehouse: 'Kertajaya',
  },
  {
    id: 'rdr-023',
    name: 'Dedi Kurniawan',
    cartId: 'GRB-023',
    phone: '0838-1122-3344',
    status: 'active',
    lastLocationLabel: 'Mulyorejo',
    position: { lat: -7.2662, lng: 112.7884 },
    lastUpdateAt: secondsAgo(15),
    shiftStartedAt: todayAt(11, 0),
    shiftEndedAt: null,
    warehouse: 'Kertajaya',
  },
  {
    id: 'rdr-004',
    name: 'Wati Lestari',
    cartId: 'GRB-004',
    phone: '0856-1234-5566',
    status: 'inactive',
    lastLocationLabel: 'Jl. Dharmahusada Indah',
    position: { lat: -7.2721, lng: 112.7826 },
    lastUpdateAt: todayAt(13, 40),
    shiftStartedAt: null,
    shiftEndedAt: todayAt(13, 40),
    warehouse: 'Kertajaya',
  },
  {
    id: 'rdr-009',
    name: 'Nina Kartika',
    cartId: 'GRB-009',
    phone: '0878-5544-3322',
    status: 'inactive',
    lastLocationLabel: null,
    position: null,
    lastUpdateAt: null,
    shiftStartedAt: null,
    shiftEndedAt: null,
    warehouse: 'Kertajaya',
  },
];
