# Sipaling NasPad — Aplikasi Customer

Aplikasi pelanggan (Android/iOS, bisa dicoba di browser) dibuat dengan **React Native + Expo SDK 57 + TypeScript**, font **Plus Jakarta Sans**, mengikuti desain Figma.

## Cara menjalankan

```bash
npm install
npx expo start --web     # coba di Chrome (paling gampang)
# atau
npx expo start           # scan QR pakai aplikasi Expo Go di HP (laptop & HP satu WiFi)
```

## Akun demo (tanpa backend)

| | |
|---|---|
| Nomor WhatsApp | `81234567890` (atau `081234567890`) |
| Password | `naspad2026` |
| Kode OTP daftar | `123456` |

Coba alurnya:
1. Pilih **Gerobak #012** → Lihat menu → tambah menu → Lihat keranjang.
2. Pilih **Pick Up** atau **Call Riders** (Call Riders wajib isi alamat, min. Rp25.000).
3. Setelah ±5 detik rider menerima → tekan **Pesan via WA** (di mode demo pembayaran langsung dianggap terkirim).
4. Status berjalan sendiri: cek pembayaran → dibuat → diantar → selesai (+1 poin).
5. Pesan dari **Gerobak #025** untuk melihat contoh **pesanan ditolak** (alasan: stok habis).

## Halaman

| Halaman | File |
|---|---|
| Splash | `src/screens/SplashScreen.tsx` |
| Masuk / Daftar (OTP WhatsApp) | `LoginScreen.tsx`, `RegisterScreen.tsx` |
| Beranda: poin, peta, gerobak terdekat | `HomeScreen.tsx` |
| Detail Menu + keranjang | `MenuScreen.tsx` |
| Checkout Pick Up / Call Riders | `CheckoutScreen.tsx` |
| Lacak pesanan + pop-up sukses | `TrackScreen.tsx` |
| Riwayat | `HistoryScreen.tsx` |
| Akun, Ubah profil, Ubah password, Hapus akun, Keluar | `AccountScreen.tsx`, `EditProfileScreen.tsx`, `ChangePasswordScreen.tsx` |
| Cek Poin (kartu 10 stempel) | `PointsScreen.tsx` |

Peta: `src/components/map/` — di HP pakai `react-native-maps`, di browser tampil peta ilustrasi (file `.web.tsx`).

## Sambung ke backend

Salin `.env.example` jadi `.env`, isi `EXPO_PUBLIC_API_URL`, lalu jalankan ulang `npx expo start -c`.
Daftar endpoint untuk teman backend ada di **API.md**.

## Catatan
- "Ingat perangkat ini" baru tampilan; perlu refresh token dari backend supaya benar-benar tersimpan.
- Status pesanan dicek tiap 4 detik. Nanti bisa diganti push notification (FCM) sesuai SDD.
- Nomor CS WhatsApp (`6281100000000`) masih contoh, ganti di `LoginScreen.tsx` dan `AccountScreen.tsx`.
