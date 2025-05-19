// app/(guest)/layout.tsx
import Navbar from "@/components/layout/Navbar";
import { ReactNode } from "react";

export default function GuestLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Tambahkan padding-top agar navbar tidak mepet atas */}
                <Navbar />

            {/* Konten halaman */}
            <main className="max-w-7xl mx-auto px-4 py-10">
                {children}
            </main>
        </div>
    );
}
