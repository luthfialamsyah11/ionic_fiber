# 🎨 Frontend Documentation - FiberOps FSM

Dokumen ini berisi panduan lengkap mengenai arsitektur *frontend*, *tech stack*, serta alur aplikasi yang ada pada proyek ini. Referensi ini dibuat agar pengembangan fitur maupun *maintenance* di kemudian hari menjadi lebih mudah dipahami oleh semua *developer* atau *AI Assistant*.

---

## 🏗️ 1. Struktur & Arsitektur Frontend

Proyek ini terbagi menjadi **tiga bagian utama** pada sisi antarmuka (*frontend*):

### A. Landing Page Utama (Public)
Halaman depan yang berfungsi sebagai profil perusahaan / sistem *Field Service Management* (FSM).
- **Lokasi Direktori:** `/landing-page/`
- **Tech Stack:** Vanilla HTML5, CSS3, & Vanilla JavaScript.
- **Tema Visual:** **Sci-Fi Neon / Cyber-Glow**
  - **Palet Warna:** *Dark background* (Obsidian/Navy dark), *Neon Cyan* (`#0fffe0`), dan *Neon Magenta* (`#ff00ff`).
  - **Efek Khusus:** *Glass-morphism* (blur latar belakang), pendaran kursor interaktif (*mouse-tracking glow*), dan SVG diagram dinamis.
- **File Utama:**
  - `index.html`: Beranda utama.
  - `style.css`: File *styling* (menggunakan *cache busting* `?v=2.0` pada *link*).
  - `script.js`: Menangani animasi *sequential load* dan *event listener* kursor.
  - `playstore.html`: Halaman *redirect* khusus apabila user menekan tombol aplikasi teknisi.

### B. Admin Panel (Web Dashboard)
Halaman *dashboard* khusus manajemen bagi *Admin* dan *Dispatcher* untuk memantau aktivitas teknisi dan *work order*.
- **Lokasi Direktori:** `/fsm-backend/resources/views/` (Laravel Views)
- **Tech Stack:** 
  - **Framework:** Laravel Blade Templating.
  - **Styling Dasar:** Tailwind CSS (Via CDN).
  - **Styling Kustom (Modifikasi Baru):** Menggunakan *Inline CSS* dengan tema **Sci-Fi Neon** (sama dengan *landing page*) untuk memastikan stabilitas *render* (contoh: pada `auth/login.blade.php`).
- **Ikon:** Ionicons (Via CDN).
- **Alur Login:**
  - File: `fsm-backend/resources/views/auth/login.blade.php`
  - Konsep: *Glass-morphism* card, tidak menggunakan *external CSS asset* untuk menghindari *path error* saat *deployment*, semua *styling* tema khusus di-embed di tag `<style>`.

### C. Technician Mobile App (Aplikasi Teknisi)
Aplikasi khusus untuk teknisi lapangan.
- **Tech Stack:** Ionic Framework (Angular) & Capacitor.
- **Lokasi Codebase:** Terdapat pada direktori `/src/` (Ionic Angular app).
- **Catatan Penting:** Halaman admin versi web tidak didesain untuk digunakan oleh teknisi lapangan. Jika teknisi menekan tombol aplikasi di *landing page*, mereka akan diarahkan ke halaman `playstore.html` untuk mengunduh aplikasi Android/iOS resminya.

---

## 🔄 2. Alur Navigasi (User Flow)

1. **User / Pengunjung Umum:**
   - Masuk ke domain utama.
   - Disajikan `landing-page/index.html` dengan informasi FSM dan animasi *Sci-Fi*.
2. **Admin / Dispatcher:**
   - Mengakses subdomain atau *route* admin (misal: `admin.bentengsiber.com/login`).
   - Masuk melalui halaman `login.blade.php` dengan UI yang sudah disesuaikan menjadi tema Neon.
   - Mengelola data lewat *dashboard* Laravel (Tailwind CSS/Blade).
3. **Teknisi (Technician):**
   - Bila teknisi berada di website (via tombol *App*), diarahkan ke `landing-page/playstore.html`.
   - Teknisi men-download aplikasi Ionic.
   - Login dari aplikasi Ionic, sistem akan menembak REST API (`/api/login`) yang berada di *backend* Laravel.

---

## 🛠️ 3. Aturan Pengembangan (Rules of Thumb)

- **Konsistensi Tema:** Apabila menambah halaman *public* baru atau merombak UI admin, **wajib** mengikuti pedoman tema *Sci-Fi Neon* (Gunakan *glass-morphism*, warna *cyan/magenta*).
- **Deployment Asset CSS:** Pada file Laravel Blade (khususnya panel yang sangat spesifik seperti Login), disarankan menggunakan **Inline `<style>`** untuk UI kustom yang kritis agar terhindar dari isu *path rendering* di hosting.
- **Cache Busting:** Jika mengubah file eksternal seperti `style.css` di `/landing-page/`, selalu tingkatkan parameter versi (`?v=2.0` -> `?v=2.1`) di file HTML agar *browser client* langsung mendapatkan *update*.
- **No Tailwind Conflict:** Panel Admin Laravel menggunakan Tailwind CDN. Jika menulis CSS murni di dalamnya, gunakan penamaan *class* yang unik (contoh: `.login-card`, `.btn-primary`) agar tidak bertabrakan dengan *class* bawaan Tailwind.

---
*Dokumen ini dibuat otomatis pada: Juni 2026. Selalu update dokumen ini bila ada perubahan arsitektur atau penambahan framework baru di sisi frontend.*
