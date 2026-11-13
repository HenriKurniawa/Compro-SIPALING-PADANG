# Kontrak API — Aplikasi Rider Sipaling NasPad

Dokumen ini untuk tim backend (NestJS). Front end memanggil semua endpoint di bawah lewat `src/api/httpApi.ts`.
Bentuk data mengikuti `src/types.ts`. Kalau backend memakai nama/format lain, cukup sesuaikan di `httpApi.ts`; layar-layarnya tidak perlu diubah.

- **Base URL**: diisi di `.env` → `EXPO_PUBLIC_API_URL=https://alamat-server`
- **Auth**: JWT. Setelah login, setiap request mengirim `Authorization: Bearer <token>`.
- **Format**: JSON. Uang dalam Rupiah (integer). Waktu dalam ISO 8601 (`2026-10-30T12:52:00+07:00`).
- **Error**: status 4xx/5xx dengan body `{ "message": "Pesan yang bisa dibaca rider" }` (atau `message: string[]` bawaan NestJS). Pesan ini langsung ditampilkan di aplikasi.

## Auth (UC-03, UC-04)

| Method | Path | Body | Respon |
|---|---|---|---|
| POST | `/auth/login` | `{ identifier, password, role: "rider" }` (identifier = nomor HP atau username) | `{ token, rider: Rider }` |
| POST | `/auth/logout` | – | `204` (sekaligus set rider tidak bekerja) |

## Status kerja & lokasi (UC-15)

| Method | Path | Body | Respon |
|---|---|---|---|
| PATCH | `/riders/me/status` | `{ isWorking: boolean }` | `Rider` |
| WebSocket | `/ws/tracking?token=<jwt>` | kirim `{ "type": "location", lat, lng, recordedAt }` | – |

Posisi dikirim ±10 detik sekali selama rider berstatus bekerja. Kalau server memakai Socket.IO, ganti bagian WebSocket di `httpApi.ts`.

## Pesanan online (UC-17 s.d. UC-20)

| Method | Path | Body | Respon |
|---|---|---|---|
| GET | `/riders/me/orders?status=baru,menunggu_bayar,verifikasi,diproses,diantar` | – | `Order[]` |
| POST | `/orders/:id/accept` | – | `Order` → `menunggu_bayar` (customer dapat link chatbot WhatsApp untuk bayar) |
| POST | `/orders/:id/reject` | `{ reason, note? }` | `204` → `ditolak` (alasan diteruskan ke customer) |
| POST | `/orders/:id/verify-payment` | – | `Order` → `diproses` (UC-20, verifikasi manual oleh rider) |
| POST | `/orders/:id/deliver` | – | `Order` → `diantar` (UC-18) |
| POST | `/orders/:id/complete` | – | `Order` → `selesai` (UC-19), otomatis masuk riwayat transaksi online |

Alur status (SDD 2.1 "Urutan pemesanan"):

```
baru ──terima──> menunggu_bayar ──(customer bayar + konfirmasi via chatbot WA)──> verifikasi
  │                                                                                  │
  └──tolak──> ditolak                                           rider cek pembayaran ┘
                                                                         ↓
                                       diproses ──antar──> diantar ──> selesai
                                           └──(pick up) sudah diambil──> selesai
```

Customer sudah memilih menu sejak membuat pesanan, jadi `items` selalu terisi. Setelah customer konfirmasi bayar di chatbot, backend mengisi `paymentMethod` lalu mengubah status ke `verifikasi`. Status ini sama dengan yang dibaca aplikasi Customer (`GET /orders/:id`).
`reason` salah satu dari: `Stok menu habis`, `Lokasi terlalu jauh`, `Sedang ramai pembeli`, `Lainnya`.
Aplikasi mengambil ulang daftar pesanan tiap 8 detik selama layar Pesanan Online terbuka. Push notification (FCM) belum dipasang.

## Pesanan offline (UC-16, UC-34)

| Method | Path | Body | Respon |
|---|---|---|---|
| GET | `/riders/me/menu` | – | `MenuItem[]` (stok = sisa porsi di gerobak) |
| GET | `/members/:phone` | – | `Member` atau `404` bila bukan member |
| POST | `/riders/me/qris` | `{ total }` | `{ payload }` (isi QRIS yang ditampilkan sebagai kode QR) |
| POST | `/riders/me/transactions` | `{ items: [{ menuId, qty }], method: "qris" \| "tunai", cashReceived?, memberPhone? }` | `Transaction` |

Sesuai SDD, **stok tidak dikurangi otomatis** oleh transaksi. Kalau `memberPhone` diisi, transaksi menambah hitungan loyalitas member.

## Stok gerobak (UC-35)

| Method | Path | Body | Respon |
|---|---|---|---|
| GET | `/riders/me/allocations` | – | `StockAllocation[]` (kiriman dari gudang, UC-09) |
| POST | `/riders/me/allocations/:id/confirm` | – | `StockAllocation` → `dikonfirmasi` (stok gerobak bertambah) |
| PUT | `/riders/me/stock` | `{ stocks: [{ menuId, stock }] }` | `MenuItem[]` |

## Riwayat & setoran (UC-21, UC-22)

| Method | Path | Respon |
|---|---|---|
| GET | `/riders/me/transactions?from=2026-10-26&to=2026-10-30&source=online` | `Transaction[]`, urut terbaru |

`source` opsional (`online` / `offline`). Total, tunai, QRIS, dan jumlah transaksi dihitung di aplikasi.

## Contoh objek

```json
{
  "id": "ORD-0231",
  "customerName": "Dinda Putri",
  "customerPhone": "6281298765432",
  "type": "antar",
  "status": "verifikasi",
  "createdAt": "2026-10-30T12:41:00+07:00",
  "distanceKm": 0.8,
  "address": "Jl. Ketintang Baru II No. 14",
  "note": "Pagar hijau",
  "location": { "lat": -7.3195, "lng": 112.733 },
  "paymentMethod": "qris",
  "items": [{ "menuId": "rendang", "name": "Rendang Sapi", "qty": 2, "price": 18000 }]
}
```
