// app/(guest)/layout.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

export default function GuestLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Tambahkan padding-top agar navbar tidak mepet atas */}
            <Navbar />

            {/* Konten halaman */}
            <main className="max-w-7xl mx-auto">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
