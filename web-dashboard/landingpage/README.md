# Sipaling NasPad — Landing Page

Halaman publik yang terbuka saat pelanggan menempelkan HP ke **tag NFC** atau scan **QR code** di gerobak (SDD UC-32, UC-33, UC-23, UC-01, UC-02).
Dibuat dengan **React + Vite + TypeScript**, font **Plus Jakarta Sans**, mengikuti desain Figma.

## Cara menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya **http://localhost:5173**).
Coba juga **http://localhost:5173/?gerobak=GRB-012** untuk melihat tampilan saat dibuka dari NFC gerobak #012.

Untuk versi siap online: `npm run build` → hasilnya di folder `dist/` (disajikan oleh Nginx sesuai SDD).

## Isi halaman

| Bagian | Isi |
|---|---|
| Header | Logo, menu Kenali Sipaling · Cara daftar · Menu Sipaling · Tanya jawab, tombol Masuk |
| Hero | Judul, badge gerobak dari NFC (`?gerobak=`), tombol Daftar Gratis & Dapat Poin |
| Fitur | Lacak gerobak, cek stok, pesan via WhatsApp, panggil gerobak |
| Promo | Carousel: daftar dapat 1 poin, 10 transaksi gratis 1 paket |
| Cara daftar | 3 langkah |
| Menu Sipaling | Daftar menu & harga (UC-23, tambahan sesuai SDD karena ada di menu navigasi) |
| Daftar akun | Nama + nomor WhatsApp → kode OTP → buat password → berhasil + unduh aplikasi |
| Tanya jawab | Accordion 4 pertanyaan |
| Unduh | Tombol App Store / Google Play + QR unduhan |
| Footer | Kontak WhatsApp, media sosial, kebijakan privasi |

## Data contoh vs backend

Tanpa `.env`, halaman memakai data contoh. **Kode OTP demo: `123456`**.
Untuk backend asli, salin `.env.example` ke `.env` dan isi `VITE_API_URL`. Endpoint yang dipanggil:

| Method | Path | Body | Respon |
|---|---|---|---|
| GET | `/public/carts/:id` | – | `{ id, riderName }` |
| GET | `/public/menu` | – | `[{ id, name, price, imageUrl }]` |
| POST | `/auth/register/request-otp` | `{ name, phone, cartId? }` (phone `62812…`) | `204` (OTP dikirim via WhatsApp) |
| POST | `/auth/register/verify-otp` | `{ phone, code }` | `{ registrationToken }` |
| POST | `/auth/register/complete` | `{ registrationToken, password }` | `201` |

Error: kirim `{ "message": "..." }`, pesannya langsung ditampilkan di form.

## Yang perlu diganti sebelum rilis

- Foto menu di `public/menu/` masih contoh beresolusi rendah.
- Tautan App Store, Google Play, WhatsApp, dan media sosial (`.env` dan `src/App.tsx`).
- Halaman Kebijakan Privasi & Syarat Ketentuan belum dibuat.
