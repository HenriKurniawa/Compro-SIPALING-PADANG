# API untuk Aplikasi Customer

Semua request memakai JSON. Setelah login, kirim header `Authorization: Bearer <token>`.
Nomor HP selalu format `62812…`. Error: `{ "message": "teks untuk pengguna" }` (boleh array, akan digabung).

## Auth
| Method | Path | Body | Respon |
|---|---|---|---|
| POST | `/auth/login` | `{ identifier, password, role: "customer" }` | `{ token, customer: { id, name, phone } }` |
| POST | `/auth/register/request-otp` | `{ name, phone }` | 204 — kirim OTP via WhatsApp |
| POST | `/auth/register/verify-otp` | `{ phone, code }` | `{ registrationToken }` |
| POST | `/auth/register/complete` | `{ registrationToken, password }` | 201 — beri 1 poin bonus |
| POST | `/auth/logout` | – | 204 |

## Gerobak & menu
| Method | Path | Respon |
|---|---|---|
| GET | `/carts/nearby?lat=&lng=` | `Cart[]` dalam radius 1,5 km, gerobak yang ridernya *Sedang bekerja* |
| GET | `/carts/:cartId/menu` | `MenuItem[]` |

```ts
Cart = { id: "GRB-012", riderName, riderPhone, location: { lat, lng }, distanceKm, stock: [{ menuId, name, stock }] }
MenuItem = { id, name, price, stock, imageUrl? }
```

## Pesanan
| Method | Path | Body | Respon |
|---|---|---|---|
| POST | `/orders` | `{ cartId, type: "pickup"\|"antar", items: [{ menuId, qty }], location?, address?, note? }` | `Order` (status `menunggu_rider`) |
| GET | `/orders/:id` | – | `Order` |
| GET | `/customers/me/orders?active=true` | – | `Order[]` (0 atau 1 pesanan aktif) |
| GET | `/customers/me/orders` | – | `Order[]` riwayat (`selesai` & `ditolak`), terbaru dulu |
| POST | `/orders/:id/cancel` | – | 204 (hanya saat `menunggu_rider` / `menunggu_bayar`) |

```ts
Order = {
  id, cartId, riderName, riderPhone, type, status, total, createdAt,
  items: [{ menuId, name, qty, price }],
  address?, note?, location?, cartLocation?,   // cartLocation = posisi GPS gerobak terkini
  rejectReason?,                               // diisi saat ditolak
  whatsappUrl?                                 // link chatbot pembayaran, diisi saat menunggu_bayar
}
```

Urutan status: `menunggu_rider` → (`ditolak`) / `menunggu_bayar` → `verifikasi` (customer sudah bayar di chatbot) → `diproses` (rider verifikasi) → `diantar` (khusus antar) → `selesai`.
Validasi di server: minimum pembelian `antar` Rp25.000 (bisa diubah), stok cukup, satu pesanan aktif per customer.

## Akun & poin
| Method | Path | Body | Respon |
|---|---|---|---|
| GET | `/customers/me/loyalty` | – | `{ points, target: 10, rewards }` |
| PATCH | `/customers/me` | `{ name }` | `Customer` |
| POST | `/customers/me/password` | `{ oldPassword, newPassword }` | 204 |
| DELETE | `/customers/me` | `{ password }` | 204 |
