// app/(guest)/layout.tsx
import Navbar from "@/components/layout/Navbar"
import { ReactNode } from "react"

export default function GuestLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    )
}
