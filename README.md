# SMK PINTAR — SMK 17 MUNCAR

Games interaktif 2D yang siap di-upload sebagai repository GitHub dan dijalankan melalui **GitHub Pages**.

## Struktur
- `index.html` — halaman login/daftar, dashboard, game, soal, leaderboard.
- `style.css` — tampilan responsif desktop/tablet/Android.
- `app.js` — engine game, akun demo, progres, skor, leaderboard, kontrol touch.
- `config.js` — konfigurasi Google Apps Script.
- `Code.gs` — backend Google Sheets.
- `manifest.webmanifest` + `sw.js` — dukungan PWA agar game dapat ditambahkan ke layar utama Android.
- `Users_Sample.csv` — contoh data peserta.

## 9 Level
1. Gerbang Sekolah — Buku Profil
2. Perpustakaan Program Keahlian — 6 pilihan ganda AKL, BDP, PH, RPL, TO, TP
3. Taman Minat — Buku Minat
4. Ruang Motivasi — Buku Motivasi
5. Laboratorium Impian — Buku Impian
6. Menara Cita-Cita — Buku Cita-Cita
7. Pos Kontak — Buku Kontak
8. Peta Alamat — Buku Data Peserta

> Catatan: versi sebelumnya menampilkan 8 level pada beberapa bagian walaupun data game memiliki 9 level. Versi ini sudah menggunakan `LEVELS.length` sehingga semua penghitung otomatis konsisten.

## Fitur akun
- Daftar otomatis dari halaman awal: nama, kelas, username, password.
- Login username/password.
- Sesi login disimpan di browser agar peserta tidak perlu login ulang setiap membuka game pada perangkat yang sama.
- Password pada mode demo disimpan sebagai SHA-256 bila Web Crypto tersedia.
- Pada backend Google Apps Script, password akun baru di-hash SHA-256 sebelum masuk Sheet `Users`.

## Fitur skor
- Skor pilihan ganda benar: +10.
- Pilihan ganda salah: -2 dan harus dicoba kembali.
- Jawaban esai valid: +5.
- Buku yang sudah ditemukan dicatat.
- Leaderboard mengambil skor terbaik setiap username.
- Jika Google Sheets aktif, leaderboard dapat dilihat dari HP/perangkat berbeda.

## Upload ke GitHub Pages
1. Buat repository baru di GitHub.
2. Upload semua file di folder ini ke root repository.
3. Pastikan `index.html` berada langsung di root.
4. Buka **Settings → Pages**.
5. Pilih **Deploy from a branch**.
6. Pilih branch `main` dan folder `/ (root)`.
7. Simpan lalu buka URL GitHub Pages yang diberikan GitHub.

## Mengaktifkan akun + leaderboard lintas perangkat
1. Buat Google Spreadsheet.
2. Buka **Extensions → Apps Script**.
3. Tempel seluruh isi `Code.gs`.
4. Deploy → New deployment → Web app.
5. Execute as: **Me**.
6. Who has access: **Anyone**.
7. Salin URL `/exec`.
8. Di `config.js`, isi:
   `GOOGLE_SCRIPT_URL: 'URL_WEB_APP_ANDA'`
9. Ubah:
   `DEMO_MODE: false`
10. Upload `config.js` yang sudah diperbarui ke GitHub.

Apps Script akan membuat sheet berikut otomatis saat pertama dipakai:
- `Users`
- `Answers`
- `Progress`

## Mode demo
Tanpa Google Sheets, game tetap dapat dimainkan. Akun dan skor disimpan di browser perangkat masing-masing.

Akun demo:
- Username: `demo`
- Password: `smkpintar`

Mode demo **tidak** membuat leaderboard lintas HP karena setiap browser memiliki penyimpanan sendiri.

## Android
Game dibuat mobile-first:
- tombol sentuh besar;
- input minimal 16px untuk menghindari zoom otomatis pada beberapa browser;
- layout satu kolom di HP;
- arena mengikuti lebar layar;
- kontrol `▲ ◀ 📖 ▶ ▼` untuk bermain tanpa keyboard;
- manifest + service worker untuk pengalaman seperti aplikasi setelah dibuka melalui HTTPS/GitHub Pages.

## Catatan privasi
Level 7 dan 8 meminta nomor WhatsApp dan alamat. Untuk penggunaan sekolah, pertimbangkan apakah data tersebut benar-benar diperlukan. Jika tidak diperlukan, pertanyaan dapat dihapus dari `LEVELS` di `app.js` agar data pribadi tidak dikumpulkan.
