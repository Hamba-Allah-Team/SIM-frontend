// src/app/admin/layout.tsx (atau app/(admin)/layout.tsx)
"use client";

import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import { ReactNode, useEffect, useState } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
            } else {
                setIsAuthorized(true);
            }
        }
    }, []);

    if (isAuthorized === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }
    return (
        // 1. Latar belakang diubah kembali menjadi abu-abu terang yang statis.
        // Ini akan menjadi dasar untuk semua halaman admin.
        <div className="flex min-h-screen bg-gray-50 pl-4">

            <Sidebar />

            <main className="flex-1 min-w-0 p-4 overflow-y-auto">
                <Topbar />

                <div className="mt-4">
                    {children}
                </div>
            </main>
        </div>
    )
}
