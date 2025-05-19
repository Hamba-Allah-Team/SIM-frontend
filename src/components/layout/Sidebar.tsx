// components/layout/Sidebar.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    LayoutDashboard,
    FileText,
    Monitor,
    Dumbbell,
    Box,
    CalendarCheck,
    Wallet,
    CreditCard,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

const menu = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
    { label: "Informasi", icon: <FileText size={18} />, href: "/informasi" },
    { label: "Konten", icon: <Monitor size={18} />, href: "/konten" },
    { label: "Kegiatan", icon: <Dumbbell size={18} />, href: "/kegiatan" },
    { label: "Ruangan", icon: <Box size={18} />, href: "/ruangan" },
    { label: "Reservasi", icon: <CalendarCheck size={18} />, href: "/reservasi" },
    { label: "Dompet", icon: <Wallet size={18} />, href: "/dompet" },
    { label: "Keuangan", icon: <CreditCard size={18} />, href: "/keuangan" },
]

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const activePath = "/dashboard" // Ganti nanti dengan usePathname() dari next/navigation

    return (
        <div className="relative h-screen">
            {/* Floating Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 z-10 bg-white border rounded-full p-1 shadow-md hover:bg-gray-50 transition"
            >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Sidebar */}

            <aside
                className={`h-full transition-all duration-300 bg-white shadow-md rounded-2xl p-4 flex flex-col gap-6
        ${collapsed ? "w-20 items-center" : "w-64"}`}
            >

                {/* Logo */}
                <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
                    <Image src="/sima-icon.png" alt="Logo SIMA" width={32} height={32} />
                    {!collapsed && <span className="text-xl font-bold text-[#1B1B3A]">SIMA</span>}
                </div>

                {/* Section Label */}
                {!collapsed && (
                    <div className="text-xs text-black uppercase tracking-wide font-semibold">
                        General
                    </div>
                )}

                {/* Menu */}
                <nav className="flex flex-col gap-2 w-full">
                    {menu.map((item) => {
                        const isActive = item.href === activePath
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${isActive
                                        ? "bg-orange-100 text-orange-500"
                                        : "text-[#1B1B3A] hover:bg-gray-100"}
                ${collapsed ? "justify-center" : ""}`}
                            >
                                {item.icon}
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </div>
    )
}
