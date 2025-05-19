// app/(admin)/layout.tsx

import Sidebar from "@/components/layout/Sidebar"
import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50 p-4">
            {/* Floating Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 ml-4 p-6 bg-white rounded-xl shadow-sm">
                {children}
            </main>
        </div>
    )
}
