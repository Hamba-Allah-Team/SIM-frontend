// app/(admin)/layout.tsx

import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import { ReactNode } from "react"
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50 p-4">
            <Toaster />
            {/* Floating Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 overflow-auto">
                {/* Topbar */}
                <Topbar />

                <Toaster
                    position="top-right"
                    richColors
                    toastOptions={{
                    duration: 4000,
                    style: {
                        fontWeight: "bold",
                    },
                    }}
                />
                            
               {/* Main Content Area */}
                <div className="mt-4">
                {children}
                </div>
            </main>
        </div>
    )
}
