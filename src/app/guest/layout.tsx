// app/(guest)/layout.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

export default function GuestLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Tambahkan padding-top agar navbar tidak mepet atas */}
            <nav style={{ backgroundColor: 'var(--color-custom-blue)' }} className="text-white shadow-md">
                <Navbar />
            </nav>

            {/* Konten halaman */}
            <main className="w-full pt-0 pb-10">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
