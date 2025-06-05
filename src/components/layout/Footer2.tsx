// components/layout/Footer.tsx
import { Facebook, Instagram, Mail, PhoneCall } from "lucide-react";
import Image from "next/image";

interface FooterProps {
  latitude?: string;
  longitude?: string;
}

export default function Footer({ latitude, longitude }: FooterProps) {
  // Cek apakah latitude dan longitude ada dan tidak kosong
  const hasValidLocation = latitude && longitude && latitude !== "" && longitude !== "";

  return (
    <footer className="bg-[#1E1B4B] text-white py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Section Kontak dan Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Kontak */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Masjid xxx</h3>
              <p className="text-sm">
                Jl. Melati No. 10, RT 02/RW 03, Kel. Cempaka Putih, Kec. Kemayoran, Jakarta Pusat
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Kontak</h4>
              <div className="flex gap-3 text-orange-400">
                <PhoneCall size={20} />
                <Mail size={20} />
                <Facebook size={20} />
                <Instagram size={20} />
              </div>
            </div>
          </div>

          {/* Peta */}
          <div className="flex justify-center md:justify-end">
            {hasValidLocation ? (
              <div className="w-full max-w-sm md:aspect-square aspect-video rounded-md overflow-hidden relative">
                <h4 className="font-semibold mb-2 absolute -top-6 left-0 md:static md:mb-2">Maps</h4>
                <iframe
                  src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                  className="absolute top-0 left-0 w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  title="Google Maps Location"
                />
              </div>
            ) : (
              // Kalau mau sembunyikan map, bisa kosong atau tampilkan pesan ini
              <p className="text-white/70 italic">Lokasi peta tidak tersedia.</p>
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
  );
}
