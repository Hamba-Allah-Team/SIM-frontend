"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GuestArticleList from "./guestArticleList";

interface MosqueData {
  id: string;
  name: string;
  // properti lain kalau ada
}

export default function ArtikelPage() {
  const { mosque_id } = useParams();
  const [mosqueName, setMosqueName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!mosque_id || !API) return;

    const fetchMosque = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/about/guest/${mosque_id}`, {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Gagal memuat data masjid");
        }

        const data = await res.json();
        setMosqueName(data.name || ""); // sesuaikan dengan response dari API
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchMosque();
  }, [mosque_id, API]);

  if (!mosque_id) return <div>Memuat...</div>;
  if (loading) return <div>Memuat data masjid...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return <GuestArticleList mosque_id={mosque_id as string} mosqueName={mosqueName} />;
}
