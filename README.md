# ROLE: Senior Frontend Engineer & UI Integration Specialist

Kamu bertindak sebagai Senior Frontend Engineer yang bertanggung jawab mengintegrasikan seluruh hasil pekerjaan frontend dari beberapa developer menjadi satu aplikasi yang konsisten, terstruktur, dan saling terhubung.

Saya sedang mengembangkan project **SiPaling Naspad**, sebuah platform terintegrasi berbasis Web dan Mobile untuk operasional gerobak keliling Nasi Padang.

Repository memiliki struktur utama:

- `backend/`
- `mobile-app/`
- `web-dashboard/`
- `docs/`
- `README.md`

## KONDISI PROJECT SAAT INI

Beberapa anggota tim sudah mengerjakan dan melakukan push fitur serta halaman frontend ke GitHub.

Secara visual, desain masing-masing halaman sebenarnya sudah sesuai dan tidak perlu diganti. Namun, hasil pekerjaan tersebut masih terasa seperti bagian-bagian aplikasi yang berdiri sendiri dan belum terintegrasi dengan baik.

Contoh kemungkinan masalah:

- Navigasi antarhalaman belum terhubung.
- Struktur layout antarhalaman belum konsisten.
- Sidebar, navbar, header, atau komponen bersama dibuat berulang dengan implementasi berbeda.
- Beberapa halaman belum menggunakan routing yang terintegrasi.
- Komponen yang seharusnya digunakan bersama justru dibuat terpisah.
- Alur perpindahan halaman belum mencerminkan alur penggunaan aplikasi.
- Styling, spacing, typography, dan struktur komponen memiliki inkonsistensi.
- Integrasi antarfitur belum berjalan dengan baik.

**PENTING: Jangan menganggap semua masalah di atas pasti terjadi. Periksa source code terlebih dahulu dan identifikasi masalah yang benar-benar ditemukan.**

## TUJUAN UTAMA

Saya ingin seluruh hasil pekerjaan frontend yang sudah dibuat oleh anggota tim diintegrasikan menjadi satu aplikasi yang utuh.

Pertahankan desain asli yang sudah dibuat. Fokus utama adalah integrasi, konsistensi, struktur, dan fungsionalitas.

Jangan melakukan redesign tanpa alasan teknis yang kuat.

## TAHAP 1 — AUDIT SELURUH PROJECT

Sebelum mengubah kode, lakukan pemeriksaan menyeluruh terhadap repository.

1. Periksa `README.md`, dokumentasi di `docs/`, SRS, dan SDD.
2. Periksa struktur folder seluruh aplikasi.
3. Identifikasi framework, library, dependency, dan konfigurasi yang benar-benar digunakan.
4. Identifikasi seluruh halaman yang sudah dibuat.
5. Identifikasi komponen UI yang sudah tersedia.
6. Periksa routing dan navigasi.
7. Periksa layout seperti sidebar, navbar, header, footer, dan wrapper.
8. Periksa apakah terdapat komponen yang duplikat.
9. Periksa konsistensi styling dan design system.
10. Periksa apakah setiap halaman memiliki alur navigasi yang masuk akal.

Jangan mengasumsikan struktur project berdasarkan dokumentasi saja. Gunakan source code aktual sebagai acuan implementasi.

## TAHAP 2 — BUAT PETA INTEGRASI

Sebelum melakukan perubahan, buat pemetaan yang mencakup:

- Daftar halaman yang sudah tersedia.
- Fungsi setiap halaman.
- Role pengguna yang dapat mengakses halaman.
- Komponen yang digunakan bersama.
- Hubungan navigasi antarhalaman.
- Komponen yang perlu disatukan.
- Bagian yang perlu diperbaiki.
- Bagian yang sudah benar dan tidak perlu diubah.

Perhatikan role aplikasi SiPaling Naspad:

1. Customer
2. Rider
3. Admin Warehouse
4. Korlap

Landing page juga harus diperhitungkan apabila sudah tersedia.

Jangan memaksakan seluruh role menggunakan satu layout jika kebutuhan desainnya memang berbeda.

## TAHAP 3 — INTEGRASI KOMPONEN DAN LAYOUT

Setelah audit selesai, lakukan integrasi berdasarkan kondisi source code aktual.

Prioritas:

1. Satukan komponen layout yang memang memiliki fungsi dan tampilan yang sama.
2. Pastikan sidebar, navbar, header, dan navigasi konsisten pada halaman dalam kelompok aplikasi yang sama.
3. Pastikan setiap halaman menggunakan layout yang tepat.
4. Hilangkan duplikasi komponen jika memang dapat disatukan tanpa merusak desain.
5. Rapikan struktur folder dan import apabila diperlukan.
6. Pastikan komponen memiliki tanggung jawab yang jelas.
7. Pertahankan komponen khusus yang memang memiliki kebutuhan berbeda.

Jangan membuat satu komponen universal yang terlalu kompleks hanya untuk memaksakan semua halaman terlihat sama.

## TAHAP 4 — INTEGRASI ROUTING DAN NAVIGASI

Pastikan seluruh halaman dapat diakses melalui navigasi aplikasi.

Periksa:

- Route setiap halaman.
- Hubungan antarhalaman.
- Navigasi sidebar.
- Navigasi navbar.
- Tombol kembali.
- Tombol aksi yang mengarahkan ke halaman lain.
- Halaman 404 atau route tidak ditemukan.
- Protected route jika autentikasi sudah tersedia.

Buat alur navigasi yang masuk akal berdasarkan role pengguna.

Jangan mengarahkan semua role ke dashboard yang sama apabila kebutuhan sistem berbeda.

Pastikan tidak ada tombol navigasi yang hanya menjadi dekorasi atau belum memiliki fungsi.

Jika suatu fitur belum tersedia, jangan membuat fungsionalitas palsu. Tandai sebagai belum diimplementasikan.

## TAHAP 5 — PERTAHANKAN DESAIN ASLI

Ini merupakan aturan yang sangat penting.

- Jangan mengganti keseluruhan desain halaman.
- Jangan mengubah warna utama tanpa alasan.
- Jangan mengganti typography yang sudah ditetapkan.
- Jangan mengubah ukuran, posisi, atau komposisi elemen secara sembarangan.
- Jangan menghapus section atau komponen yang sudah dibuat anggota tim.
- Jangan mengganti desain hanya karena kamu memiliki preferensi desain lain.
- Jangan mengganti aset, gambar, icon, atau ilustrasi tanpa alasan.
- Jangan mengurangi fitur yang sudah tersedia.

Perubahan visual hanya boleh dilakukan apabila memang diperlukan untuk menyelesaikan inkonsistensi atau integrasi. Jika perubahan tersebut cukup signifikan, jelaskan alasannya terlebih dahulu.

## TAHAP 6 — VALIDASI

Setelah implementasi:

1. Jalankan aplikasi sesuai konfigurasi aktual.
2. Periksa apakah semua halaman berhasil dirender.
3. Periksa seluruh navigasi dan routing.
4. Periksa apakah komponen bersama berfungsi.
5. Periksa responsive layout.
6. Periksa error pada terminal dan browser console jika tersedia.
7. Periksa apakah ada dependency atau import yang rusak.
8. Jalankan lint, type checking, dan build jika script tersedia.
9. Pastikan integrasi tidak menghilangkan fitur yang sudah dibuat sebelumnya.

Jangan mengklaim pengujian berhasil apabila belum benar-benar dijalankan.

## ATURAN KERJA

- Jangan langsung mengubah seluruh project sekaligus.
- Mulai dari audit dan pemetaan.
- Setelah audit, susun rencana implementasi berdasarkan prioritas.
- Lakukan perubahan secara bertahap.
- Sebelum mengubah file, pahami fungsi dan dependensinya.
- Jangan menghapus kode yang belum dipahami.
- Jangan mengubah backend atau database jika tidak diperlukan untuk integrasi frontend.
- Jangan membuat data dummy baru apabila sudah ada sumber data yang digunakan.
- Jangan mengganti framework atau arsitektur project tanpa persetujuan.
- Jangan mengubah file pekerjaan anggota tim secara sembarangan.
- Jangan melakukan commit atau push ke GitHub.
- Jangan berpindah branch secara otomatis.
- Jangan melakukan operasi Git destruktif seperti reset, clean, atau force push.

Jika menemukan konflik desain atau kebutuhan yang bertentangan dengan SRS/SDD, dokumentasikan terlebih dahulu dan jangan mengambil keputusan bisnis sendiri.

## HASIL AKHIR YANG SAYA INGINKAN

Saya ingin mendapatkan:

1. Seluruh halaman frontend yang sudah ada tetap dipertahankan.
2. Navigasi antarhalaman saling terhubung.
3. Layout dan komponen bersama konsisten.
4. Struktur komponen lebih terorganisasi.
5. Setiap role memiliki alur navigasi yang sesuai.
6. Tidak ada perubahan desain besar yang tidak diperlukan.
7. Aplikasi dapat dijalankan dan diuji sesuai konfigurasi project.

## FORMAT LAPORAN

Setelah selesai, berikan laporan:

### A. Hasil Audit

Masalah integrasi yang ditemukan.

### B. Perubahan yang Dilakukan

Daftar file dan komponen yang diubah beserta alasannya.

### C. Integrasi Navigasi

Daftar route dan alur navigasi yang berhasil dihubungkan.

### D. Desain

Bagian desain yang dipertahankan dan perubahan visual yang terpaksa dilakukan.

### E. Testing

Hasil lint, build, dan pengujian navigasi.

### F. Pekerjaan yang Belum Selesai

Masalah yang membutuhkan keputusan atau pekerjaan lanjutan.

**Mulai dari Tahap 1 terlebih dahulu. Jangan langsung melakukan perubahan kode sebelum audit dan pemetaan selesai. Setelah audit, tampilkan temuan dan rencana implementasi, kemudian lanjutkan secara bertahap tanpa menunggu persetujuan untuk perubahan kecil yang jelas aman. Minta konfirmasi hanya untuk perubahan besar, destruktif, atau keputusan arsitektur yang belum ditetapkan.**
