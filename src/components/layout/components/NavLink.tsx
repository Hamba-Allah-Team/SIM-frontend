"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLink({ href, label }: { href: string, label: string }) {
    const pathname = usePathname();

    // 👈 1. Logika 'isActive' diperbarui
    // Untuk "Home", path harus sama persis. Untuk yang lain, bisa dimulai dengan path tersebut.
    const isHome = label === "Home";
    const isActive = isHome
        ? pathname === href
        : pathname.startsWith(href);

    return (
        <Link
            href={href}
            // 👈 2. Styling diubah untuk tampilan yang lebih elegan
            className={`relative px-3 py-2 text-sm font-semibold transition-colors
                ${isActive
                    ? 'text-[#FF9357]'
                    : 'text-[#1A1B4B] hover:text-[#FF9357]'
                }`
            }
        >
            {label}
            {/* Garis bawah yang hanya muncul saat aktif */}
            {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-[#FF9357] rounded-full"></span>
            )}
        </Link>
    );
}