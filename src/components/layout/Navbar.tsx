// components/Navbar.tsx
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
        <header className="w-full py-6">
            <div className="bg-white rounded-2xl shadow-lg h-[72px] px-8 grid grid-cols-3 flex items-center max-w-7xl mx-auto">
                {/* Logo + Judul */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/sima-icon.png"
                        alt="Logo SIMA"
                        width={32}
                        height={32}
                    />
                    <span className="text-xl font-bold text-[#1A1B4B]">SIMA</span>
                </div>

                {/* Menu Navigasi */}
                <nav className="flex justify-center gap-6">
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
            </div>
        </header>
    )
}
