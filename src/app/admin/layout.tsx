// src/app/admin/layout.tsx (atau app/(admin)/layout.tsx)
"use client";

import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import AuthWrapper from "@/components/layout/AuthWrapper";
import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AuthWrapper>
            <div className="flex min-h-screen bg-gray-50 pl-4">
                <Sidebar />
                <main className="flex-1 min-w-0 p-4 overflow-y-auto">
                    <Topbar />
                    <div className="mt-4">
                        {children}
                    </div>
                </main>
            </div>
        </AuthWrapper>
    )
}
