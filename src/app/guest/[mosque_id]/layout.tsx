"use client";

import { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer2";


interface MosqueData {
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

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function GuestLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const mosque_id = params?.mosque_id as string;

  const [location, setLocation] = useState<MosqueData | null>(null);

  useEffect(() => {
    if (!mosque_id) return;

    const fetchLocation = async () => {
      try {
        const res = await fetch(`${API}/api/about/guest/${mosque_id}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Gagal memuat data masjid.");
        }

        const json = await res.json();

        setLocation({
          latitude: json.latitude || "",
          longitude: json.longitude || "",
          name: json.name || "",
          address: json.address || "",
          description: json.description || "",
          image: json.image || "",
          phone_whatsapp: json.phone_whatsapp || "",
          email: json.email || "",
          facebook: json.facebook || "",
          instagram: json.instagram || "",
        });
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    };

    fetchLocation();
  }, [mosque_id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav
        style={{ backgroundColor: "var(--color-custom-blue)" }}
        className="text-white shadow-md"
      >
        <Navbar />
      </nav>

      <main className="w-full pt-0 pb-10">{children}</main>

      {/* Footer, kasih props location */}
      <Footer
        latitude={location?.latitude}
        longitude={location?.longitude}
        name={location?.name}
        address={location?.address}
        phone_whatsapp={location?.phone_whatsapp}
        email={location?.email}
        facebook={location?.facebook}
        instagram={location?.instagram}
        />

    </div>
  );
}
