import { Facebook, Instagram, Mail, MapPin, PhoneCall } from "lucide-react"
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
    // 1. Cek apakah ada setidaknya satu informasi kontak
    const hasContactInfo = masjidData.phone_whatsapp || masjidData.email || masjidData.facebook || masjidData.instagram;
    const hasMapInfo = masjidData.latitude && masjidData.longitude;

    return (
        <footer id="kontak" className="bg-[#1E1B4B] text-white py-10 px-6 md:px-12">
            <div className="container mx-auto flex flex-col gap-10">
                {/* Section Kontak dan Map */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Kontak */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">{masjidData.name}</h3>
                            <p className="text-sm text-white/80">
                                {masjidData.address}
                            </p>
                        </div>

                        {/* 2. Tampilkan bagian ini hanya jika ada data kontak */}
                        {hasContactInfo && (
                            <div>
                                <h4 className="font-semibold mb-2">Kontak</h4>
                                <div className="flex gap-4 text-orange-400">
                                    {masjidData.phone_whatsapp && <a href={`https://wa.me/${masjidData.phone_whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-white transition-colors"><PhoneCall size={20} /></a>}
                                    {masjidData.email && <a href={`mailto:${masjidData.email}`} aria-label="Email" className="hover:text-white transition-colors"><Mail size={20} /></a>}
                                    {masjidData.facebook && <a href={masjidData.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition-colors"><Facebook size={20} /></a>}
                                    {masjidData.instagram && <a href={masjidData.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors"><Instagram size={20} /></a>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Peta */}
                    <div className="flex flex-col md:items-end">
                        <h4 className="font-semibold mb-2 text-left md:text-right">Maps</h4>
                        {/* 3. Tampilkan peta jika ada data, jika tidak tampilkan placeholder */}
                        {hasMapInfo ? (
                            <div className="w-full max-w-sm aspect-video rounded-md overflow-hidden relative md:ml-auto">
                                <iframe
                                    src={`https://maps.google.com/maps?q=${masjidData.latitude},${masjidData.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                    loading="lazy"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="w-full aspect-video rounded-md bg-white/10 flex flex-col items-center justify-center text-center text-white/50">
                                <MapPin className="h-8 w-8 mb-2" />
                                <p>Lokasi Peta Tidak Tersedia</p>
                            </div>
                        )}
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