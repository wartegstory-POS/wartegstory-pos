# Warteg Story POS — V1 Auto Update

## Build APK
1. Buka GitHub → Actions → Build Android APK and publish web updates.
2. Tekan Run workflow.
3. Unduh artifact `warteg-story-pos-debug-apk` setelah job `build` sukses.

## Aktifkan web auto update (sekali saja)
1. Buka Settings → Pages.
2. Pada Build and deployment, pilih Source: GitHub Actions.
3. Jalankan workflow di tab Actions. Job `publish-web` akan menerbitkan folder `www`.
4. Di Firebase Console → Authentication → Settings → Authorized domains, tambahkan `wartegstory-pos.github.io` agar login anonim Firebase dari alamat web aplikasi diizinkan.

APK ini diarahkan ke GitHub Pages `https://wartegstory-pos.github.io/warteg-story-pos/`.
Pembaruan HTML/CSS/JS berikutnya dapat diterbitkan lewat push ke branch `main` tanpa membuat APK baru. APK baru tetap diperlukan bila ada perubahan kode/plugin native Android atau konfigurasi native.

## Membuat versi berikutnya
- Perbarui `version` di `version.json` (contoh `1.0.1`).
- Perbarui `APP_VERSION` pada pemeriksa versi di HTML utama agar sama.
- Perbarui `CACHE_NAME` di `sw.js` ke versi cache baru.
- Commit/push ke `main`; workflow akan membangun APK dan menerbitkan web release.

## Catatan
- Aplikasi membutuhkan internet untuk mengambil rilis web terbaru; service worker menyimpan halaman untuk fallback offline setelah pertama kali berhasil dimuat. Update versi diperiksa lewat `version.json` dengan permintaan jaringan terbaru.
- Uji transaksi dan sinkronisasi Firebase di perangkat sebelum dipakai operasional.


## Android launcher icon
The GitHub Actions Android workflow generates launcher and adaptive icons from the repository root `icon.png` during each APK build. The installed APK bundles the local `www` files; no remote Capacitor server URL is forced.
