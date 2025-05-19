// app/(admin)/layout.tsx

import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50 p-4">
            {/* Floating Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 pl-5">
                {/* Topbar */}
                <Topbar />

                {/* Main Content Area */}
                {children}
            </main>
        </div>
    )
}
