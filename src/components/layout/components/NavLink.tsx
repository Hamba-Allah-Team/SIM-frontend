"use client" // Ini penting, karena menggunakan hook

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLink({ href, label }: { href: string, label: string }) {
    const pathname = usePathname();
    // Logika untuk halaman aktif yang lebih baik, menangani sub-halaman
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

    return (
        <Link
            href={href}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                ${isActive 
                    ? 'text-white bg-[#FF9357]' 
                    : 'text-[#1A1B4B] hover:bg-orange-50'
                }`
            }
        >
            {label}
        </Link>
    );
}