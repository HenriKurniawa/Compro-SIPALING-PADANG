# SIPALING Admin Warehouse — Spesifikasi Layer API

Dokumen ini merinci antarmuka pemrograman aplikasi (API) untuk modul operasional gudang (**Warehouse & Logistik**) SiPaling Nasi Padang.

Struktur layer API terletak pada `src/api/`:
- `client.ts`: Wrapper fetch terstandarisasi dengan Bearer Token dan base URL `import.meta.env.VITE_API_URL`.
- `mockApi.ts`: Simulasi Promise lokal berbasis data persistensi `localStorage`.
- `index.ts`: Switch otomatis (jika `VITE_API_URL` tidak didefinisikan, otomatis menggunakan `mockApi`).

---

## Daftar Endpoint

### 1. Autentikasi Admin Gudang
- **Endpoint**: `POST /api/warehouse/auth/login`
- **Deskripsi**: Masuk ke sesi operasional gudang wilayah Kertajaya atau Darmo.
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "password"
  }
  ```
- **Response Sukses (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "ADM-01",
        "name": "Admin Kertajaya",
        "warehouse": "Kertajaya",
        "activated": true,
        "username": "admin",
        "role": "Warehouse Officer"
      },
      "token": "jwt-token-string"
    }
  }
  ```

---

### 2. Riwayat Stok Masuk (Stock-In)
#### a. Ambil Semua Riwayat Stok Masuk
- **Endpoint**: `GET /api/warehouse/stock-in`
- **Header**: `Authorization: Bearer <token>`
- **Response Sukses (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "IN-001",
        "date": "16 Nov 2026",
        "time": "05:30",
        "by": "Admin Kertajaya",
        "items": [
          { "menu": "Nasi Putih", "qty": 500 },
          { "menu": "Ayam Pop", "qty": 300 },
          { "menu": "Rendang Sapi", "qty": 250 },
          { "menu": "Telur Balado", "qty": 200 }
        ]
      }
    ]
  }
  ```

#### b. Tambah Batch Stok Masuk Baru
- **Endpoint**: `POST /api/warehouse/stock-in`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "date": "16 Nov 2026",
    "time": "08:15",
    "by": "Admin Kertajaya",
    "items": [
      { "menu": "Ayam Goreng", "qty": 150 },
      { "menu": "Nasi Putih", "qty": 200 }
    ]
  }
  ```
- **Response Sukses (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "IN-123456",
      "date": "16 Nov 2026",
      "time": "08:15",
      "by": "Admin Kertajaya",
      "items": [...]
    }
  }
  ```

---

### 3. Distribusi Stok Keluar ke Gerobak (Stock-Out)
#### a. Ambil Riwayat Alokasi Gerobak
- **Endpoint**: `GET /api/warehouse/stock-out`
- **Header**: `Authorization: Bearer <token>`
- **Response Sukses (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "OUT-001",
        "date": "16 Nov 2026",
        "riderId": "RDR-01",
        "gerobak": "GB-01",
        "status": "Berjalan",
        "items": [
          { "menu": "Nasi Putih", "qty": 50 },
          { "menu": "Ayam Pop", "qty": 30 },
          { "menu": "Rendang Sapi", "qty": 25 }
        ]
      }
    ]
  }
  ```

#### b. Buat Alokasi Gerobak Baru
- **Endpoint**: `POST /api/warehouse/stock-out`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "date": "16 Nov 2026",
    "riderId": "RDR-02",
    "gerobak": "GB-02",
    "status": "Berjalan",
    "items": [
      { "menu": "Nasi Putih", "qty": 40 },
      { "menu": "Ayam Pop", "qty": 25 }
    ]
  }
  ```

---

### 4. Sisa Stok Riil Gudang (Inventory)
- **Endpoint**: `GET /api/warehouse/inventory`
- **Deskripsi**: Menghitung sisa porsi fisik yang masih tersedia di gudang (`Total Stok Masuk - Total Stok Keluar`).
- **Header**: `Authorization: Bearer <token>`
- **Response Sukses (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "Nasi Putih": 450,
      "Ayam Pop": 270,
      "Ayam Goreng": 150,
      "Rendang Sapi": 225,
      "Telur Balado": 200,
      "Gulai Kikil": 120,
      "Dendeng Batokok": 80,
      "Es Teh Manis": 300
    }
  }
  ```

---

### 5. Afiliasi Rider & Armada Gerobak
- **Endpoint**: `GET /api/warehouse/riders`
- **Header**: `Authorization: Bearer <token>`
- **Deskripsi**: Daftar kontak armada binaan gudang untuk verifikasi serah terima porsi.

---

### 6. Rekapitulasi Laporan Setoran Penjualan
- **Endpoint**: `GET /api/warehouse/reports`
- **Header**: `Authorization: Bearer <token>`
- **Deskripsi**: Rekapitulasi porsi terjual dan nominal uang setoran harian yang diserahkan rider ke gudang.
