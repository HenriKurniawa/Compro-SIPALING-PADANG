const todayDateStr = new Date().toISOString().slice(0, 10);
const yesterdayDateStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

export const MENUS = [
  { name: 'Nasi Putih', price: 5000 },
  { name: 'Ayam Pop', price: 15000 },
  { name: 'Rendang Sapi', price: 18000 },
  { name: 'Telur Balado', price: 8000 },
];

export const ADMINS = [
  { id: 'a1', name: 'Admin Kertajaya', warehouse: 'Kertajaya', activated: true, username: 'admin', password: 'password' },
  { id: 'a2', name: 'Admin Darmo', warehouse: 'Darmo', activated: false },
];

export const RIDERS = [
  { id: 'R-012', name: 'Budi Santoso', gerobak: 'G-012', phone: '0812 1111 0012', status: 'Aktif' },
  { id: 'R-008', name: 'Sari Wulandari', gerobak: 'G-008', phone: '0812 1111 0008', status: 'Aktif' },
  { id: 'R-005', name: 'Agus Pratama', gerobak: 'G-005', phone: '0812 1111 0005', status: 'Aktif' },
  { id: 'R-019', name: 'Lina Marlina', gerobak: 'G-019', phone: '0812 1111 0019', status: 'Aktif' },
];

export const STOCK_IN = [
  {
    id: 'IN-001-TODAY',
    date: todayDateStr,
    time: '06:30',
    by: 'Admin Kertajaya',
    items: [
      { menu: 'Nasi Putih', qty: 500, note: 'Batch pagi dapur pusat' },
      { menu: 'Ayam Pop', qty: 300, note: 'Kondisi hangat & fresh' },
      { menu: 'Rendang Sapi', qty: 250, note: 'Porsi standar kemasan' },
      { menu: 'Telur Balado', qty: 200, note: 'Batch pagi' },
    ],
  },
  {
    id: 'IN-002-YEST',
    date: yesterdayDateStr,
    time: '15:30',
    by: 'Admin Kertajaya',
    items: [
      { menu: 'Rendang Sapi', qty: 260, note: 'Porsi standar kemasan' },
      { menu: 'Telur Balado', qty: 180, note: 'Batch sore' },
    ],
  },
];

export const STOCK_OUT = [
  {
    id: 'OUT-001',
    date: todayDateStr,
    riderId: 'R-012',
    gerobak: 'G-012',
    status: 'Berjalan',
    items: [
      { menu: 'Nasi Putih', qty: 40 },
      { menu: 'Ayam Pop', qty: 20 },
      { menu: 'Rendang Sapi', qty: 10 },
    ],
  },
  {
    id: 'OUT-002',
    date: todayDateStr,
    riderId: 'R-008',
    gerobak: 'G-008',
    status: 'Berjalan',
    items: [
      { menu: 'Nasi Putih', qty: 40 },
      { menu: 'Ayam Pop', qty: 20 },
    ],
  },
  {
    id: 'OUT-003',
    date: todayDateStr,
    riderId: 'R-005',
    gerobak: 'G-005',
    status: 'Berjalan',
    items: [
      { menu: 'Nasi Putih', qty: 35 },
      { menu: 'Telur Balado', qty: 25 },
      { menu: 'Rendang Sapi', qty: 15 },
    ],
  },
  {
    id: 'OUT-004',
    date: todayDateStr,
    riderId: 'R-019',
    gerobak: 'G-019',
    status: 'Berjalan',
    items: [
      { menu: 'Nasi Putih', qty: 45 },
      { menu: 'Ayam Pop', qty: 20 },
      { menu: 'Telur Balado', qty: 15 },
    ],
  },
  {
    id: 'OUT-005',
    date: yesterdayDateStr,
    riderId: 'R-012',
    gerobak: 'G-012',
    status: 'Selesai',
    items: [
      { menu: 'Nasi Putih', qty: 40 },
      { menu: 'Rendang Sapi', qty: 20 },
    ],
  },
];

export const PURCHASES = [
  {
    id: 'PB-001',
    riderId: 'R-012',
    date: todayDateStr,
    items: [
      { menu: 'Nasi Putih', qty: 35, price: 5000 },
      { menu: 'Ayam Pop', qty: 18, price: 15000 },
      { menu: 'Rendang Sapi', qty: 9, price: 18000 },
    ],
  },
  {
    id: 'PB-002',
    riderId: 'R-008',
    date: todayDateStr,
    items: [
      { menu: 'Nasi Putih', qty: 38, price: 5000 },
      { menu: 'Ayam Pop', qty: 18, price: 15000 },
    ],
  },
  {
    id: 'PB-003',
    riderId: 'R-005',
    date: todayDateStr,
    items: [
      { menu: 'Nasi Putih', qty: 30, price: 5000 },
      { menu: 'Telur Balado', qty: 22, price: 8000 },
      { menu: 'Rendang Sapi', qty: 14, price: 18000 },
    ],
  },
  {
    id: 'PB-004',
    riderId: 'R-019',
    date: todayDateStr,
    items: [
      { menu: 'Nasi Putih', qty: 40, price: 5000 },
      { menu: 'Ayam Pop', qty: 18, price: 15000 },
      { menu: 'Telur Balado', qty: 14, price: 8000 },
    ],
  },
  {
    id: 'PB-005',
    riderId: 'R-012',
    date: yesterdayDateStr,
    items: [
      { menu: 'Nasi Putih', qty: 38, price: 5000 },
      { menu: 'Rendang Sapi', qty: 19, price: 18000 },
    ],
  },
];
