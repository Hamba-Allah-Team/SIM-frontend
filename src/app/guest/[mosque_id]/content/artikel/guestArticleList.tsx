"use client";

import { useEffect, useState } from "react";

interface ArticleItem {
  id: string;
  title: string;
  content_description: string;
  image: string;
  published_date: string;
  contents_type: string;
}

interface GuestArticleListProps {
  mosque_id: string;
  mosqueName: string;
}

export default function GuestArticleList({ mosque_id, mosqueName }: GuestArticleListProps) {
  const [artikel, setArtikel] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
  const fetchArtikel= async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/guest/content/${mosque_id}`);
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gagal fetch data: ${errText}`);
      }

      const data = await res.json();

      console.log("Data dari API:", data.data);

      if (!Array.isArray(data.data)) {
        throw new Error("Data yang diterima bukan array");
      }

      const filtered = data.data
        .filter((item: { contents_type: string }) => item.contents_type === "artikel");

      console.log("Data artikel setelah filter:", filtered);

      const mapped = filtered.map((item: ArticleItem) => ({
        ...item,
        image: item.image
          ? item.image.startsWith("http")
            ? item.image
            : `${API}/uploads/${item.image}`
          : "",
      }))
        .sort((a: ArticleItem, b: ArticleItem) =>
        new Date(b.published_date).getTime() - new Date(a.published_date).getTime()
        );
      setArtikel(mapped);
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan saat memuat artikel");
    } finally {
      setLoading(false);
    }
  };

  fetchArtikel();
}, [mosque_id, API]);

  const totalPages = Math.ceil(artikel.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = artikel.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) return <div className="p-4">Memuat artikel...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="w-full pt-20 pb-25 text-center"
        style={{ backgroundColor: "var(--color-custom-blue)" }}
      >
        <h1 className="text-10xl md:text-5xl font-bold text-gray-800">
          Artikel {mosqueName}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto mt-6 px-6 flex-grow">
        {artikel.length === 0 ? (
          <p className="mt-8">Tidak ada artikel untuk saat ini.</p>
        ) : (
          <>

            {/* Tambahan: Judul "Artikel Terbaru" */}
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
            Artikel Terbaru
            </h2>
            <div className="space-y-6 mt-8">
              {currentItems.map((item, index) => (
                <div key={item.id ? `item-${item.id}` : `index-${index}`}
                  className="bg-white rounded-xl shadow-md p-6 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() =>
                    (window.location.href = `/guest/${mosque_id}/content/artikel/${item.id}`)
                  }
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                  )}
                  <p className="text-sm mb-1" style={{ color: "var(--color-custom-orange)" }}>
                    {new Date(item.published_date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                  </p>
                  <h2 className="text-2xl font-bold text-black mb-1">{item.title}</h2>
                  <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                    {item.content_description}
                  </p>
                  <span className="text-sm" style={{ color: "var(--color-custom-orange)" }}>
                    Baca selengkapnya →
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-10">
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
              <span className="text-gray-700">Halaman {currentPage} dari {totalPages}</span>
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
