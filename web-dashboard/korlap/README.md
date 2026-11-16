# SIPALING — Dashboard Korlap

Web dashboard Koordinator Lapangan (UC-03, UC-04, UC-13, UC-14). Desain: Figma "DAPUR → Page Korlap" (node `873:16572`).

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:5174
npm run build
npm run lint
```

Tanpa `VITE_API_URL` aplikasi berjalan dengan **data dummy** (`src/data/mockData.ts`).
Akun dummy: `korlap.kertajaya` / `korlap123`.

## Halaman & rute

| Rute      | Halaman                                   | Akses        |
| --------- | ----------------------------------------- | ------------ |
| `/login`  | Login Korlap (01a, 01b)                    | Belum login  |
| `/`       | Peta Rider + daftar + detail (02a–02d)     | Korlap       |
| `/profil` | Profil, ubah password, keluar (03a–03c)    | Korlap       |
| `*`       | Diarahkan ke `/` (atau `/login`)           | —            |

## Stack

React 19 + TypeScript, Vite, Tailwind CSS 4, React Router 7, Leaflet + react-leaflet (tile OpenStreetMap), font Inter (sesuai Figma).

## Integrasi backend (belum tersedia)

- `POST /auth/login`, `POST /auth/logout`, `GET /riders/active` sudah disiapkan di `src/api/index.ts` (SDD §11).
- Pembaruan posisi real-time saat ini: simulasi (mock) atau polling 10 detik (mode API).
  TODO: ganti dengan `socket.io-client` (event `rider:moved`, `rider:active`, `rider:inactive`, SDD §12).
- Ubah password Korlap: endpoint belum didefinisikan di SDD, mode API akan menampilkan pesan "belum tersedia".
