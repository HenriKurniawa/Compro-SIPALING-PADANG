# SiPaling Naspad

Starter repository untuk tim Frontend dan Backend. Teknologi dan fitur yang belum dikonfirmasi mitra berstatus **TBD / perlu konfirmasi**, bukan keputusan final.

## Tujuan
- Satu tempat untuk kode frontend, backend, dan dokumentasi.
- Pembagian tugas melalui GitHub Issues.
- Review perubahan melalui Pull Request.

## Struktur
```text
sipaling-naspad/
├── frontend/                 # Aplikasi frontend; framework TBD
├── backend/                  # API/backend; framework TBD
├── docs/
│   ├── requirements/
│   ├── architecture/
│   ├── api/
│   ├── data/
│   └── decisions/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── .gitignore
└── README.md
```
Folder `frontend/` dan `backend/` berisi placeholder README sampai teknologi dipilih.

## Status keputusan
| Area | Status |
|---|---|
| Frontend framework | Belum diputuskan |
| Backend framework | Belum diputuskan |
| Database | Belum diputuskan |
| Autentikasi dan role | Perlu dikonfirmasi |
| GPS/lokasi gerobak | Perlu dikonfirmasi |
| NFC | Perlu dikonfirmasi |
| Pemesanan online dan alur penerima pesanan | Perlu dikonfirmasi |
| Pembayaran/QRIS/payment gateway | Perlu dikonfirmasi |
| WhatsApp, Radius Call, promo, reward | Perlu dikonfirmasi |
| Android/iOS vs web | Perlu dikonfirmasi |
| Target performa, concurrency, uptime | Belum ditetapkan |

## Kandidat modul awal
Item berikut perlu divalidasi terhadap SRS dan mitra:
1. Data wilayah dan dapur pusat.
2. Data gerobak dan penugasan rider.
3. Pencatatan barang keluar dari dapur ke gerobak.
4. Pemeriksaan kesiapan sebelum keberangkatan oleh Korlap.
5. Penetapan lokasi jualan dan jadwal operasional.
6. Pencatatan jumlah terjual dan sisa barang.
7. Pencatatan setoran/rekap akhir hari.
8. Tampilan lokasi gerobak jika mekanisme GPS disepakati.

## Role operasional
Role yang telah dibahas: **Manajer Area, Korlap, Admin, Rider**. Customer menjadi aktor tambahan hanya jika fitur yang berhadapan langsung dengan pelanggan masuk ruang lingkup. Konfirmasi nama role dan hak akses sebelum membuat otorisasi.

## Aturan branch
- `main`: versi stabil; jangan commit langsung.
- `develop`: integrasi fitur yang sedang dikerjakan.
- Branch fitur dibuat dari `develop`, lalu PR diarahkan ke `develop`.
- Minta review minimal satu anggota tim sebelum merge.
- Merge `develop` ke `main` saat rilis siap diperiksa/didemokan.
- Jangan commit `.env`, token, password, private key, atau data operasional/pribadi asli.
- Gunakan data dummy untuk pengembangan dan pengujian.

Contoh branch: `feature/frontend-login`, `feature/backend-auth`, `feature/backend-inventory-record`, `fix/backend-validation`, `docs/update-api-contract`.

## Alur kerja
1. Buat/ambil Issue dengan scope dan kriteria penerimaan yang jelas.
2. Buat branch dari `develop`.
3. Implementasikan dan uji perubahan.
4. Buka PR, tautkan Issue dengan `Closes #<nomor>`.
5. Minta review, perbaiki komentar, lalu merge setelah disetujui.

## Setup lokal
Belum ditetapkan karena teknologi belum dipilih. Setelah stack diputuskan, tambahkan versi runtime, package manager, langkah instalasi, `.env.example`, cara menjalankan frontend/backend, perintah test, dan migrasi/seed database jika digunakan.

## Definition of Done
- Kriteria penerimaan terpenuhi.
- Pengujian relevan dijalankan dan hasilnya dicatat.
- Dokumentasi diperbarui bila API/data/setup berubah.
- Tidak ada secret atau data pribadi di commit.
- PR sudah direview dan di-merge.
