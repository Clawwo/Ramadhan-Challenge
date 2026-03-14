# Ramadhan Challenge

Kumpulan mini project bertema Ramadhan dari Misi 1 sampai Misi 6.

## Daftar Misi

1. Misi 1: Doa harian
2. Misi 2: Counter dzikir
3. Misi 3: Kalkulator zakat
4. Misi 4: Ramadhan to-do list
5. Misi 5: Jadwal imsakiyah
6. Misi 6: Landing page portal Ramadhan

## Cara Menjalankan

1. Clone repository ini.
2. Buka folder project di VS Code.
3. Jalankan dengan Live Server atau web server lokal apa pun.
4. Buka file HTML dari misi yang ingin dijalankan.

Contoh URL lokal jika memakai Live Server:

- Misi 6: /Misi%206/index.html
- Misi 5: /Misi%205/index.html

## Fokus Misi 7 (Final)

Misi ini berfokus pada:

- Optimisasi performa CSS dan JS
- Testing cross-browser
- Testing mobile responsiveness
- Dokumentasi singkat penggunaan

## Optimisasi Yang Sudah Diterapkan

### HTML

- Menambahkan preconnect untuk CDN Tailwind agar koneksi awal lebih cepat.
- Script Tailwind CDN diubah menjadi defer untuk mengurangi blocking render.
- Script menu mobile dipindah ke file JS terpisah agar lebih rapi dan cache-friendly.
- Menambahkan atribut aksesibilitas menu mobile: aria-controls dan aria-expanded.

### CSS

- Menambahkan variabel CSS untuk warna utama supaya konsisten dan mudah maintain.
- Menambahkan prefers-reduced-motion untuk pengguna yang sensitif terhadap animasi.
- Menambahkan fallback untuk browser yang tidak mendukung backdrop-filter.
- Menambahkan content-visibility pada section utama untuk optimasi rendering awal.

### JavaScript

- Refactor logic menu mobile ke file terpisah.
- Tambahan handler untuk:
  - tutup menu saat klik di luar area menu,
  - tutup menu saat tekan Escape,
  - reset menu saat resize ke desktop.

## Checklist Testing Cross-Browser

Lakukan pengujian minimal pada:

- Google Chrome (versi terbaru)
- Microsoft Edge (versi terbaru)
- Mozilla Firefox (versi terbaru)
- Safari (macOS/iOS)

Yang dicek:

- Layout tidak pecah pada ukuran desktop dan mobile.
- Navigasi menu mobile berfungsi normal.
- Link antar misi berjalan benar.
- Font fallback tetap nyaman jika Google Fonts lambat/tidak tersedia.
- Halaman tetap dapat digunakan jika efek blur tidak didukung browser.

## Checklist Testing Mobile

Uji di rentang lebar berikut:

- 320px
- 375px
- 768px
- 1024px

Yang dicek:

- Teks tetap terbaca, tidak bertabrakan.
- Tombol dan link mudah disentuh.
- Menu mobile bisa dibuka dan ditutup tanpa bug.
- Scroll halus dan tidak ada elemen overflow horizontal.

## Catatan

- Proyek ini menggunakan Tailwind CDN pada Misi 6 agar setup tetap sederhana, jadi kemungkinan akan terjadi beberapa hal pada bagian tampilan karena menggunakan CDN membuat website tidak optimal.
