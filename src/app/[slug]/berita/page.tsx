"use client";

import { useParams } from "next/navigation";
import GuestNewsList from "./guestNewsList";

export default function BeritaPage() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-[#EBF1F4] py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#0A1E4A] text-center">
            Berita
          </h1>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow">
        {slug ? (
          <GuestNewsList slug={slug} mosqueName="" />
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Masjid tidak ditemukan.
          </div>
        )}
      </main>
    </div>
  );
}
