"use client"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState, useCallback } from "react"

const menu = [
    { label: "Fitur", href: "#fitur" },
    { label: "Harga", href: "#harga" },
]
// 1. Komponen NavLink sekarang menjadi lebih sederhana
// Ia hanya menerima status 'isActive' dari induknya
function LandingNavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
    return (
        <Link
            href={href}
            className={`relative px-3 py-2 text-sm font-semibold transition-colors
                ${isActive
                    ? 'text-[#FF9357]'
                    : 'text-[#1A1B4B] hover:text-[#FF9357]'
                }`
            }
        >
            {label}
            {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-[#FF9357] rounded-full"></span>
            )}
        </Link>
    );
}


export default function ActivationNavbar() {
    // 2. State untuk melacak section yang aktif berdasarkan scroll
    const [activeSection, setActiveSection] = useState("");

    const handleScroll = useCallback(() => {
        const sections = menu.map(item => document.getElementById(item.href.substring(1)));
        const scrollPosition = window.scrollY + 150; // Offset agar aktif sedikit lebih cepat

        let currentSection = "";

        for (const section of sections) {
            if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
                currentSection = `#${section.id}`;
                break;
            }
        }
        setActiveSection(currentSection);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Panggil sekali saat load untuk menandai section teratas
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg px-6 h-[72px] flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/sima-icon.png" alt="Logo SIMA" width={32} height={32} />
                    <span className="text-xl font-bold text-[#1A1B4B]">SIMA</span>
                </Link>

                <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-1">
                    {menu.map((item) => (
                        // 3. Meneruskan status aktif ke komponen NavLink
                        <LandingNavLink key={item.href} href={item.href} label={item.label} isActive={activeSection === item.href} />
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-2">
                    <Button variant="outline" asChild className="bg-white border-[#FF9357] text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357] rounded-full">
                        <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild className="bg-white border-[#FF9357] text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357] rounded-full">
                        <Link href="/activation/extend">Perbarui</Link>
                    </Button>
                    <Button asChild className="bg-[#FF9357] hover:bg-[#FF9357]/90 text-white font-semibold rounded-full">
                        <Link href="/activation/register">Daftar</Link>
                    </Button>
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button aria-label="Open menu"><Menu className="w-6 h-6 text-[#1A1B4B]" /></button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-white text-[#1A1B4B] w-[260px] px-6 py-6">
                            <SheetHeader><SheetTitle className="text-lg font-bold text-[#1A1B4B]">Menu</SheetTitle></SheetHeader>
                            <div className="flex flex-col gap-4 mt-6">
                                {menu.map((item) => (
                                    <SheetClose asChild key={item.href}><Link href={item.href} className="text-base font-medium text-[#1A1B4B] px-2 py-2 rounded hover:bg-gray-100">{item.label}</Link></SheetClose>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}