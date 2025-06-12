# SIM-frontend

## Sistem Informasi Masjid

Sistem Informasi Masjid adalah sebuah aplikasi berbasis web yang dirancang untuk membantu pengelolaan operasional masjid secara digital dan efisien. Sistem ini menyediakan fitur-fitur seperti manajemen keuangan, pengelolaan artikel dan berita, jadwal kegiatan, serta sistem reservasi fasilitas masjid. Terdapat tiga jenis pengguna (aktor) dalam sistem ini, yaitu Superadmin, Admin, dan Guest (tamu/pengunjung umum).

---
## Fitur Utama

1. Otentikasi Pengguna (Login/Register)
2. Manajemen Pengguna (khusus Superadmin)
3. Manajemen Kas Masjid (pemasukan dan pengeluaran)
4. Manajemen Konten (artikel, berita, pengumuman)
5. Jadwal Kegiatan (kajian, shalat berjamaah, dll.)
6. Reservasi Fasilitas Masjid (ruangan, aula, dll.)
7. Halaman Tamu/Publik untuk melihat informasi tanpa login

---
## Daftar Isi

1.  [Tentang Proyek](#tentang-proyek)
2.  [Persyaratan Sistem](#persyaratan-sistem)
3.  [Panduan Instalasi & Menjalankan Proyek](#panduan-instalasi--menjalankan-proyek)
    * [1. Persiapan Umum](#1-persiapan-umum)
4. [Cloud](#cloud)
5. [Project Architecture](#project-architecture)

---
## Tentang Proyek

1. Frontend (Antarmuka Pengguna)
  - Framework: Next.js (React)
  - Bahasa: JavaScript / TypeScript
  - Tools: Tailwind CSS, React Hook Form, Axios, Framer Motion (opsional)
2. Backend (Logika dan API)
  - Framework: Express.js
  - Bahasa: JavaScript / TypeScript
  - Tools: Multer (untuk upload gambar), JWT (untuk autentikasi)
3. Database
  - DBMS: PostgreSQL
  - ORM: Sequelize
4. Environment
  - Local Dev: Node.js

---
## Persyaratan Sistem

Pastikan sistem Anda memenuhi persyaratan berikut sebelum instalasi:

* **Node.js**: Versi 22.14 
* **npm** : 10.7.0

---
## Panduan Instalasi & Menjalankan Proyek

Ikuti langkah-langkah di bawah ini untuk mengatur dan menjalankan proyek di lingkungan lokal Anda.

### 1. Persiapan Umum

1.  **Clone Repositori**:
    Kloning repositori proyek ini ke komputer lokal Anda. Jika Anda mendapatkan ini dalam bentuk arsip zip, ekstrak di lokasi pilihan Anda. Struktur proyek seharusnya terlihat seperti ini:
    ```
    .
    ├── SIM-backend/            # Folder backend Express
    └── SIM-frontend/           # Folder frontend Next
    ```
    
### 2. Frontend React Setup

1.  **Navigasi ke Folder Frontend**:
    Buka terminal baru dan masuk ke folder `sim-frontend`:
    ```bash
    cd SIM-frontend      # Atau navigasi ke folder ini jika Anda membuatnya di tempat lain
    ```

2.  **Install Dependencies npm**:
    ```bash
    npm install
    ```

3.  **Jalankan Server Pengembangan React**:
    ```bash
    npm run dev
    ```
    Frontend React akan berjalan di `http://localhost:3000`

---
## Cloud
Menggunakan VM dan Docker

Spesifikasi VM Frontend:
- RAM: 1GB
- CPU: 2

Docker Container
- next-js
- nginx

Domain frontend: https://simasjid.raihanproject.my.id

Domain backend: https://simasjidbackend.raihanproject.my.id

---
## Project Architecture
![alt text](/pictures/diagram.png)


![alt text](/pictures/diagram_azure.png)

