// src/app/admin/layout.tsx (atau app/(admin)/layout.tsx)

import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        // 1. Mengganti bg-gray-50 dengan bg-background yang theme-aware
        <div className="flex min-h-screen bg-background p-4">

            {/* 2. Menghapus <Toaster /> dari sini. 
                Cukup satu Toaster di RootLayout (app/layout.tsx) */}

            {/* Floating Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 min-w-0 md:pl-4"> {/* Menambahkan padding kiri untuk desktop */}
                {/* Topbar */}
                <Topbar />

                {/* Main Content Area */}
                <div className="mt-4">
                    {children}
                </div>
            </main>
        </div>
    )
}
