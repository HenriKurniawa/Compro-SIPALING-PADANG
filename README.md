# Compro-SIPALING-PADANG (SiPaling Naspad)

Repository untuk proyek **SiPaling Naspad** yang mencakup aplikasi untuk berbagai peran pengguna (Customer, Rider, Korlap, Admin Gudang), backend, serta dokumentasi arsitektur dan sistem.

---

## 📁 Struktur Direktori

```text
Compro-SIPALING-PADANG/
├── AdminGudang/                  # Aplikasi frontend untuk Admin Gudang
│   └── frontend/
├── Customer/                     # Aplikasi frontend untuk Customer
│   └── frontend/
├── Korlap/                       # Aplikasi frontend untuk Koordinator Lapangan (Korlap)
│   └── frontend/
├── Rider/                        # Aplikasi frontend untuk Rider (Penjual Gerobak)
│   └── frontend/
├── backend/                      # API & backend service
├── docs/                         # Dokumentasi teknis, API, dan arsitektur
│   ├── api/
│   ├── architecture/
│   ├── data/
│   ├── decisions/
│   ├── requirements/
│   └── CONTRIBUTING.md
├── frontend/                     # Placeholder / core frontend
└── README.md
```

## 🎯 Tujuan Proyek
- Satu tempat terpusat untuk kode frontend per-role, backend, dan dokumentasi sistem.
- Kolaborasi terstruktur dan pembagian tugas melalui GitHub Issues.
- Peninjauan kualitas kode melalui Pull Request (PR) review.

## 👥 Role Operasional
1. **Admin Gudang**: Pengelolaan stok, bahan baku, pencatatan barang keluar dari dapur pusat ke gerobak.
2. **Customer**: Antarmuka pemesanan, melihat menu, tracking pesanan/lokasi jualan (jika masuk ruang lingkup).
3. **Korlap (Koordinator Lapangan)**: Pemeriksaan kesiapan operasional gerobak, supervisi wilayah, dan koordinasi rider.
4. **Rider**: Operasional harian gerobak, pencatatan penjualan dan sisa barang, rekap/setoran harian.
5. **Backend**: Sentralisasi layanan API, autentikasi role, database, dan logika bisnis.

## 📊 Status Keputusan Teknis
| Area | Status |
|---|---|
| Frontend framework | Belum diputuskan |
| Backend framework | Belum diputuskan |
| Database | Belum diputuskan |
| Autentikasi dan role | Perlu dikonfirmasi |
| GPS / lokasi gerobak | Perlu dikonfirmasi |
| NFC | Perlu dikonfirmasi |
| Pemesanan online dan alur penerima pesanan | Perlu dikonfirmasi |
| Pembayaran / QRIS / payment gateway | Perlu dikonfirmasi |
| WhatsApp, Radius Call, promo, reward | Perlu dikonfirmasi |
| Android/iOS vs web | Perlu dikonfirmasi |
| Target performa, concurrency, uptime | Belum ditetapkan |

## 🚀 Kandidat Modul Awal
1. Data wilayah dan dapur pusat.
2. Data gerobak dan penugasan rider.
3. Pencatatan barang keluar dari dapur ke gerobak.
4. Pemeriksaan kesiapan sebelum keberangkatan oleh Korlap.
5. Penetapan lokasi jualan dan jadwal operasional.
6. Pencatatan jumlah terjual dan sisa barang.
7. Pencatatan setoran / rekap akhir hari.
8. Tampilan lokasi gerobak jika mekanisme GPS disepakati.

## 🌿 Aturan Branch
- `main`: Versi stabil; jangan commit langsung.
- `develop`: Integrasi fitur yang sedang dikerjakan.
- Branch fitur dibuat dari `develop`, lalu PR diarahkan ke `develop`.
- Minta review minimal satu anggota tim sebelum merge.
- Merge `develop` ke `main` saat rilis siap diperiksa / didemokan.
- **Penting**: Jangan commit `.env`, token, password, private key, atau data operasional/pribadi asli. Gunakan data dummy untuk pengembangan dan pengujian.

Contoh penamaan branch:
- `feature/frontend-login`
- `feature/backend-auth`
- `feature/admin-inventory-record`
- `fix/backend-validation`
- `docs/update-api-contract`

## 🔄 Alur Kerja (Workflow)
1. Buat / ambil Issue dengan scope dan kriteria penerimaan yang jelas.
2. Buat branch baru dari `develop`.
3. Implementasikan dan uji perubahan secara lokal.
4. Buka Pull Request (PR), tautkan Issue dengan kata kunci `Closes #<nomor>`.
5. Minta review rekan tim, diskusikan masukan, lalu merge setelah disetujui.

## ⚙️ Setup Lokal
*Akan diperbarui setelah stack teknologi (frontend/backend/database) diputuskan oleh tim dan mitra.*

## ✅ Definition of Done
- Kriteria penerimaan terpenuhi.
- Pengujian relevan dijalankan dan hasilnya dicatat.
- Dokumentasi diperbarui bila API/data/setup berubah.
- Tidak ada secret, credential, atau data pribadi di dalam commit.
- PR sudah direview dan di-merge ke branch yang dituju.
