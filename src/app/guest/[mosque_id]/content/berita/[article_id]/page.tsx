"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CalendarDays, Clock4, LayoutDashboard, MoveLeft } from 'lucide-react';

interface NewsDetail {
  id: string;
  title: string;
  image: string;
  published_date: string; // contoh: "2023-06-05T10:00:00Z"
  contents_type: string;
  content_full: string; // isi lengkap berita
}

export default function GuestNewsDetail() {
  const params = useParams();
  const { mosque_id, article_id } = params;
  const router = useRouter();

  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!mosque_id || !article_id) return;

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
        const res = await fetch(`${API}/api/guest/content/${mosque_id}/${article_id}`);
        if (!res.ok) {
            const errText = await res.text();
            // Cek apakah error mengandung pesan "Artikel tidak ditemukan"
            if (errText.includes("Artikel tidak ditemukan")) {
            throw new Error("not_found");
            } else {
            throw new Error(`Gagal fetch data: ${errText}`);
            }
        }
        const data = await res.json();

        if (!data.data) {
            throw new Error("not_found");
        }

        let imageUrl = data.data.image;
        if (imageUrl && !imageUrl.startsWith("http")) {
            imageUrl = `${API}/uploads/${imageUrl}`;
        }

        setNews({
            ...data.data,
            image: imageUrl,
            content_full: data.data.content_full || data.data.content_description || "",
        });
        } catch (err: any) {
        if (err.message === "not_found") {
            setError("not_found");
        } else {
            setError(err.message || "Terjadi kesalahan saat memuat artikel");
        }
        } finally {
        setLoading(false);
        }
    };

    fetchNews();
    }, [mosque_id, article_id, API]);

    if (loading) return <div className="p-4">Memuat detail artikel...</div>;
    if (error === "not_found")
    return <div className="p-4 text-center text-gray-700 font-semibold">Artikel / Berita tidak ada.</div>;
    if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
    if (!news) return <div className="p-4">Artikel tidak ditemukan.</div>;

  // Parsing tanggal & jam dari published_date
  const publishedDate = new Date(news.published_date);
  const tanggal = publishedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const jam = publishedDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {/* Tombol Kembali di luar kontainer utama */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <button
          className="flex items-center gap-2 text-base text-black hover:text-orange-600 font-medium mb-2"
          onClick={() => router.push(`/guest/${mosque_id}/content/berita`)}
        >
          <MoveLeft size={22} />
          <span>Kembali</span>
        </button>
      </div>

    <div className="max-w-5xl pt-6 mx-auto p-6 space-y-12">
       {/* Gambar */}
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-100 object-cover rounded-lg mb-8"
        />
        )}

      {/* Judul */}
      <h1 className="text-4xl font-bold mb-10 text-black">{news.title}</h1>

      {/* 3 Card kecil dalam 1 baris */}
        <div className="flex gap-4 mb-10">
        <div className="flex-1 bg-gray-200 p-4 rounded rounded-xl flex items-center gap-3 text-black">
            <CalendarDays className="text-black" size={24} />
            <div>
            <p className="text-sm text-black">Tanggal Rilis</p>
            <p className="font-semibold text-black">{tanggal}</p>
            </div>
        </div>
        <div className="flex-1 bg-gray-200 p-4 rounded-xl shadow flex items-center gap-3 text-black">
            <Clock4 className="text-black" size={24} />
            <div>
            <p className="text-sm text-black">Jam Rilis</p>
            <p className="font-semibold text-black">{jam}</p>
            </div>
        </div>
        <div className="flex-1 bg-gray-200 p-4 rounded-xl shadow flex items-center gap-3 text-black">
            <LayoutDashboard className="text-black" size={24} />
            <div>
            <p className="text-sm text-black">Jenis Konten</p>
            <p className="font-semibold capitalize text-black">{news.contents_type}</p>
            </div>
        </div>
        </div>

      {/* Isi / deskripsi konten */}
      <div
        className="prose max-w-none"
        style={{ color: 'black' }}
        dangerouslySetInnerHTML={{ __html: news.content_full }}
      />
    </div>
    </>
  );
}
