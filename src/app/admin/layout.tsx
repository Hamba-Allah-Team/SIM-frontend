// src/app/admin/layout.tsx (atau app/(admin)/layout.tsx)

import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
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
