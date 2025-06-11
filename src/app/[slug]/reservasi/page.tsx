"use client";

import { useParams } from "next/navigation";
import GuestRoomList from "./guestRoomList";

export default function RuanganPage() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  return (
    <div className="flex flex-col min-h-[80vh] bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-[#EBF1F4] py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#0A1E4A] text-center">
            Ruangan
          </h1>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {slug ? (
          <GuestRoomList slug={slug} mosqueName="" />
        ) : (
          <div className="text-center text-gray-500 mt-8">
            Masjid tidak ditemukan.
          </div>
        )}
      </main>
    </div>
  );
}

