import { Facebook, Instagram, Mail, PhoneCall } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingFooter() {
    return (
        <footer className="bg-[#0A1E4A] text-white pt-16 pb-8 px-6 md:px-12">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Kolom 1: Logo & Deskripsi */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Image src="/sima-icon.png" alt="Logo SIMA" width={32} height={32} />
                            <span className="font-bold text-xl text-white">SIMA</span>
                        </div>
                        <p className="text-sm text-white/70 max-w-md">Platform terintegrasi untuk manajemen masjid yang modern, efisien, dan transparan.</p>
                    </div>

                    {/* Kolom 2: Layanan */}
                    <div>
                        <h4 className="font-semibold mb-4">Layanan</h4>
                        <ul className="space-y-2 text-sm text-white/70">
                            <li><Link href="#fitur" className="hover:text-white transition-colors">Fitur</Link></li>
                            <li><Link href="#harga" className="hover:text-white transition-colors">Harga</Link></li>
                            {/* <li><Link href="#" className="hover:text-white transition-colors">Dokumentasi</Link></li> */}
                        </ul>
                    </div>

                    {/* Kolom 3: Hubungi Kami */}
                    <div>
                        <h4 className="font-semibold mb-4">Hubungi Kami</h4>
                        <div className="flex gap-4 text-[#FF9357]">
                            <a href="#" aria-label="WhatsApp" className="hover:text-white transition-colors"><PhoneCall size={20} /></a>
                            <a href="#" aria-label="Email" className="hover:text-white transition-colors"><Mail size={20} /></a>
                            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                        </div>
                    </div>
                </div>

                <hr className="my-8 border-white/20" />

                <div className="text-center text-sm text-white/70">
                    © Copyright All Rights Reserved {new Date().getFullYear()}
                </div>
            </div>
        </footer>
    )
}