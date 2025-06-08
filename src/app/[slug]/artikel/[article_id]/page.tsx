"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Clock4, LayoutDashboard, MoveLeft } from "lucide-react";

interface ArticleDetail {
  id: string;
  title: string;
  image: string;
  published_date: string;
  contents_type: string;
  content_full: string;
  mosque_name?: string;  // tambahan kalau ada nama masjid di data
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;
  const article_id = params.article_id as string;

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!slug || !article_id || !API) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/guest/content/${slug}/${article_id}`);

        if (!res.ok) {
          const errText = await res.text();
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

        setArticle({
          ...data.data,
          image: imageUrl,
          content_full: data.data.content_full || data.data.content_description || "",
          mosque_name: data.data.mosque_name || null,
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

    fetchArticle();
  }, [slug, article_id, API]);

  const publishedDate = article ? new Date(article.published_date) : null;
  const tanggal = publishedDate?.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const jam = publishedDate?.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mosqueName = article?.mosque_name || "Masjid";

  return (
    <>
      {/* Header disesuaikan dengan PageHeader */}
      <div className="bg-[#EBF1F4] py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#0A1E4A] text-center">
            
          </h1>
        </div>
      </div>

      {/* Tombol Kembali di luar kontainer utama */}
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <button
          className="flex items-center gap-2 text-base text-black hover:text-orange-600 font-medium mb-2"
          onClick={() => router.push(`/${slug}/artikel`)}
        >
          <MoveLeft size={22} />
          <span>Kembali</span>
        </button>
      </div>

      <main className="min-h-screen max-w-5xl mx-auto p-6 pt-10 space-y-12">
        {/* Loading */}
        {loading && <div>Memuat detail artikel...</div>}

        {/* Error jika data tidak ditemukan */}
        {!loading && error === "not_found" && (
          <p className="mt-8 text-gray-500 text-center font-semibold">
            Artikel / Berita tidak ada.
          </p>
        )}

        {/* Error selain not_found */}
        {!loading && error && error !== "not_found" && (
          <p className="mt-8 text-gray-500 text-center">
            Tidak ada artikel / berita untuk saat ini.
          </p>
        )}

        {/* Konten Artikel */}
        {!loading && !error && article && article.contents_type === "artikel" && (
        <>
            {article.image && (
            <img
                src={article.image}
                alt={article.title}
                className="w-full h-100 object-cover rounded-lg mb-8"
            />
            )}

            <h1 className="text-4xl font-bold mb-10 text-black">{article.title}</h1>

            <div className="flex gap-4 mb-10">
            <div className="flex-1 bg-gray-200 p-4 rounded-xl flex items-center gap-3 text-black">
                <CalendarDays size={24} />
                <div>
                <p className="text-sm">Tanggal Rilis</p>
                <p className="font-semibold">{tanggal}</p>
                </div>
            </div>
            <div className="flex-1 bg-gray-200 p-4 rounded-xl flex items-center gap-3 text-black">
                <Clock4 size={24} />
                <div>
                <p className="text-sm">Jam Rilis</p>
                <p className="font-semibold">{jam}</p>
                </div>
            </div>
            <div className="flex-1 bg-gray-200 p-4 rounded-xl flex items-center gap-3 text-black">
                <LayoutDashboard size={24} />
                <div>
                <p className="text-sm">Jenis Konten</p>
                <p className="font-semibold capitalize">{article.contents_type}</p>
                </div>
            </div>
            </div>

            <div
            className="prose max-w-none mb-20"
            style={{ color: "black" }}
            dangerouslySetInnerHTML={{ __html: article.content_full }}
            />
        </>
        )}

        {/* Jika tipe konten bukan artikel */}
        {!loading && !error && article && article.contents_type !== "artikel" && (
        <p className="mt-8 text-gray-500 text-center ">
            Artikel tidak ditemukan.
        </p>
        )}
      </main>
    </>
  );
}
