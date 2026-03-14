# Deploy Final ke EdgeOne

Panduan ini untuk static hosting project Ramadhan Challenge di EdgeOne.

## 1. Struktur Entry Root

Sudah disiapkan:

- Root entry di index.html
- Redirect ke Misi 6: ./Misi%206/index.html

Catatan:

- Nama folder dengan spasi wajib ditulis URL-encoded saat jadi link, contoh: Misi%206

## 2. Pre-Deploy Checklist

- [ ] Jalankan checklist smoke test manual dari docs/smoke-test-checklist.md
- [ ] Pastikan root index redirect normal di local preview
- [ ] Cek Misi 5 (API jadwal) bisa fetch data
- [ ] Pastikan tidak ada file development yang tidak perlu

## 3. File yang Wajib Di-commit Dulu

Daftar minimum untuk optimisasi dan deploy saat ini:

- Misi 1/index.html
- Misi 1/main.css
- Misi 2/index.html
- Misi 2/assets/css/index.css
- Misi 3/index.html
- Misi 3/assets/css/index.css
- Misi 3/assets/js/zakat.js
- Misi 4/index.html
- Misi 4/assets/css/index.css
- Misi 5/index.html
- Misi 5/assets/css/index.css
- Misi 5/assets/js/main.js
- Misi 6/index.html
- Misi 6/assets/css/index.css
- assets/js/mobile-menu.js
- index.html
- README.md
- docs/smoke-test-checklist.md
- docs/smoke-test-report.md
- docs/deploy-edgeone.md

## 4. Rekomendasi Urutan Commit

Opsi aman (2 commit):

Commit 1 (optimisasi aplikasi)

- Semua perubahan di folder Misi 1 sampai Misi 6
- Tambahan shared script: assets/js/mobile-menu.js

Commit 2 (deploy dan dokumentasi)

- index.html (root redirect)
- README.md
- folder docs/

## 5. Command Git yang Direkomendasikan

Jalankan dari root project:

```powershell
git add "Misi 1/index.html" "Misi 1/main.css" "Misi 2/index.html" "Misi 2/assets/css/index.css" "Misi 3/index.html" "Misi 3/assets/css/index.css" "Misi 3/assets/js/zakat.js" "Misi 4/index.html" "Misi 4/assets/css/index.css" "Misi 5/index.html" "Misi 5/assets/css/index.css" "Misi 5/assets/js/main.js" "Misi 6/index.html" "Misi 6/assets/css/index.css" "assets/js/mobile-menu.js"
git commit -m "perf: optimize Misi 1-6 HTML CSS JS and unify mobile menu"

git add "index.html" "README.md" "docs/smoke-test-checklist.md" "docs/smoke-test-report.md" "docs/deploy-edgeone.md"
git commit -m "docs: add smoke test and EdgeOne deployment guide"
```

Lalu push:

```powershell
git push origin main
```

## 6. Deploy di EdgeOne

- Pilih source repository: branch main
- Build command: kosongkan (static site)
- Output directory: root repository
- Setelah deploy sukses, akses domain dan verifikasi redirect root -> Misi 6

## 7. Post-Deploy Sanity Check

- [ ] Domain root membuka portal Misi 6
- [ ] Semua link navigasi antar misi berfungsi
- [ ] Misi 5 berhasil memuat jadwal API
- [ ] Tampilan mobile tetap stabil di 320 dan 375
