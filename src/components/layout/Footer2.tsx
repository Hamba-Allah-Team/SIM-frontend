import { Facebook, Instagram, Mail, PhoneCall } from "lucide-react";
import Image from "next/image";

interface FooterProps {
  latitude?: string;
  longitude?: string;
  name?: string;
  address?: string;
  description?: string;
  image?: string;
  phone_whatsapp?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
}

export default function Footer({
  latitude,
  longitude,
  name,
  address,
  phone_whatsapp,
  email,
  facebook,
  instagram,
}: FooterProps) {
  const hasValidLocation =
    latitude && longitude && latitude !== "" && longitude !== "";

  return (
    <footer className="bg-[#1E1B4B] text-white py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Section Kontak dan Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Kontak */}
          <div className="space-y-4">
            <div className="mt-4">
              <h3 className="text-lg font-semibold">{name || "Masjid"}</h3>
              <p className="text-sm">{address || "Alamat tidak tersedia"}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold">Kontak</h3>
              <div className="space-y-3 text-sm mt-4">
                {phone_whatsapp && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <PhoneCall size={20} />
                    <span>{phone_whatsapp}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <Mail size={20} />
                    <span>{email}</span>
                  </div>
                )}
                {facebook && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <Facebook size={20} />
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Facebook
                    </a>
                  </div>
                )}
                {instagram && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <Instagram size={20} />
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Instagram
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Peta */}
          <div className="flex justify-center md:justify-end">
            {hasValidLocation ? (
              <div className="w-120 h-90 rounded-md overflow-hidden relative">
                <h4 className="font-semibold mb-2 absolute -top-6 left-0 md:static md:mb-2">
                  Maps
                </h4>
                <iframe
                  src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                  className="absolute top-0 left-0 w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  title="Google Maps Location"
                />
              </div>
            ) : (
              <p className="text-white/70 italic">Lokasi peta tidak tersedia.</p>
            )}
          </div>
        </div>

        {/* Garis */}
        <hr className="border-white/20" />

        {/* Bagian bawah */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/sima-icon.png" alt="Logo" width={28} height={28} />
            <span className="font-bold text-lg text-white">SIMA</span>
          </div>
          <p className="text-sm text-white/70 text-center md:text-right">
            © Copyright All Rights Reserved 2024
          </p>
        </div>
      </div>
    </footer>
  );
}
