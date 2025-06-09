import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./components/MobileMenu"; // Impor menu mobile yang baru
import NavLink from "./components/Navlink";

// Komponen ini sekarang adalah Server Component murni
export default function Navbar({ slug }: { slug: string }) {
    const safeSlug = slug || 'default-masjid';

    const menu = [
        { label: "Home", href: `/${safeSlug}` },
        { label: "Tentang", href: `/${safeSlug}/tentang` },
        { label: "Berita", href: `/${safeSlug}/berita` },
        { label: "Artikel", href: `/${safeSlug}/artikel` },
        { label: "Kegiatan", href: `/${safeSlug}/kegiatan` },
        { label: "Reservasi", href: `/${safeSlug}/reservasi` },
        { label: "Kontak", href: "#kontak" },
    ];

    return (
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg px-6 h-[72px] flex items-center justify-between">
                <Link href={`/${safeSlug}`} className="flex items-center gap-2">
                    <Image src="/sima-icon.png" alt="Logo SIMA" width={32} height={32} />
                    <span className="text-xl font-bold text-[#1A1B4B]">SIMA</span>
                </Link>
                <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-1">
                    {menu.map((item) => (
                        <NavLink key={item.href} href={item.href} label={item.label} />
                    ))}
                </nav>
                <MobileMenu menu={menu} />
            </div>
        </header>
    );
}