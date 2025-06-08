"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import GuestNewsList from "./guestNewsList";

export default function BeritaPage() {
  // useParams dapat string atau string[], pastikan menjadi string
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

  if (!slug) return <div>Memuat...</div>;
  if (loading) return <div>Memuat data masjid...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  // slug sekarang pasti string
  return <GuestNewsList slug={slug} mosqueName={mosqueName} />;
}
