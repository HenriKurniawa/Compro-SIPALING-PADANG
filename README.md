# Compro-SIPALING-PADANG — SiPaling Naspad

> **COMPUTING PROJECT** | Program Studi S-1 Informatika — Universitas Telkom Surabaya, 2026

Platform terintegrasi berbasis **Web dan Mobile** untuk memodernisasi operasional gerobak keliling Nasi Padang *SiPaling Naspad* melalui teknologi NFC, GPS Live Tracking, dan integrasi WhatsApp.

---

## 📁 Struktur Repositori

```text
Compro-SIPALING-PADANG/
├── mobile-app/                   # Platform Mobile — Customer & Riders (Android/iOS)
│                                 # Framework: Flutter / React Native (TBD)
│
├── web-dashboard/                # Platform Web — Korlap & Admin Warehouse (Browser)
│                                 # Framework: TBD
│
├── backend/                      # API Terpusat (REST + WebSocket)
│                                 # Runtime: Node.js / Python FastAPI (TBD)
│                                 # Database: PostgreSQL / MongoDB + Redis (TBD)
│
├── docs/                         # Dokumentasi teknis & arsitektur
│   ├── requirements/
│   │   ├── SRS_Kelompok3_SipalingNaspad.pdf   ← Dokumen SRS Resmi
│   │   ├── OPEN_QUESTIONS.md
│   │   └── TASK_BACKLOG.md
│   ├── api/README.md
│   ├── architecture/README.md
│   ├── data/README.md
│   ├── decisions/README.md
│   └── CONTRIBUTING.md
│
└── README.md
```

---

## 🏗️ Arsitektur Platform

```
                     ┌─────────────────────────────────────┐
                     │          BACKEND API TERPUSAT        │
                     │  REST API + WebSocket/MQTT           │
                     │  Auth (JWT + RBAC), GPS Stream       │
                     │  PostgreSQL / MongoDB + Redis        │
                     └──────────────┬──────────────────────┘
                                    │
               ┌────────────────────┼────────────────────┐
               ▼                                         ▼
  ┌────────────────────┐                    ┌────────────────────────┐
  │   MOBILE APP       │                    │   WEB DASHBOARD        │
  │  (Android / iOS)   │                    │  (Browser — PC/Tablet) │
  │                    │                    │                        │
  │  👤 Customer        │                    │  🗂️  Admin Warehouse   │
  │  - Lacak gerobak   │                    │  - Input Stock-In      │
  │  - Order via WA    │                    │  - Distribusi Stock-Out │
  │  - Panggil gerobak │                    │                        │
  │  - Klaim poin      │                    │  📋 Korlap             │
  │                    │                    │  - Pembagian rute      │
  │  🛺 Riders          │                    │  - Live GPS monitoring │
  │  - Broadcast GPS   │                    │                        │
  │  - Kelola stok     │                    │  📊 Regional Manager   │
  │  - Input transaksi │                    │  - Audit lintas region │
  │  - Terima panggilan│                    │  - Export laporan      │
  └────────────────────┘                    └────────────────────────┘
```

---

## 👥 Role dan Platform

| Role | Platform | Hak Akses Utama |
|------|----------|-----------------|
| **Customer** | Mobile App | Lihat gerobak, order WA, panggil gerobak radius ≤1.5km, klaim poin |
| **Riders** | Mobile App | Broadcast GPS, kelola stok gerobak, terima panggilan, input transaksi |
| **Korlap** | Web Dashboard | Bagi rute operasional, monitor live GPS semua Riders |
| **Admin Warehouse** | Web Dashboard | Stock-In gudang, distribusi Stock-Out ke gerobak Riders |
| **Regional Manager** | Web Dashboard | Monitor lintas admin, export laporan audit (PDF/Excel) |

---

## 🔗 Alur Proses Utama (Berdasarkan SRS)

1. **Onboarding**: Customer scan NFC di gerobak → Landing Page Web → Registrasi → Download Mobile App.
2. **Supply Chain**: Admin Warehouse Stock-In → Stock-Out ke masing-masing gerobak Riders.
3. **Operasional Harian**: Korlap bagi rute → Riders aktifkan GPS → Customer lacak gerobak → Order via WA.
4. **Post-Transaksi**: Rider input poin pembelian → Sistem catat poin Customer → Regional Manager audit.

---

## 🌿 Aturan Branch

- `main` — Versi stabil. Jangan commit langsung.
- `develop` — Integrasi fitur aktif.
- Buat branch fitur dari `develop`, PR diarahkan ke `develop`.
- Minta review ≥1 anggota tim sebelum merge.
- **Jangan commit** `.env`, token, password, private key, atau data pribadi/operasional asli.

Contoh penamaan: `feature/mobile-gps-broadcast`, `feature/web-route-management`, `feature/backend-auth`, `fix/api-stock-validation`, `docs/update-srs-notes`

---

## ⚙️ Setup Lokal

Belum ditetapkan — menunggu keputusan stack teknologi (framework, database, hosting). Setelah stack diputuskan, tambahkan panduan setup ke masing-masing folder: `mobile-app/`, `web-dashboard/`, dan `backend/`.

---

## 📊 Status Keputusan Teknis

| Area | Status |
|------|--------|
| Mobile framework (Flutter / React Native) | Belum diputuskan |
| Web framework | Belum diputuskan |
| Backend runtime (Node.js / Python FastAPI) | Belum diputuskan |
| Database (PostgreSQL / MongoDB + Redis) | Belum diputuskan |
| WhatsApp Business API Gateway | Perlu dikonfirmasi |
| Maps API (Leaflet / Mapbox / Google Maps) | Perlu dikonfirmasi |
| Hosting (AWS / GCP) | Perlu dikonfirmasi |
| Deployment & CI/CD | Belum ditetapkan |

---

## ✅ Definition of Done

- Kriteria penerimaan Issue terpenuhi.
- Pengujian relevan dijalankan dan hasilnya dicatat.
- Dokumentasi diperbarui jika API, data, atau setup berubah.
- Tidak ada secret, credential, atau data pribadi dalam commit.
- PR direview dan di-merge ke branch yang dituju.

---

**Referensi SRS**: [`docs/requirements/SRS_Kelompok3_SipalingNaspad.pdf`](./docs/requirements/SRS_Kelompok3_SipalingNaspad.pdf)
