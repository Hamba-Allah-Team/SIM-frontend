"use client"

import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function Navbar() {
    const pathname = usePathname();
    const params = useParams(); // 👈 1. Mengambil parameter dari URL
    const slug = params.slug as string; // 👈 Mengambil slug

    // 2. Menu sekarang tidak lagi hardcode '[slug]'
    const menu = [
        { label: "Home", href: `/${slug}` },
        { label: "Tentang", href: `/${slug}/tentang` },
        { label: "Berita", href: `/${slug}/berita` },
        { label: "Artikel", href: `/${slug}/artikel` },
        { label: "Kegiatan", href: `/${slug}/kegiatan` },
        { label: "Reservasi", href: `/${slug}/reservasi` },
        { label: "Kontak", href: `/${slug}/kontak` },
    ]

    return (
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg px-6 h-[72px] flex items-center justify-between">

                <Link href={`/${slug}`} className="flex items-center gap-2">
                    <Image src="/sima-icon.png" alt="Logo SIMA" width={32} height={32} />
                    <span className="text-xl font-bold text-[#1A1B4B]">SIMA</span>
                </Link>

                <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-1">
                    {menu.map((item) => {
                        // 3. Logika 'isActive' disesuaikan
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors
                                    ${isActive
                                        ? 'text-white bg-[#FF9357]'
                                        : 'text-[#1A1B4B] hover:bg-orange-50'
                                    }`
                                }
                            >
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="hidden md:flex items-center">
                    <Button asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button aria-label="Open menu">
                                <Menu className="w-6 h-6 text-[#1A1B4B]" />
                            </button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="bg-white text-[#1A1B4B] w-[260px] px-6 py-6"
                        >
                            <SheetHeader>
                                <SheetTitle className="text-lg font-bold text-[#1A1B4B]">
                                    Menu
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-6">
                                {menu.map((item) => (
                                    <SheetClose asChild key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="text-base font-medium text-[#1A1B4B] px-2 py-2 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </SheetClose>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}