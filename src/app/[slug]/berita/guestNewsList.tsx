"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NewsItem {
  contents_id: string;
  title: string;
  content_description: string;
  image: string;
  published_date: string;
  contents_type: string;
}

interface GuestNewsListProps {
  slug: string;
  mosqueName: string;
}

export default function GuestNewsList({ slug, mosqueName }: GuestNewsListProps) {
  const [berita, setBerita] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const itemsPerPage = 5;
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!slug || !API) return;

    const fetchBerita = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/guest/content/${slug}`);
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Gagal memuat berita");
        }

        const json = await res.json();
        const items = Array.isArray(json.data) ? json.data : [];
        const filtered = items.filter(
          (i: NewsItem) => i.contents_type === "berita"
        );

        const mapped = filtered
          .map((item: any) => ({
            ...item,
            id: item.contents_id,
            image: item.image
              ? item.image.startsWith("http")
                ? item.image
                : `${API}/uploads/${item.image}`
              : "",
          }))
          .sort(
            (a: NewsItem, b: NewsItem) =>
              new Date(b.published_date).getTime() -
              new Date(a.published_date).getTime()
          );

        setBerita(mapped);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat berita");
      } finally {
        setLoading(false);
      }
    };

    fetchBerita();
  }, [slug, API]);

  const totalPages = Math.ceil(berita.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = berita.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  if (loading) return <div className="p-4">Memuat berita...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header disesuaikan dengan PageHeader */}
      <div className="bg-[#EBF1F4] py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#0A1E4A] text-center">
            Tentang {mosqueName}
          </h1>
        </div>
      </div>

      {/* List berita */}
      <div className="max-w-6xl mx-auto mt-6 px-6 flex-grow">
        {berita.length === 0 ? (
          <p className="mt-8">Tidak ada berita untuk saat ini.</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
              Berita Terbaru
            </h2>
            <div className="space-y-6 mt-8">
              {currentItems.map((item) => (
                <div
                  key={item.contents_id}
                  className="bg-white rounded-xl shadow-md p-6 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() =>
                    router.push(`/${slug}/berita/${item.contents_id}`)
                  }
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                  )}
                  <p
                    className="text-sm mb-1"
                    style={{ color: "var(--color-custom-orange)" }}
                  >
                    {new Date(item.published_date).toLocaleDateString(
                      "id-ID",
                      { day: "2-digit", month: "long", year: "numeric" }
                    )}
                  </p>
                  <h2 className="text-2xl font-bold text-black mb-1">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                    {item.content_description}
                  </p>
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-custom-orange)" }}
                  >
                    Baca selengkapnya →
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-10 mb-20">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded text-white ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
                style={
                  currentPage === 1
                    ? {}
                    : { backgroundColor: "var(--color-custom-orange)" }
                }
              >
                Sebelumnya
              </button>
              <span className="text-gray-700">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded text-white ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
                style={
                  currentPage === totalPages
                    ? {}
                    : { backgroundColor: "var(--color-custom-orange)" }
                }
              >
                Selanjutnya
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
