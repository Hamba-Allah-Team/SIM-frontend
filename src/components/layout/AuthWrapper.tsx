"use client";

import { useState, useEffect, ReactNode } from "react";
import { usePathname } from 'next/navigation';

export default function AuthWrapper({ children }: { children: ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        // Logika ini sekarang terpusat di sini
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token) {
                // Redirect ke login jika tidak ada token
                window.location.href = "/login";
            } else {
                // Jika ada token, izinkan konten untuk ditampilkan
                setIsAuthorized(true);
            }
        }
    }, [pathname]); // Jalankan kembali saat path berubah untuk proteksi navigasi

    // Selama pengecekan, tampilkan loading spinner
    if (isAuthorized === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Setelah terotorisasi, tampilkan children (konten halaman admin)
    return <>{children}</>;
}