"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GuestNewsList from "./guestArticleList";

export default function BeritaPage() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const [mosqueName, setMosqueName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!slug || !API) return;

    const fetchMosque = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/public/mosques/${slug}`);
        if (!res.ok) {
          throw new Error(`Masjid dengan slug "${slug}" tidak ditemukan`);
        }
        const json = await res.json();
        setMosqueName(json.data.name);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data masjid");
      } finally {
        setLoading(false);
      }
    };

    fetchMosque();
  }, [slug, API]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-[#EBF1F4] py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#0A1E4A] text-center">
            Artikel
          </h1>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow">
        {error ? (
          <div className="text-center text-red-600 mt-8">{error}</div>
        ) : loading ? (
          <div className="text-center text-gray-500 mt-8">Memuat data masjid...</div>
        ) : (
          <GuestNewsList slug={slug as string} mosqueName={mosqueName} />
        )}
      </main>
    </div>
  );
}
