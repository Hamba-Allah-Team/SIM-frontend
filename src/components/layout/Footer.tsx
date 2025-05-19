// src/components/layout/Footer.tsx
import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#0C0839] text-white px-6 py-10 mt-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Info Masjid */}
                <div>
                    <h3 className="text-lg font-semibold">Masjid xxx</h3>
                    <p className="text-sm mt-2">
                        Jl. Melati No. 10, RT 02/RW 03, Kel. Cempaka Putih,<br />
                        Kec. Kemayoran, Jakarta Pusat
                    </p>

                    <div className="mt-6">
                        <h4 className="font-medium mb-2">Kontak</h4>
                        <div className="flex space-x-3 text-orange-400">
                            <a href="#"><Phone size={18} /></a>
                            <a href=""><Mail size={18} /></a>
                            <a href=""><Facebook size={18} /></a>
                            <a href=""><Instagram size={18} /></a>
                            <a href=""><Youtube size={18} /></a>
                        </div>
                    </div>
                </div>

                {/* Kosong sebagai pemisah di tengah */}
                <div />

                {/* Google Maps */}
                <div>
                    <h4 className="font-medium mb-2">Maps</h4>
                    <iframe
                        title="Google Maps"
                        className="w-full h-40 rounded-md"
                        src="https://maps.google.com/maps?q=birmingham&t=&z=13&ie=UTF8&iwloc=&output=embed"
                        loading="lazy"
                    />
                </div>
            </div>

            {/* Divider */}
            <hr className="border-t border-white/20 my-8" />

            {/* Footer Bottom */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                {/* Logo SIMA */}
                <div className="flex items-center space-x-2">
                    <Image src="/sima-icon.png" alt="Logo SIMA" width={30} height={30} />
                    <span className="text-lg font-semibold text-white">SIMA</span>
                </div>

                {/* Copyright */}
                <p className="text-sm text-white/70 mt-4 md:mt-0">
                    © Copyright All Rights Reserved 2024
                </p>
            </div>
        </footer>
    );
}
