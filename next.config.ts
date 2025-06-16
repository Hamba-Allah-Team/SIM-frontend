import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // Direkomendasikan
  images: {
    // 1. Mendaftarkan hostname yang diizinkan
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**', // Memungkinkan semua path dari hostname ini
      },
      {
        // 2. Proaktif: Menambahkan hostname lain yang mungkin Anda gunakan
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        // 👈 Tambahkan blok ini untuk mengizinkan gambar dari backend lokal Anda
        protocol: 'http',
        hostname: 'localhost',
        port: '8080', // Sesuaikan dengan port backend Anda
        pathname: '/uploads/**',
      },
      {
        // 👈 TAMBAHKAN INI: Izinkan gambar dari backend produksi Anda
        protocol: 'https',
        hostname: 'simasjidbackend.raihanproject.my.id',
        port: '', // Kosongkan jika menggunakan port standar (443 untuk https)
        pathname: '/uploads/**',
      },
      // Anda bisa menambahkan hostname lain di sini di masa depan
    ],
  },
};

export default nextConfig;
