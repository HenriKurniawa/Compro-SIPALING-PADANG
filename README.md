# SiPaling Naspad — Integrated Mobile Cart Management Platform

**Computing Project | S1 Informatika — Universitas Telkom Surabaya | 2026**

SiPaling Naspad merupakan platform terintegrasi berbasis Web dan Mobile untuk memodernisasi operasional bisnis gerobak keliling Nasi Padang. Sistem mengintegrasikan teknologi NFC, QR Code, GPS Live Tracking, pemesanan digital melalui WhatsApp, manajemen inventori, pencatatan transaksi, dan program loyalitas pelanggan.

Platform ini dirancang untuk menghubungkan Customer, Rider, Admin Warehouse, dan Koordinator Lapangan (Korlap) dalam satu ekosistem operasional yang terintegrasi.

Repository: https://github.com/HenriKurniawa/Compro-SIPALING-PADANG

---

# 1. Project Information

## 1.1 Project Identity

| Informasi          | Keterangan                        |
| ------------------ | --------------------------------- |
| Project Name       | SiPaling Naspad                   |
| Project Type       | Computing Project                 |
| Project Category   | Web and Mobile Application        |
| Institution        | Universitas Telkom Surabaya       |
| Study Program      | S1 Informatika                    |
| Academic Year      | 2026                              |
| Document Reference | SRS Version 1.0 dan SDD           |
| Project Manager    | Henri Kurniawan Candra            |
| Supervisor         | Yasinta Romadhona, S.Kom., M.Kom. |

## 1.2 Project Team

| Nama                     | NIM        |
| ------------------------ | ---------- |
| Henri Kurniawan Candra   | 1203230086 |
| Muhamad Adnan            | 1203230031 |
| Jonathan Ferdinand Mayon | 1203230087 |
| Khansa Nailah Anjani     | 1203230038 |
| Nur Aulia Dinda Putri    | 1203230093 |
| Benedicta Eka Wijayanti  | 1203230059 |
| Fitria Nur Rofika        | 1203230097 |
| Zakaria Arrozi           | 1203230089 |

---

# 2. System Overview

## 2.1 Background

Operasional bisnis gerobak keliling Nasi Padang membutuhkan koordinasi antara pelanggan, penjaga gerobak, pengelola gudang, dan koordinator lapangan.

Proses pencarian gerobak, pemeriksaan stok, pemesanan, distribusi barang, pemantauan lokasi, serta pencatatan transaksi perlu terintegrasi agar operasional dapat dikelola secara lebih efektif.

SiPaling Naspad dikembangkan sebagai solusi digital yang mengintegrasikan proses tersebut melalui aplikasi mobile dan web dashboard.

## 2.2 System Objectives

Sistem memiliki tujuan utama:

1. Mempermudah Customer menemukan gerobak terdekat dan melihat ketersediaan menu.
2. Menyediakan fasilitas pemesanan makanan melalui aplikasi dan integrasi WhatsApp.
3. Memungkinkan Customer memanggil Rider dalam radius tertentu.
4. Memungkinkan Rider mengelola pesanan, stok, pembayaran, dan aktivitas operasional.
5. Mempermudah Admin Warehouse mengelola persediaan dan distribusi stok.
6. Memungkinkan Korlap memantau lokasi serta status operasional Rider.
7. Menyediakan pencatatan transaksi dan program loyalitas pelanggan.
8. Mengintegrasikan seluruh aktivitas melalui satu backend.

## 2.3 System Scope

Platform terdiri dari:

| Platform           | Fungsi                                                                  |
| ------------------ | ----------------------------------------------------------------------- |
| Web Landing Page   | Onboarding NFC/QR, informasi aplikasi, menu publik, registrasi Customer |
| Mobile Application | Aktivitas Customer dan Rider                                            |
| Web Dashboard      | Pengelolaan Warehouse dan pemantauan Korlap                             |
| Backend System     | Autentikasi, business logic, database, API, dan komunikasi real-time    |
| External Services  | WhatsApp, Firebase Cloud Messaging, dan layanan peta                    |

## 2.4 Operating Environment

Lingkungan operasional yang disebutkan dalam SRS:

- Android minimal versi 8.0 Oreo.
- iOS minimal versi 14.0.
- Web browser modern: Google Chrome, Mozilla Firefox, Safari, dan Microsoft Edge.
- Backend REST Service.
- Database PostgreSQL atau MongoDB sesuai pilihan arsitektur.
- Redis untuk caching GPS real-time.
- Cloud infrastructure AWS atau GCP.
- NFC Tag NTAG213/NTAG215.
- GPS smartphone Rider dan Customer.

---

# 3. Repository Structure

Repository menggunakan pendekatan monorepo. Seluruh aplikasi dan dokumentasi berada dalam satu repository GitHub, tetapi masing-masing aplikasi memiliki tanggung jawab dan konfigurasi sendiri.

```text
Compro-SIPALING-PADANG/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── services/
│   │
│   └── database/
│       ├── migrations/
│       └── seeders/
│
├── docs/
│   ├── requirements/
│   │   ├── SRS_Kelompok3_SipalingNaspad.pdf
│   │   ├── OPEN_QUESTIONS.md
│   │   └── TASK_BACKLOG.md
│   │
│   ├── api/
│   │   └── README.md
│   │
│   ├── architecture/
│   │   └── README.md
│   │
│   ├── data/
│   │   └── README.md
│   │
│   ├── decisions/
│   │   └── README.md
│   │
│   └── CONTRIBUTING.md
│
├── mobile-app/
│   ├── customer/
│   │   └── src/
│   │
│   └── rider/
│       └── src/
│
├── web-dashboard/
│   ├── landingpage/
│   │   └── src/
│   │
│   ├── korlap/
│   │   └── src/
│   │
│   └── admin-warehouse/
│       └── src/
│
└── README.md
```

Keterangan:

- `backend/`: Seluruh layanan backend dan pengelolaan database.
- `docs/`: Dokumentasi kebutuhan, arsitektur, API, data, dan keputusan teknis.
- `mobile-app/customer/`: Aplikasi mobile Customer.
- `mobile-app/rider/`: Aplikasi mobile Rider.
- `web-dashboard/landingpage/`: Website publik SiPaling Naspad.
- `web-dashboard/korlap/`: Dashboard Koordinator Lapangan.
- `web-dashboard/admin-warehouse/`: Dashboard Admin Warehouse.

Struktur di atas merupakan gambaran tanggung jawab direktori repository. Detail file di dalam setiap aplikasi mengikuti implementasi aktual.

---

# 4. User Roles and Access Management

Sistem memiliki beberapa jenis pengguna dengan hak akses yang berbeda.

## 4.1 Customer

Customer merupakan pelanggan yang menggunakan platform untuk mencari gerobak, melihat menu, dan melakukan pemesanan.

Hak akses dan fitur:

- Registrasi akun.
- Verifikasi nomor WhatsApp menggunakan OTP.
- Login dan logout.
- Melihat menu publik.
- Melihat gerobak aktif dalam radius 1,5 km.
- Melihat ketersediaan stok menu.
- Memilih Rider.
- Melakukan pemesanan Pick Up.
- Melakukan pemesanan Call Rider.
- Konfirmasi pesanan melalui WhatsApp.
- Melacak pesanan dan lokasi Rider.
- Melihat riwayat pesanan.
- Mengelola profil.
- Melihat progres loyalitas.
- Menggunakan reward.

## 4.2 Rider

Rider merupakan penjaga gerobak yang bertanggung jawab terhadap kegiatan penjualan dan operasional gerobak.

Hak akses dan fitur:

- Login dan logout.
- Memulai dan mengakhiri aktivitas kerja.
- Mengaktifkan GPS tracking.
- Mengirim koordinat GPS setiap 10 detik.
- Menerima atau menolak pesanan Customer.
- Memberikan alasan penolakan.
- Melihat detail pesanan.
- Memverifikasi pembayaran.
- Menyiapkan dan mengantarkan pesanan.
- Mencatat pesanan offline.
- Memilih pembayaran QRIS atau tunai.
- Mengelola stok gerobak.
- Mengonfirmasi alokasi stok dari Warehouse.
- Menghubungkan transaksi offline dengan akun member.
- Melihat riwayat pembelian.
- Melihat laporan setoran.

## 4.3 Admin Warehouse

Admin Warehouse bertanggung jawab terhadap pengelolaan persediaan dan distribusi produk.

Hak akses dan fitur:

- Mengelola data menu.
- Mencatat Stock-In.
- Mengalokasikan Stock-Out kepada Rider.
- Melihat riwayat stok masuk dan keluar.
- Melihat laporan setoran per Rider.
- Mendaftarkan akun Rider.

## 4.4 Koordinator Lapangan (Korlap)

Korlap bertanggung jawab terhadap pemantauan operasional Rider di lapangan.

Hak akses dan fitur:

- Melihat daftar Rider aktif.
- Melihat lokasi Rider pada peta.
- Memantau status operasional Rider.
- Memilih marker untuk melihat informasi Rider.

## 4.5 Regional Manager

Regional Manager tercantum dalam SRS sebagai pengguna yang melakukan pengawasan lintas wilayah.

Fungsi yang disebutkan dalam SRS:

- Memantau aktivitas Admin Warehouse dan Korlap.
- Melihat laporan stok dan penjualan.
- Melakukan audit operasional lintas region.
- Mengunduh laporan performa dan keuangan lintas wilayah.

**Scope note:** SDD rilis pertama menggunakan empat role manusia: Customer, Rider, Warehouse Admin, dan Korlap. Regional Manager masih menjadi perbedaan ruang lingkup antara SRS dan SDD dan belum boleh dianggap sebagai fitur rilis pertama yang sudah disepakati.

## 4.6 Role Access Matrix

Ringkasan hak akses berdasarkan matriks SRS:

| Fitur                           | Customer     | Warehouse            | Korlap | Rider          | Regional Manager |
| ------------------------------- | ------------ | -------------------- | ------ | -------------- | ---------------- |
| Manajemen profil                | CRUD (Own)   | Read                 | Read   | Read           | Read             |
| Stock-In                        | None         | CRUD                 | Read   | None           | Read             |
| Stock-Out                       | None         | Create, Read, Update | Read   | Read           | Read             |
| Pembagian rute                  | None         | None                 | CRUD   | Read           | Read             |
| Broadcast GPS                   | Read         | None                 | Read   | Create, Update | Read             |
| Update stok gerobak             | Read         | Read                 | Read   | Update         | Read             |
| Order WA dan Radius Summoning   | Create, Read | None                 | None   | Read, Update   | Read             |
| Input transaksi dan poin reward | Read (Own)   | None                 | None   | Create, Read   | Read             |
| Audit laporan lintas region     | None         | None                 | None   | None           | Read, Export     |

Matriks ini mengikuti SRS. Implementasi permission final harus disesuaikan dengan scope role yang disepakati dalam SDD.

---

# 5. Functional Requirements

## 5.1 Authentication and Account Management

| ID         | Requirement               | Description                                                          |
| ---------- | ------------------------- | -------------------------------------------------------------------- |
| FR-AUTH-01 | Registrasi Akun           | Pengguna dapat mendaftar menggunakan nomor WhatsApp dan nama lengkap |
| FR-AUTH-02 | Verifikasi OTP            | Sistem memverifikasi nomor WhatsApp menggunakan OTP                  |
| FR-AUTH-03 | Multi-Role Authentication | Sistem mendukung autentikasi berdasarkan role                        |

Rancangan SDD menambahkan password pada proses registrasi Customer, hashing Bcrypt, verifikasi OTP, serta JWT untuk autentikasi.

## 5.2 Web Requirements

| ID        | Requirement        | Description                                                    |
| --------- | ------------------ | -------------------------------------------------------------- |
| FR-WEB-01 | NFC Tag Redirect   | NFC mengarahkan browser Customer ke landing page               |
| FR-WEB-02 | Promotional Banner | Landing page menampilkan promosi fitur aplikasi                |
| FR-WEB-03 | Registration Form  | Landing page menyediakan formulir registrasi                   |
| FR-WEB-04 | Deep-Link Download | Customer diarahkan untuk mengunduh aplikasi setelah registrasi |
| FR-WEB-05 | Admin Portal       | Web portal menyediakan login untuk role Admin                  |

## 5.3 Warehouse Requirements

| ID        | Requirement | Description                                               |
| --------- | ----------- | --------------------------------------------------------- |
| FR-WHS-01 | Stock-In    | Warehouse dapat mencatat barang masuk ke gudang           |
| FR-WHS-02 | Stock-Out   | Warehouse dapat mencatat distribusi stok ke gerobak Rider |

## 5.4 Korlap Requirements

| ID        | Requirement         | Description                                                          |
| --------- | ------------------- | -------------------------------------------------------------------- |
| FR-KRP-01 | Route Division      | Korlap dapat membagi dan menetapkan rute operasional harian Rider    |
| FR-KRP-02 | Live GPS Monitoring | Korlap dapat memantau lokasi GPS Rider aktif melalui peta interaktif |

## 5.5 Rider Requirements

| ID        | Requirement           | Description                                                     |
| --------- | --------------------- | --------------------------------------------------------------- |
| FR-RDR-01 | GPS Broadcasting      | Rider mengirim koordinat GPS secara periodik selama operasional |
| FR-RDR-02 | Cart Stock Management | Rider dapat melihat dan memperbarui sisa stok gerobak           |

## 5.6 Ordering Requirements

| ID        | Requirement             | Description                                                                |
| --------- | ----------------------- | -------------------------------------------------------------------------- |
| FR-ORD-01 | Cart Tracking and Stock | Customer dapat melihat gerobak terdekat dan stok menu                      |
| FR-ORD-02 | WhatsApp Ordering       | Customer diarahkan ke WhatsApp dengan pesan pemesanan yang sudah disiapkan |
| FR-SMM-01 | Radius Summoning        | Customer dapat memanggil gerobak dalam radius maksimal 1,5 km              |

## 5.7 Loyalty Requirements

| ID        | Requirement        | Description                                                        |
| --------- | ------------------ | ------------------------------------------------------------------ |
| FR-POI-01 | Purchase Recording | Rider dapat mencari akun Customer dan mencatat kuantitas pembelian |
| FR-POI-02 | Reward Calculation | Sistem menghitung dan memberikan reward secara otomatis            |

## 5.8 Regional Manager Requirements

| ID        | Requirement             | Description                                                                  |
| --------- | ----------------------- | ---------------------------------------------------------------------------- |
| FR-MGR-01 | Multi-Region Monitoring | Regional Manager dapat memantau aktivitas Admin Warehouse dan Korlap         |
| FR-MGR-02 | Audit Report Export     | Regional Manager dapat mengekspor laporan penjualan, stok, dan performa rute |

---

# 6. Business Process and System Workflows

## 6.1 NFC/QR Customer Onboarding

1. Customer melakukan tap NFC atau scan QR Code pada gerobak.
2. Browser membuka landing page SiPaling Naspad.
3. Customer dapat melihat informasi dan menu publik.
4. Customer mengisi nama, nomor WhatsApp, password, dan persetujuan kebijakan privasi.
5. Sistem mengirim OTP melalui WhatsApp.
6. Customer melakukan verifikasi OTP.
7. Akun diaktifkan.
8. Sistem memberikan tautan unduh aplikasi.

NFC/QR menyimpan URL tetap menuju landing page dan tidak membutuhkan pembacaan NFC khusus di backend.

## 6.2 Customer Online Ordering

Alur pemesanan yang dirancang dalam SDD:

1. Customer membuka aplikasi dan melihat Rider aktif dalam radius 1,5 km.
2. Customer memilih Rider.
3. Sistem mengirim permintaan kepada Rider.
4. Rider menerima atau menolak permintaan.
5. Jika ditolak, Rider wajib memberikan alasan.
6. Jika diterima, Customer memilih menu dan jumlah.
7. Customer menentukan metode Pick Up atau Call Rider.
8. Customer mengonfirmasi pesanan melalui WhatsApp.
9. Chatbot memandu konfirmasi pembayaran.
10. Rider memverifikasi pembayaran.
11. Rider menyiapkan atau mengantarkan pesanan.
12. Pesanan ditandai selesai.

### Pick Up

Customer mengambil makanan sendiri pada gerobak Rider.

### Call Rider

Rider mengantarkan pesanan kepada Customer berdasarkan alamat dan titik lokasi yang diberikan.

## 6.3 Offline Ordering

1. Rider membuka fitur transaksi offline.
2. Rider memasukkan item dan jumlah pembelian.
3. Rider menanyakan apakah Customer merupakan member.
4. Jika member, Rider memasukkan nomor telepon untuk mencari akun.
5. Jika ditemukan, transaksi dihubungkan dengan akun Customer.
6. Rider memilih QRIS atau tunai.
7. Rider memverifikasi pembayaran.
8. Pesanan ditandai selesai.
9. Jika terhubung dengan akun member, transaksi menambah progres loyalitas.

Pesanan offline tetap dapat dilakukan tanpa akun Customer.

## 6.4 Inventory Management

Alur inventori:

```text
Warehouse Admin
      |
      v
   Stock-In
      |
      v
  Warehouse Stock
      |
      v
 Stock Allocation
      |
      v
 Rider Confirmation
      |
      v
   Rider Stock
      |
      v
 Stock Update / Sales
```

Ketentuan:

- Stok gudang berasal dari pencatatan Stock-In.
- Warehouse mengalokasikan stok kepada Rider.
- Alokasi menunggu konfirmasi Rider.
- Stok gerobak bertambah setelah Rider mengonfirmasi alokasi.
- Rider dapat memperbarui stok gerobak.
- Setiap perubahan stok harus memiliki catatan riwayat.
- Alokasi yang melebihi stok gudang ditolak.
- Stok gerobak tidak boleh negatif.

SDD menyatakan bahwa stok gerobak diperbarui oleh Rider secara manual dan tidak otomatis berkurang dari transaksi. Detail sinkronisasi stok dengan penjualan harus mengikuti keputusan implementasi yang disepakati.

## 6.5 GPS Live Tracking

1. Rider menekan Mulai Bekerja.
2. Aplikasi memeriksa izin GPS.
3. Rider menjadi aktif.
4. Aplikasi mengirim koordinat setiap 10 detik melalui WebSocket.
5. Backend menerima koordinat.
6. Posisi terkini disimpan di Redis.
7. Sistem menyiarkan posisi kepada dashboard Korlap dan Customer yang memenuhi ketentuan radius.
8. Rider mengakhiri pekerjaan.
9. Status Rider menjadi tidak aktif dan posisi dihapus dari Redis.

Posisi GPS terkini tidak disimpan permanen di PostgreSQL menurut rancangan SDD.

## 6.6 Loyalty Program

Program loyalitas:

**10 transaksi selesai = 1 paket nasi dan lauk pilihan bebas.**

Ketentuan:

- Transaksi online dapat dihitung.
- Transaksi offline dapat dihitung jika terhubung dengan akun member.
- Hanya transaksi selesai yang dihitung.
- Pesanan ditolak dan kedaluwarsa tidak dihitung.
- Setiap transaksi hanya boleh menambah hitungan satu kali.

Detail penukaran reward, masa berlaku, dan pencatatan harga item gratis masih memerlukan keputusan final.

---

# 7. Use Case Specification

SDD mendefinisikan 35 use case.

| ID    | Use Case                            | Aktor          |
| ----- | ----------------------------------- | -------------- |
| UC-01 | Daftar Akun                         | Customer       |
| UC-02 | Verifikasi OTP                      | Customer       |
| UC-03 | Login                               | Semua role     |
| UC-04 | Logout                              | Semua role     |
| UC-05 | Kelola Profil                       | Customer       |
| UC-06 | Hapus Akun                          | Customer       |
| UC-07 | Lihat Kebijakan Privasi dan CS      | Customer       |
| UC-08 | Kelola Menu dan Stok Masuk          | Warehouse      |
| UC-09 | Alokasi Stok ke Rider               | Warehouse      |
| UC-10 | Lihat Riwayat Stok                  | Warehouse      |
| UC-11 | Lihat Laporan Setoran               | Warehouse      |
| UC-12 | Daftarkan Rider                     | Warehouse      |
| UC-13 | Pantau Posisi Rider                 | Korlap         |
| UC-14 | Lihat Data dan Status Rider         | Korlap         |
| UC-15 | Mulai dan Akhiri Bekerja            | Rider          |
| UC-16 | Input Pesanan Offline               | Rider          |
| UC-17 | Terima atau Tolak Pesanan           | Rider          |
| UC-18 | Antarkan Pesanan                    | Rider          |
| UC-19 | Konfirmasi Pesanan Diterima         | Rider          |
| UC-20 | Konfirmasi Pembayaran Online        | Rider          |
| UC-21 | Lihat Riwayat Pembelian             | Rider          |
| UC-22 | Lihat Laporan Setoran               | Rider          |
| UC-23 | Lihat Menu                          | Guest/Customer |
| UC-24 | Lihat Gerobak Aktif                 | Customer       |
| UC-25 | Pesan Pick Up                       | Customer       |
| UC-26 | Pesan Call Rider                    | Customer       |
| UC-27 | Konfirmasi Pesanan WhatsApp         | Customer       |
| UC-28 | Lacak Pesanan dan Rider             | Customer       |
| UC-29 | Lihat Riwayat Pesanan               | Customer       |
| UC-30 | Lihat Progres Loyalitas             | Customer       |
| UC-31 | Gunakan Reward                      | Customer       |
| UC-32 | Akses Landing Page NFC/QR           | Guest          |
| UC-33 | Arahkan ke Unduh Aplikasi           | Customer       |
| UC-34 | Kaitkan Member pada Pesanan Offline | Rider          |
| UC-35 | Perbarui Stok Gerobak               | Rider          |

---

# 8. System Architecture

## 8.1 High-Level Architecture

```text
                    CUSTOMER MOBILE
                           |
                     RIDER MOBILE
                           |
                    WEB DASHBOARD
                           |
                     LANDING PAGE
                           |
                           v
                  +-------------------+
                  |    BACKEND API    |
                  |                   |
                  | REST API          |
                  | WebSocket         |
                  | JWT + RBAC        |
                  | Business Logic    |
                  +---------+---------+
                            |
             +--------------+--------------+
             |              |              |
             v              v              v
         PostgreSQL       Redis       External APIs
         Main Database    GPS Cache   WhatsApp
                                     Firebase FCM
                                     OpenStreetMap
```

## 8.2 Architecture Principles

- Satu backend melayani seluruh aplikasi Web dan Mobile.
- Business logic berada pada backend.
- PostgreSQL menyimpan data utama.
- Redis menyimpan posisi GPS terkini dan data sementara.
- REST API digunakan untuk komunikasi request-response.
- WebSocket digunakan untuk komunikasi real-time.
- JWT digunakan untuk autentikasi.
- RBAC digunakan untuk pembatasan hak akses.
- External API digunakan untuk layanan WhatsApp, peta, dan notifikasi.

## 8.3 Deployment Architecture

Rancangan deployment SDD mencakup:

- Nginx sebagai reverse proxy.
- HTTPS/TLS 1.3.
- Backend REST API.
- WebSocket server.
- PostgreSQL.
- Redis.
- Docker Compose.
- Cloud server AWS atau GCP.
- CI/CD menggunakan pipeline seperti GitHub Actions.
- Environment development, staging, dan production.

SDD mengutamakan satu virtual server pada rilis pertama, bukan Kubernetes atau cluster server.

---

# 9. Backend System Design

Backend terdiri dari sembilan modul utama.

## M01 — Authentication Module

Tanggung jawab:

- Registrasi Customer.
- Verifikasi OTP.
- Login dan logout.
- JWT generation dan validation.
- Role-based access control.

Komponen:

- AuthController
- AuthService
- OtpService
- RoleGuard

Dependency: M02, M09, PostgreSQL, Bcrypt.

## M02 — User Management Module

Tanggung jawab:

- Mengelola profil pengguna.
- Mengubah password.
- Menghapus akun.
- Menyediakan kebijakan privasi dan CS.
- Mendaftarkan Rider oleh Warehouse.
- Mencari akun member melalui nomor telepon.

Komponen:

- ProfileController
- UserService
- RiderRegistrationService

Dependency: M01, PostgreSQL.

## M03 — Menu & Inventory Module

Tanggung jawab:

- CRUD menu.
- Menu publik.
- Stock-In.
- Stock-Out dan alokasi.
- Konfirmasi alokasi oleh Rider.
- Pengelolaan stok gerobak.
- Riwayat stok.

Komponen:

- MenuService
- StockInService
- StockOutService
- RiderStockService
- StockQueryService

Dependency: M01, M04, PostgreSQL.

## M04 — Order Module

Tanggung jawab:

- Mengelola pesanan online.
- Mengelola pesanan offline.
- Pick Up dan Call Rider.
- Penerimaan dan penolakan pesanan.
- Pengelolaan status pesanan.
- Riwayat pesanan.

Komponen:

- OrderController
- OrderService
- OrderStateMachine
- OrderHistoryService

Dependency: M01, M02, M03, M05, M06, M08, M09, PostgreSQL, WebSocket.

## M05 — Payment Module

Tanggung jawab:

- Mencatat metode pembayaran.
- Mencatat status pembayaran.
- Verifikasi pembayaran oleh Rider.
- Menghubungkan pembayaran dengan pesanan.

Metode pembayaran:

- QRIS.
- Tunai.

Komponen:

- PaymentService
- PaymentRecord

Pembayaran online maupun offline tidak menggunakan payment gateway dalam rancangan SDD. Verifikasi dilakukan manual oleh Rider.

Dependency: M04, M09, PostgreSQL.

## M06 — Tracking & Map Module

Tanggung jawab:

- Menerima koordinat GPS Rider.
- Mengelola status aktif Rider.
- Menyimpan posisi terkini di Redis.
- Menyiarkan posisi melalui WebSocket.
- Menghitung jarak Rider terdekat.
- Menyediakan data peta untuk Customer dan Korlap.

Komponen:

- LocationGateway
- PresenceService
- NearbyService
- MapDataController

Dependency: M01, M04, Redis, WebSocket, OpenStreetMap/Leaflet.

## M07 — Report Module

Tanggung jawab:

- Riwayat pembelian.
- Laporan setoran per Rider.
- Filter tanggal.
- Perhitungan total transaksi.

Komponen:

- ReportController
- ReportService

Ketentuan:

- Hanya pesanan berstatus Selesai yang dihitung.
- Warehouse dapat melihat laporan Rider.
- Rider hanya dapat melihat laporan miliknya.
- Tidak ada status sudah disetor dalam rancangan SDD.
- Pencatatan setoran dilakukan manual di luar sistem.

Dependency: M01, M04, M05, PostgreSQL.

## M08 — Loyalty Module

Tanggung jawab:

- Menghitung transaksi Customer.
- Menampilkan progres loyalitas.
- Mengelola reward.
- Mencatat penggunaan reward.

Komponen:

- LoyaltyService
- LoyaltyAccount
- LoyaltyLedger

Aturan reward:

- Setiap 10 transaksi selesai mendapatkan satu reward.
- Transaksi online dan offline member dihitung.
- Penggunaan reward harus tercatat agar tidak terjadi penggunaan ganda.

Dependency: M04, PostgreSQL.

## M09 — WhatsApp Notification Module

Tanggung jawab:

- Mengirim OTP.
- Menjalankan chatbot konfirmasi pembayaran.
- Menerima webhook WhatsApp.
- Mengirim notifikasi status pesanan.
- Mengirim push notification kepada Rider.

Komponen:

- WhatsAppClient
- OtpSender
- ChatbotFlow
- WebhookHandler
- PushNotificationService

Dependency:

- WhatsApp Business API Gateway.
- Firebase Cloud Messaging.
- M01.
- M04.
- M05.

---

# 10. Domain Model and Database Design

## 10.1 Domain Model

SDD menggunakan satu kelas abstrak User untuk menyimpan data akun seluruh role.

Subkelas:

- Customer
- Rider
- WarehouseAdmin
- Korlap

Atribut akun bersama meliputi identitas pengguna, nama, nomor telepon, username, password hash, role, dan status verifikasi.

## 10.2 Main Database Entities

| Entity            | Fungsi                          |
| ----------------- | ------------------------------- |
| users             | Data seluruh akun dan role      |
| branches          | Data cabang                     |
| menu_items        | Master menu                     |
| stock_in          | Catatan barang masuk            |
| stock_allocations | Alokasi stok ke Rider           |
| rider_stock       | Stok terkini per Rider dan menu |
| rider_stock_logs  | Riwayat perubahan stok          |
| rider_shifts      | Riwayat jam kerja Rider         |
| orders            | Data pesanan                    |
| order_items       | Detail item pesanan             |
| payments          | Data pembayaran                 |
| loyalty_accounts  | Akun progres loyalitas          |
| loyalty_ledger    | Riwayat perubahan loyalitas     |
| otp_codes         | Data verifikasi OTP             |
| whatsapp_logs     | Catatan komunikasi WhatsApp     |

SDD menyatakan ERD terdiri dari 16 tabel. Nama dan definisi seluruh kolom harus mengikuti diagram ERD dan schema definitions pada SDD.

## 10.3 Entity Relationships

Hubungan utama:

- Branch memiliki banyak User.
- Branch memiliki banyak catatan Stock-In dan Stock-Allocation.
- User mencatat Stock-In.
- User menjadi Rider penerima alokasi.
- User mengelola RiderStock dan RiderShift.
- User dapat menjadi Customer pada Order.
- User dapat menjadi Rider yang melayani Order.
- MenuItem direferensikan oleh Stock-In, Stock-Allocation, RiderStock, RiderStockLog, dan OrderItem.
- Order memiliki satu atau lebih OrderItem.
- Order memiliki maksimal satu Payment.
- Customer memiliki maksimal satu LoyaltyAccount.
- Order dapat menghasilkan entri LoyaltyLedger.
- Order dapat memiliki catatan WhatsApp.

## 10.4 Database Design Rules

- Gunakan foreign key sesuai ERD.
- Gunakan index untuk pencarian dan filtering.
- `orders.customer_id` nullable karena pesanan offline dapat dilakukan non-member.
- `orders.rider_id` mengacu kepada Rider yang melayani.
- `payments.verified_by` mengacu kepada Rider yang memverifikasi.
- Harga item disalin ke OrderItem agar histori transaksi tidak berubah saat harga menu diperbarui.
- Posisi GPS terkini disimpan di Redis, bukan tabel permanen PostgreSQL.
- Proses transaksi penting harus menggunakan database transaction.
- Gunakan mekanisme idempotency untuk mencegah transaksi, reward, atau webhook ganda.

**Schema note:** Detail seluruh kolom dan tipe data harus diverifikasi langsung dari gambar database schema pada SDD. README ini tidak menggantikan definisi skema resmi.

---

# 11. API Design

Ringkasan endpoint berdasarkan rancangan SDD.

| Method | Endpoint                          | Fungsi                    | Role            |
| ------ | --------------------------------- | ------------------------- | --------------- |
| POST   | `/auth/register`                  | Registrasi akun           | Public          |
| POST   | `/auth/verify-otp`                | Verifikasi OTP            | Public          |
| POST   | `/auth/login`                     | Login                     | Public          |
| POST   | `/auth/logout`                    | Logout                    | All             |
| GET    | `/users/me`                       | Melihat profil            | Customer        |
| PUT    | `/users/me`                       | Memperbarui profil        | Customer        |
| DELETE | `/users/me`                       | Menghapus akun            | Customer        |
| POST   | `/riders`                         | Mendaftarkan Rider        | Warehouse       |
| GET    | `/menu`                           | Melihat menu              | Public          |
| POST   | `/menu`                           | Membuat menu              | Warehouse       |
| PUT    | `/menu`                           | Mengubah menu             | Warehouse       |
| PATCH  | `/menu`                           | Memperbarui status menu   | Warehouse       |
| POST   | `/stock-in`                       | Mencatat stok masuk       | Warehouse       |
| POST   | `/stock-allocations`              | Alokasi stok              | Warehouse       |
| GET    | `/stock/history`                  | Riwayat stok              | Warehouse       |
| POST   | `/stock-allocations/{id}/confirm` | Konfirmasi alokasi        | Rider           |
| PUT    | `/rider-stock`                    | Memperbarui stok gerobak  | Rider           |
| POST   | `/riders/me/start`                | Mulai bekerja             | Rider           |
| POST   | `/riders/me/end`                  | Akhiri bekerja            | Rider           |
| GET    | `/riders/active`                  | Rider aktif               | Korlap          |
| GET    | `/riders/nearby`                  | Rider sekitar             | Customer        |
| POST   | `/orders/requests`                | Mengajukan pesanan        | Customer        |
| POST   | `/orders/{id}/accept`             | Menerima pesanan          | Rider           |
| POST   | `/orders/{id}/reject`             | Menolak pesanan           | Rider           |
| PUT    | `/orders/{id}/items`              | Memilih item pesanan      | Customer        |
| POST   | `/webhooks/whatsapp`              | Webhook WhatsApp          | External        |
| POST   | `/orders/{id}/payment/verify`     | Verifikasi pembayaran     | Rider           |
| POST   | `/orders/{id}/deliver`            | Mengantarkan pesanan      | Rider           |
| POST   | `/orders/{id}/complete`           | Menyelesaikan pesanan     | Rider           |
| POST   | `/orders/offline`                 | Membuat pesanan offline   | Rider           |
| PUT    | `/orders/{id}/member`             | Menghubungkan akun member | Rider           |
| POST   | `/orders/{id}/payment`            | Memilih metode pembayaran | Rider           |
| GET    | `/orders`                         | Riwayat pesanan           | Customer/Rider  |
| GET    | `/reports/settlement`             | Laporan setoran           | Rider/Warehouse |
| GET    | `/loyalty/me`                     | Progres loyalitas         | Customer        |
| POST   | `/orders/{id}/reward`             | Menggunakan reward        | Customer/Rider  |

Endpoint di atas merupakan ringkasan rancangan, bukan kontrak OpenAPI final. Detail payload, response, status code, dan validasi harus mengacu pada dokumentasi API yang disepakati.

---

# 12. Real-Time Communication

Komunikasi real-time menggunakan WebSocket/Socket.IO.

## 12.1 Event List

| Event             | Direction         | Description                      |
| ----------------- | ----------------- | -------------------------------- |
| `rider:position`  | Rider → Server    | Mengirim koordinat GPS           |
| `rider:moved`     | Server → Client   | Menyebarkan posisi terbaru Rider |
| `rider:active`    | Server → Client   | Memberitahukan Rider aktif       |
| `rider:inactive`  | Server → Client   | Memberitahukan Rider tidak aktif |
| `order:requested` | Server → Rider    | Permintaan pesanan baru          |
| `order:rejected`  | Server → Customer | Informasi penolakan pesanan      |

## 12.2 GPS Data

Data koordinat yang dikirimkan meliputi:

- Latitude.
- Longitude.
- Timestamp.

Frekuensi pengiriman: setiap 10 detik selama Rider bekerja.

## 12.3 Real-Time Rules

- WebSocket harus memvalidasi identitas pengguna.
- Rider hanya dapat mengirim lokasi untuk akun miliknya.
- Korlap dapat menerima lokasi Rider sesuai kewenangannya.
- Customer hanya menerima informasi Rider yang relevan dengan radius pencarian.
- Posisi lama harus dianggap kedaluwarsa setelah timeout.
- Koneksi yang terputus harus dapat melakukan reconnect.
- Akses lokasi harus dilindungi berdasarkan role.

---

# 13. User Interface and UX Design

SDD menetapkan tema visual Minang, warna oranye untuk tombol aksi utama, dan latar krem agar foto lauk menonjol.

## 13.1 Landing Page

Platform: Web.

Fitur dan bagian halaman:

1. Hero section dengan judul "Nasi Padang Keliling, Sekarang Bisa Dilacak!"
2. Promosi fitur lacak gerobak live.
3. Informasi ketersediaan stok menu real-time.
4. Informasi pemesanan WhatsApp.
5. Informasi panggil gerobak dalam radius 1,5 km.
6. Banner program loyalitas.
7. Tiga langkah penggunaan aplikasi.
8. Form registrasi.
9. FAQ accordion.
10. Tautan Google Play dan App Store.
11. QR Code unduhan aplikasi.
12. Footer dan tautan WhatsApp.

## 13.2 Login Page

Platform: Mobile.

Aktor: Customer dan Rider.

Fungsi:

- Login menggunakan nomor atau username.
- Password.
- Validasi kredensial.
- Redirect berdasarkan role.

## 13.3 Customer Mobile Dashboard

Fitur:

- Beranda.
- Peta gerobak aktif.
- Detail menu.
- Detail Rider.
- Pemesanan Pick Up.
- Pemesanan Call Rider.
- Konfirmasi WhatsApp.
- Tracking pesanan.
- Riwayat pesanan.
- Profil.
- Loyalitas.

## 13.4 Rider Mobile Dashboard

Fitur:

- Dashboard operasional.
- Mulai/Akhiri Bekerja.
- Status GPS.
- Daftar permintaan pesanan.
- Terima/Tolak pesanan.
- Detail pesanan.
- Verifikasi pembayaran.
- Pengantaran.
- Pesanan offline.
- Pengelolaan stok.
- Konfirmasi alokasi stok.
- Riwayat pembelian.
- Laporan setoran.

## 13.5 Admin Warehouse Dashboard

Fitur yang tercantum dalam navigation flow:

- Menu dan Stok Masuk.
- Alokasi stok ke Rider.
- Riwayat stok.
- Laporan setoran.
- Daftarkan Rider.

Mockup dashboard Warehouse belum tersedia dalam SDD.

## 13.6 Korlap Dashboard

Fitur yang tercantum dalam SDD:

- Peta Rider aktif.
- Marker lokasi Rider.
- Informasi data Rider.
- Informasi status Rider.

Mockup dashboard Korlap belum tersedia dalam SDD. Detail tampilan perlu disesuaikan dengan kebutuhan fungsional Korlap.

---

# 14. Non-Functional Requirements

| Category           | Requirement                                                 |
| ------------------ | ----------------------------------------------------------- |
| Performance        | API response maksimal 2 detik untuk pembaruan peta dan stok |
| GPS                | Pembaruan koordinat setiap 10 detik                         |
| Scalability        | Mendukung hingga 500 pengguna aktif bersamaan               |
| Authentication     | JWT                                                         |
| Authorization      | RBAC                                                        |
| Password Security  | Bcrypt                                                      |
| Transport Security | HTTPS/TLS 1.3                                               |
| Privacy            | Mematuhi UU Perlindungan Data Pribadi                       |
| Usability          | Target SUS minimal 70                                       |
| Availability       | Uptime 99,5% per bulan                                      |
| Backup             | Backup otomatis harian                                      |
| Fault Tolerance    | Mendukung failover server                                   |
| Maintainability    | Arsitektur modular dan Clean Architecture                   |
| API Documentation  | OpenAPI/Swagger                                             |
| Portability        | Android 8.0+, iOS 14.0+, dan browser modern                 |

---

# 15. External System Interfaces

## 15.1 Hardware Interface

| Hardware              | Function                                     |
| --------------------- | -------------------------------------------- |
| NFC Tag NTAG213/215   | Mengarahkan Customer ke landing page         |
| Smartphone GPS Sensor | Mengirim koordinat lokasi Rider dan Customer |

## 15.2 Software Interface

| Software                      | Function                     |
| ----------------------------- | ---------------------------- |
| WhatsApp Business API Gateway | OTP, notifikasi, dan chatbot |
| OpenStreetMap / Leaflet       | Peta dan visualisasi GPS     |
| PostgreSQL                    | Database utama               |
| Redis                         | Cache dan posisi GPS terkini |
| Firebase Cloud Messaging      | Push notification            |

## 15.3 Communication Interface

- HTTPS RESTful API.
- WebSocket untuk streaming GPS real-time.
- WhatsApp webhook.
- Firebase Cloud Messaging.

---

# 16. Security and Data Privacy

Ketentuan keamanan sistem:

1. Password harus disimpan menggunakan hashing Bcrypt.
2. JWT digunakan untuk autentikasi.
3. RBAC digunakan untuk membatasi akses fitur.
4. Endpoint harus memvalidasi role pengguna.
5. Seluruh komunikasi produksi menggunakan HTTPS/TLS 1.3.
6. Data nomor WhatsApp harus dilindungi.
7. Data geolokasi hanya boleh diakses oleh role yang berwenang.
8. Aktivitas transaksi harus dicatat.
9. Pengelolaan data mengikuti UU Perlindungan Data Pribadi Indonesia.
10. Penghapusan akun harus mempertimbangkan kebutuhan penghapusan atau anonimisasi data pribadi dan retensi catatan transaksi.

---

# 17. System Constraints and Assumptions

## 17.1 Constraints

- Smartphone Rider harus memiliki koneksi internet.
- GPS harus berfungsi selama jam operasional.
- Customer harus memiliki WhatsApp aktif.
- NFC/QR mengarah ke URL landing page.
- Radius pemanggilan gerobak dibatasi maksimal 1,5 km.
- Web dashboard harus responsif untuk PC dan tablet.
- Aplikasi mobile mendukung Android dan iOS.

## 17.2 Assumptions

- Layanan WhatsApp API tersedia dan stabil.
- Layanan peta tersedia.
- Smartphone Rider memiliki GPS.
- Customer dapat mengakses WhatsApp untuk menerima OTP dan konfirmasi.
- Data posisi GPS dikirim selama Rider bekerja.

---

# 18. Known Design Decisions and Specification Differences

Bagian ini mencatat perbedaan atau hal yang belum ditetapkan secara final antara SRS dan SDD.

| No. | Topic               | Specification / Issue                                                                                    |
| --- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| 1   | Regional Manager    | Ada pada SRS, tetapi tidak termasuk empat role utama SDD                                                 |
| 2   | Route Assignment    | SRS menyebut Korlap membagi rute, SDD M06 menyebut Korlap hanya memantau                                 |
| 3   | WhatsApp Ordering   | SRS menyebut pemesanan via WA; SDD menjelaskan pemesanan melalui aplikasi lalu WhatsApp untuk konfirmasi |
| 4   | Loyalty             | SRS menyebut poin, SDD menetapkan 10 transaksi selesai untuk satu reward                                 |
| 5   | Registration Banner | Mockup menjanjikan poin saat registrasi, tetapi aturan loyalitas menghitung transaksi selesai            |
| 6   | Reward Redemption   | Cara penukaran reward belum ditetapkan                                                                   |
| 7   | Reward Expiry       | Masa berlaku reward belum ditetapkan                                                                     |
| 8   | Reward Accounting   | Pencatatan item gratis sebagai Rp0 atau harga penuh belum diputuskan                                     |
| 9   | GPS Timeout         | Batas waktu Rider dianggap tidak aktif belum ditentukan                                                  |
| 10  | Stock Management    | Mekanisme stok ketika order gagal, ditolak, atau kedaluwarsa perlu dipastikan                            |
| 11  | Branch Inventory    | Stok per cabang Kertajaya dan Darmo masih merupakan asumsi SDD                                           |
| 12  | Forgot Password     | Mockup menyebut lupa password, tetapi use case belum tersedia                                            |
| 13  | Report Export       | SRS meminta ekspor laporan PDF/Excel, sedangkan SDD menyebut fitur tersebut tidak diminta mitra          |
| 14  | Payment             | Detail bukti dan status pembayaran online belum dijelaskan sepenuhnya                                    |
| 15  | Database Schema     | SDD menyebut 16 tabel; detail kolom harus diverifikasi melalui diagram visual                            |

Perbedaan ini tidak boleh diselesaikan dengan asumsi sepihak oleh developer. Keputusan final harus dicatat dalam dokumentasi keputusan teknis.

---

# 19. Known Risks and Implementation Considerations

1. **Order State Management:** Transisi status pesanan harus dikendalikan backend agar tidak terjadi status yang tidak valid.
2. **Inventory Consistency:** Pembaruan stok harus menggunakan transaksi database agar tidak terjadi stok negatif.
3. **Duplicate Transactions:** Webhook dan request yang dikirim ulang tidak boleh menghasilkan transaksi ganda.
4. **GPS Staleness:** Rider yang kehilangan koneksi tidak boleh terus ditampilkan sebagai aktif tanpa validasi.
5. **Location Privacy:** Informasi lokasi harus dibatasi berdasarkan role dan konteks penggunaan.
6. **Loyalty Integrity:** Satu transaksi tidak boleh menambah progres loyalitas lebih dari satu kali.
7. **Scope Conflict:** Role Regional Manager dan pembagian rute membutuhkan keputusan final.
8. **Incomplete Mockups:** Dashboard Warehouse dan Korlap belum memiliki mockup resmi dalam SDD.
9. **Stock Synchronization:** Aturan pengurangan stok, reservasi, dan rollback perlu disepakati.
10. **External Service Dependency:** Gangguan WhatsApp, Firebase, atau layanan peta harus memiliki penanganan error dan fallback.

---

# 20. Reference Documents

Dokumentasi utama proyek:

| Document                                 | Description                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| SRS — Software Requirement Specification | Kebutuhan fungsional, non-fungsional, ruang lingkup, aktor, dan antarmuka sistem                 |
| SDD — Software Design Document           | Rancangan arsitektur, use case, modul, class diagram, object interaction, ERD, schema, dan UI/UX |
| API Documentation                        | Kontrak komunikasi backend dan frontend                                                          |
| Architecture Documentation               | Arsitektur aplikasi dan deployment                                                               |
| Database Documentation                   | ERD, relasi, dan definisi tabel                                                                  |
| Open Questions                           | Daftar keputusan yang belum ditetapkan                                                           |
| Task Backlog                             | Daftar pekerjaan project                                                                         |

SRS dan SDD merupakan sumber spesifikasi resmi. README ini merupakan dokumentasi gabungan untuk memudahkan seluruh developer memahami sistem secara menyeluruh.

---

# 21. Development Repository Information

Repository: https://github.com/HenriKurniawa/Compro-SIPALING-PADANG

Branch convention:

- `main`: Versi stabil.
- `develop`: Integrasi pengembangan.
- `feature/*`: Pengembangan fitur.
- `fix/*`: Perbaikan bug.
- `docs/*`: Dokumentasi.

Contoh nama branch:

- `feature/backend-auth`
- `feature/customer-order`
- `feature/rider-gps`
- `feature/korlap-dashboard`
- `feature/warehouse-inventory`
- `fix/order-validation`
- `docs/update-documentation`

Perubahan kode harus melalui Pull Request dan review anggota tim sebelum masuk ke branch integrasi.

---

**SiPaling Naspad — Modernizing Mobile Nasi Padang Cart Operations.**
