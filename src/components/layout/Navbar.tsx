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

const menu = [
    { label: "Home", href: "/" },
    { label: "Tentang", href: "/tentang" },
    { label: "Berita", href: "/berita" },
    { label: "Artikel", href: "/artikel" },
    { label: "Kegiatan", href: "/kegiatan" },
    { label: "Reservasi", href: "/reservasi" },
    { label: "Kontak", href: "/kontak" },
]

export default function Navbar() {
    return (
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg px-6 h-[72px] flex items-center justify-between">
                
                {/* Logo - Kiri */}
                <div className="flex items-center gap-2">
                    <Image src="/sima-icon.png" alt="Logo SIMA" width={32} height={32} />
                    <span className="text-xl font-bold text-[#1A1B4B]">SIMA</span>
                </div>

                {/* Desktop Nav - Tengah */}
                <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
                    {menu.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-semibold text-[#1A1B4B] hover:underline"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Drawer (Mobile) - Kanan */}
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

// import { Menu } from "lucide-react"
// import {
//     Sheet,
//     SheetContent,
//     SheetTrigger,
//     SheetClose,
//     SheetHeader,
//     SheetTitle,
// } from "@/components/ui/sheet"
// import Image from "next/image"
// import Link from "next/link"

// const menu = [
//     { label: "Home", href: "/" },
//     { label: "Tentang", href: "/tentang" },
//     { label: "Berita", href: "/berita" },
//     { label: "Artikel", href: "/artikel" },
//     { label: "Kegiatan", href: "/kegiatan" },
//     { label: "Reservasi", href: "/reservasi" },
//     { label: "Kontak", href: "/kontak" },
// ]

// export default function Navbar() {
//     return (
//         <header className="w-full py-6">
//             <div className="relative bg-white rounded-2xl shadow-lg h-[72px] px-6 flex items-center justify-between max-w-7xl mx-auto">

//                 {/* Logo - Kiri */}
//                 <div className="flex items-center gap-2">
//                     <Image src="/sima-icon.png" alt="Logo SIMA" width={32} height={32} />
//                     <span className="text-xl font-bold text-[#1A1B4B]">SIMA</span>
//                 </div>

//                 {/* Desktop Nav - Tengah */}
//                 <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
//                     {menu.map((item) => (
//                         <Link
//                             key={item.href}
//                             href={item.href}
//                             className="text-sm font-semibold text-[#1A1B4B] hover:underline"
//                         >
//                             {item.label}
//                         </Link>
//                     ))}
//                 </nav>

//                 {/* Drawer (Mobile) - Kanan */}
//                 <div className="md:hidden">
//                     <Sheet>
//                         <SheetTrigger asChild>
//                             <button aria-label="Open menu">
//                                 <Menu className="w-6 h-6 text-[#1A1B4B]" />
//                             </button>
//                         </SheetTrigger>
//                         <SheetContent
//                             side="right"
//                             className="bg-white text-[#1A1B4B] w-[260px] px-6 py-6"
//                         >
//                             <SheetHeader>
//                                 <SheetTitle className="text-lg font-bold text-[#1A1B4B]">
//                                     Menu
//                                 </SheetTitle>
//                             </SheetHeader>
//                             <div className="flex flex-col gap-4 mt-6">
//                                 {menu.map((item) => (
//                                     <SheetClose asChild key={item.href}>
//                                         <Link
//                                             href={item.href}
//                                             className="text-base font-medium text-[#1A1B4B] px-2 py-2 rounded hover:bg-gray-100 transition-colors"
//                                         >
//                                             {item.label}
//                                         </Link>
//                                     </SheetClose>
//                                 ))}
//                             </div>
//                         </SheetContent>
//                     </Sheet>
//                 </div>
//             </div>
//         </header>

//     )
// }
