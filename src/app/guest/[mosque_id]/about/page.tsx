"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AboutSection from "./aboutSection";

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
  const mosque_id = params?.mosque_id as string;
  const [data, setData] = useState<AboutSectionProps["data"] | null>(null);

  useEffect(() => {
    if (!mosque_id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/api/about/guest/${mosque_id}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Gagal memuat data masjid.");
        }

        const json = await res.json();

        const formattedData = {
          name: json.name,
          image: json.image
            ? json.image.startsWith("http")
              ? json.image
              : `${API}/uploads/${json.image}`
            : undefined,
          description: json.description,
        };

        setData(formattedData);
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    };

    fetchData();
  }, [mosque_id]);

  if (!data) return <div className="text-center py-5">Loading...</div>;

  return <AboutSection data={data} />;
}
