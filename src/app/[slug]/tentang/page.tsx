"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AboutSection from "./aboutSection"; // sesuaikan path jika berbeda

interface AboutSectionProps {
  data: {
    name: string;
    image?: string;
    description?: string;
  };
}

const API = process.env.NEXT_PUBLIC_API_URL || "";

export default function AboutPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [data, setData] = useState<AboutSectionProps["data"] | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/api/public/mosques/${slug}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Gagal memuat data masjid.");
        }

        const json = await res.json();

        const formattedData = {
          name: json.data.name,
          image: json.data.image
            ? json.data.image.startsWith("http")
              ? json.data.image
              : `${API}/uploads/${json.data.image}`
            : undefined,
          description: json.data.description,
        };

        setData(formattedData);
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    };

    fetchData();
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-[#EBF1F4] py-16 pt-32">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-[#0A1E4A] text-center">
              Tentang {data ? data.name : "Masjid"}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {!data ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <AboutSection data={data} />
          )}
        </div>
      </main>
    </div>
  );
}
