# EdgeOne Live Sanity Checklist

Gunakan checklist ini setelah deployment EdgeOne berstatus sukses.

## A. Root dan Routing

- [ ] Domain root membuka halaman portal utama (Misi 6)
- [ ] Redirect root berjalan ke /Misi%206/index.html
- [ ] Tidak ada error 404 pada akses langsung root
- [ ] Refresh browser di halaman misi tetap aman (tidak blank/error)

## B. Navigasi Antar Misi

- [ ] Link Home dari setiap misi kembali ke portal utama
- [ ] Link ke Misi 1 (Doa Harian) berfungsi
- [ ] Link ke Misi 2 (Counter Dzikir) berfungsi
- [ ] Link ke Misi 3 (Kalkulator Zakat) berfungsi
- [ ] Link ke Misi 4 (To-Do List) berfungsi
- [ ] Link ke Misi 5 (Jadwal Imsakiyah) berfungsi

## C. Validasi Mobile Menu (Semua Misi)

- [ ] Tombol menu mobile muncul pada viewport kecil
- [ ] Menu bisa dibuka/ditutup dengan tombol
- [ ] Klik di luar area menu menutup menu
- [ ] Tombol Escape menutup menu (desktop)
- [ ] Resize ke desktop menutup menu otomatis

## D. Validasi Viewport

Uji minimal di lebar layar berikut:
- [ ] 320
- [ ] 375
- [ ] 768
- [ ] 1024

Poin yang dicek pada tiap viewport:
- [ ] Tidak ada horizontal overflow
- [ ] Teks terbaca jelas
- [ ] Tombol dan input dapat diinteraksikan dengan normal

## E. Validasi Fitur Inti per Misi

### Misi 1 - Doa Harian
- [ ] Teks Arab, transliterasi, dan arti tampil utuh

### Misi 2 - Counter Dzikir
- [ ] Tombol tambah dan reset berfungsi
- [ ] Target custom berfungsi
- [ ] Badge target tercapai muncul saat target terpenuhi

### Misi 3 - Kalkulator Zakat
- [ ] Perhitungan zakat berjalan normal
- [ ] Peralihan jenis zakat (penghasilan/emas) berfungsi
- [ ] Enter pada input dapat memicu perhitungan

### Misi 4 - To-Do List
- [ ] Checklist shalat, quran, dzikir, puasa bisa disimpan
- [ ] Progress bar dan persentase ter-update
- [ ] Data tetap ada setelah reload (localStorage)

### Misi 5 - Jadwal Imsakiyah
- [ ] Pemilihan region/provinsi/kota berjalan
- [ ] Jadwal ter-load dari API
- [ ] Loading, error, dan retry state berfungsi

### Misi 6 - Landing Portal
- [ ] Semua card fitur/link menuju misi lain berfungsi
- [ ] Hero section dan CTA tampil normal

## F. Cross-Browser

- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, jika tersedia)

## G. Catatan Rilis

- URL produksi:
- Waktu deploy:
- Versi commit:
- Temuan issue:
- Tindak lanjut:
