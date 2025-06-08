import { Facebook, Instagram, Mail, PhoneCall } from "lucide-react"
import Image from "next/image"

// 👈 1. Menambahkan interface untuk props
interface FooterProps {
    masjidData: {
        name: string;
        address: string;
        phone_whatsapp?: string;
        email?: string;
        facebook?: string;
        instagram?: string;
        longitude?: number;
        latitude?: number;
    }
}

export default function Footer({ masjidData }: FooterProps) {
    return (
        <footer className="bg-[#1E1B4B] text-white py-10 px-6 md:px-12">
            <div className="container mx-auto flex flex-col gap-10">
                {/* Section Kontak dan Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Kontak */}
                    <div className="space-y-4">
                        <div>
                            {/* 👈 2. Menggunakan data dinamis */}
                            <h3 className="text-lg font-semibold">{masjidData.name}</h3>
                            <p className="text-sm text-white/80">
                                {masjidData.address}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Kontak</h4>
                            <div className="flex gap-4 text-orange-400">
                                {masjidData.phone_whatsapp && <a href={`https://wa.me/${masjidData.phone_whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><PhoneCall size={20} /></a>}
                                {masjidData.email && <a href={`mailto:${masjidData.email}`} aria-label="Email"><Mail size={20} /></a>}
                                {masjidData.facebook && <a href={masjidData.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a>}
                                {masjidData.instagram && <a href={masjidData.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>}
                            </div>
                        </div>
                    </div>

                    {/* Peta */}
                    <div className="flex justify-center md:justify-end">
                        <div className="w-full max-w-sm aspect-video rounded-md overflow-hidden relative">
                            <h4 className="font-semibold mb-2 absolute -top-8 left-0 md:static md:mb-2">Maps</h4>
                            <iframe
                                src={`https://maps.google.com/maps?q=${masjidData.latitude},${masjidData.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                className="absolute top-0 left-0 w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>

                {/* Garis */}
                <hr className="border-white/20" />

                {/* Bagian bawah */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Image src="/sima-icon.png" alt="Logo" width={28} height={28} />
                        <span className="font-bold text-lg text-white">SIMA</span>
                    </div>

                    {/* Hak Cipta */}
                    <p className="text-sm text-white/70 text-center md:text-right">
                        © Copyright All Rights Reserved 2024
                    </p>
                </div>
            </div>
        </footer>
    )
}