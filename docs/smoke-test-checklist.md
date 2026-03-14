# Quick Smoke-Test Checklist (Misi 1-6)

Tujuan: validasi cepat fitur inti sebelum deploy ke EdgeOne.

## Environment Uji

- Desktop browser: Chrome, Edge, Firefox
- Mobile simulator/device: Android Chrome, iOS Safari
- Viewport wajib: 320, 375, 768, 1024

## Checklist Global (Semua Misi)

- [ ] Halaman terbuka tanpa error visual
- [ ] Header dan navigasi tampil normal
- [ ] Mobile menu bisa buka/tutup
- [ ] Mobile menu tertutup saat klik luar area
- [ ] Mobile menu tertutup saat tombol Escape (desktop keyboard)
- [ ] Tidak ada horizontal overflow di viewport 320 dan 375
- [ ] Link kembali ke portal utama berfungsi

## Matrix Uji per Misi

### Misi 1 - Doa Harian

- [ ] 320: teks Arab dan transliterasi tetap terbaca
- [ ] 375: card doa tidak overflow
- [ ] 768: layout 2 kolom/stack sesuai desain
- [ ] 1024: spacing dan tipografi stabil
- [ ] Navigasi ke misi lain berfungsi

### Misi 2 - Counter Dzikir

- [ ] 320: gauge dan tombol tidak tumpang tindih
- [ ] 375: input custom target tetap bisa diisi
- [ ] 768: badge target tercapai muncul normal
- [ ] 1024: transisi counter/gauge halus
- [ ] Reset counter mengembalikan state awal

### Misi 3 - Kalkulator Zakat

- [ ] 320: form input masih nyaman diisi
- [ ] 375: hasil kalkulasi muncul tanpa overflow
- [ ] 768: switch jenis zakat berjalan normal
- [ ] 1024: status wajib/tidak wajib tampil benar
- [ ] Enter key pada input memicu hitung

### Misi 4 - To-Do List

- [ ] 320: checklist ibadah tetap usable
- [ ] 375: progress bar tidak pecah
- [ ] 768: grid puasa 30 hari tampil rapi
- [ ] 1024: update progress semua modul konsisten
- [ ] Simpan state dan reload tetap persist

### Misi 5 - Jadwal Imsakiyah

- [ ] 320: dropdown region/provinsi/kota tetap bisa dipakai
- [ ] 375: tabel bisa di-scroll horizontal
- [ ] 768: loading/error state tampil normal
- [ ] 1024: tabel jadwal tampil penuh
- [ ] Retry button bekerja saat error

### Misi 6 - Landing Portal

- [ ] 320: hero section dan CTA tetap rapi
- [ ] 375: kartu fitur tidak overlap
- [ ] 768: menu desktop mulai aktif sesuai breakpoint
- [ ] 1024: seluruh section render mulus
- [ ] Semua link menuju Misi 1-5 valid

## Catatan Hasil Uji

Isi ringkas setelah testing:

- Browser:
- Device:
- Temuan bug:
- Severity:
- Tindakan lanjut:
