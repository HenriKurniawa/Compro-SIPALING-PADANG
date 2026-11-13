# Sipaling NasPad — Aplikasi Rider (front end)

Aplikasi mobile untuk Rider gerobak Sipaling NasPad, dibuat dengan **React Native + Expo SDK 57** dan **TypeScript**, sesuai SDD (Tabel 8.2).
Desain mengikuti Figma: warna maroon/oranye/krem dan font **Plus Jakarta Sans**.

## Cara menjalankan

1. Pasang **Node.js 20 atau 22 (LTS)**.
2. Di HP, pasang aplikasi **Expo Go** (Play Store / App Store).
3. Di folder ini jalankan:
   ```bash
   npm install
   npx expo start
   ```
4. Scan QR code yang muncul di terminal pakai Expo Go (Android) atau aplikasi Kamera (iPhone).
   HP dan laptop harus di jaringan Wi-Fi yang sama. Kalau tidak bisa, coba `npx expo start --tunnel`.

### Menjalankan di laptop (Chrome)

Kalau belum mau pakai HP, jalankan `npx expo start` lalu tekan **w** di terminal, atau langsung `npx expo start --web`. Aplikasi terbuka di browser seukuran layar HP.
Di mode web, peta diganti gambar pengganti (peta asli hanya tampil di aplikasi HP), dan lokasi memakai izin lokasi browser.

**Akun demo** (mode data contoh): nomor `081234567890` atau username `budi.grb012`, password `naspad2026`.

## Mode data contoh vs backend asli

Tanpa pengaturan apa pun, aplikasi memakai **data contoh** (`src/api/mockApi.ts`), jadi semua layar bisa dicoba tanpa server.

Untuk menyambung ke backend:
1. Salin `.env.example` menjadi `.env`.
2. Isi `EXPO_PUBLIC_API_URL` dengan alamat server, misalnya `https://api.sipaling.id`.
3. Jalankan ulang `npx expo start -c`.

Semua endpoint yang dipanggil aplikasi ada di **[API.md](./API.md)**. Dokumen ini untuk tim backend.

## Fitur & use case (SDD)

| Layar | Use case | Isi |
|---|---|---|
| Login | UC-03, UC-04 | Nomor HP / username + password, tanpa registrasi publik |
| Pesanan Online | UC-15, UC-17, UC-20 | Mulai/berhenti bekerja (kirim GPS tiap 10 detik), popup permintaan baru, terima / tolak + alasan, tab Baru · Diproses · Diantar, verifikasi pembayaran |
| Antar Pesanan | UC-18, UC-19 | Peta ke customer, chat/telepon, buka Google Maps, konfirmasi pesanan diterima |
| Pesanan Offline | UC-16, UC-34 | Keranjang menu, kaitkan nomor member (loyalitas), bayar QRIS / tunai (hitung kembalian) |
| Stok Gerobak | UC-35 | Konfirmasi kiriman stok dari gudang, ubah sisa stok per menu |
| Riwayat & Setoran | UC-21, UC-22 | Filter Hari ini / Kemarin / 7 hari / Pilih tanggal, tab Semua · Online · Offline, total tunai & QRIS |
| Menu samping | UC-04 | Navigasi antarhalaman + keluar akun |

Alur status pesanan online (SDD): `baru → menunggu_bayar → verifikasi → diproses → diantar → selesai` (pick up melewati `diantar`), atau `baru → ditolak`.

## Struktur folder

```
App.tsx                  navigasi + font
src/
  api/                   semua pemanggilan data
    client.ts            fetch + token + alamat server
    httpApi.ts           endpoint backend asli (+ WebSocket lokasi)
    mockApi.ts           data contoh
    types.ts             daftar fungsi API
  components/            komponen UI (tombol, popup, header, kartu pesanan)
  context/               sesi login & status kerja
  hooks/                 kirim lokasi GPS
  screens/               layar-layar aplikasi
  theme.ts               warna & font
  types.ts               model data
assets/                  logo & foto menu contoh
```

## Belum dikerjakan / perlu keputusan

- **Push notification (FCM)** untuk permintaan pesanan saat aplikasi tertutup. Perlu `expo-notifications`, akun Firebase, dan development build. Untuk sementara, daftar pesanan diambil ulang tiap 8 detik saat aplikasi terbuka.
- **Lokasi di latar belakang** (SDD 8.2: foreground service "Sedang bekerja"). Perlu `expo-task-manager` + izin lokasi *Always* dan development build. Saat ini lokasi hanya terkirim selama aplikasi terbuka.
- **Format pesan WebSocket** lokasi: aplikasi mengirim `{ "type": "location", lat, lng, recordedAt }` ke `/ws/tracking?token=…`. Sesuaikan dengan server NestJS (WebSocket biasa atau Socket.IO).
- **Pakai bonus loyalitas (UC-31)** saat transaksi offline: aplikasi sudah menampilkan apakah member punya bonus, tapi cara memotong harganya perlu diputuskan tim.
- **Google Maps API key** wajib diisi sebelum build untuk Play Store / App Store (tidak perlu di Expo Go). Lihat dokumentasi `react-native-maps`.
- **Foto menu** di `assets/menu` hanya contoh beresolusi rendah. Di backend asli, foto diambil dari `imageUrl`.
