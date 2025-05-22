"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUserProfile } from "@/hooks/useUserProfile"
import {
    LayoutDashboard,
    FileText,
    Monitor,
    Dumbbell,
    Box,
    CalendarCheck,
    Wallet,
    CreditCard,
    Users,
    KeySquare,
    Clock,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

type MenuItem = {
    label: string
    icon: React.ReactNode
    href: string
}


function getMenuByRole(role: string): MenuItem[] {
    const isSuperadmin = role === "superadmin"

    return isSuperadmin
        ? [
            { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/superadmin/dashboard" },
            { label: "User", icon: <Users size={18} />, href: "/superadmin/user" },
            { label: "Aktivasi", icon: <KeySquare size={18} />, href: "/superadmin/activation" },
            { label: "Perpanjang", icon: <Clock size={18} />, href: "/superadmin/extension" },
        ]
        : [
            { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin/dashboard" },
            { label: "Informasi", icon: <FileText size={18} />, href: "/admin/informasi" },
            { label: "Konten", icon: <Monitor size={18} />, href: "/admin/content" },
            { label: "Kegiatan", icon: <Dumbbell size={18} />, href: "/admin/kegiatan" },
            { label: "Ruangan", icon: <Box size={18} />, href: "/admin/ruangan" },
            { label: "Reservasi", icon: <CalendarCheck size={18} />, href: "/admin/reservasi" },
            { label: "Dompet", icon: <Wallet size={18} />, href: "/admin/dompet" },
            { label: "Keuangan", icon: <CreditCard size={18} />, href: "/admin/keuangan" },
        ]
}

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname() || "/"
    const { profile, loading, error } = useUserProfile()

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <span>Memuat sidebar...</span>
            </div>
        )
    }

    if (error || !profile?.role) {
        return (
            <div className="h-screen flex items-center justify-center text-red-500">
                {error || "Gagal memuat role pengguna"}
            </div>
        )
    }

    const menuItems = getMenuByRole(profile.role)

    return (
        <div className="relative h-screen">
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 z-10 bg-white border rounded-full p-1 shadow-md hover:bg-gray-50 transition text-black"
            >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <aside
                className={`h-full transition-all duration-300 bg-white shadow-md rounded-2xl p-4 flex flex-col gap-6 ${collapsed ? "w-20 items-center" : "w-64"
                    }`}
            >
                {/* Logo */}
                <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
                    <Image src="/sima-icon.png" alt="Logo SIMA" width={32} height={32} />
                    {!collapsed && <span className="text-xl font-bold text-[#1B1B3A]">SIMA</span>}
                </div>

                {/* Section Label */}
                {!collapsed && (
                    <div className="text-xs text-black uppercase tracking-wide font-semibold">
                        {profile.role === "superadmin" ? "Superadmin" : "General"}
                    </div>
                )}

                {/* Menu */}
                <nav className="flex flex-col gap-2 w-full">
                    {menuItems.map(({ label, icon, href }) => {
                        const isActive = pathname === href || pathname.startsWith(href + "/")
                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${isActive ? "bg-orange-100 text-orange-500" : "text-[#1B1B3A] hover:bg-gray-100"}
                  ${collapsed ? "justify-center" : ""}`}
                            >
                                {icon}
                                {!collapsed && <span>{label}</span>}
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </div>
    )
}
