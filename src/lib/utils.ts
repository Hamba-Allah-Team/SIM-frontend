import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value)
}

export function getFullImageUrl(imagePath: string | null | undefined): string {
    // Jika tidak ada path gambar, kembalikan placeholder
    if (!imagePath) {
        return 'https://placehold.co/800x400/EBF1F4/888?text=Gambar+Tidak+Tersedia';
    }
    
    // Jika path sudah merupakan URL lengkap, langsung kembalikan
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Ambil base URL dari environment variable
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    
    // Pastikan selalu ada '/' di antara base URL dan path gambar
    const finalPath = imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`;
    
    return `${apiBaseUrl}${finalPath}`;
}