import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface AboutSectionProps {
  data: {
    name: string;
    image?: string;
    description?: string;
  };
}

export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full pt-20 pb-25 text-center"
      style={{ backgroundColor: "var(--color-custom-blue)"}}>
        <h1 className="text-10xl md:text-5xl font-bold text-gray-800">
          Tentang Masjid {data.name}
        </h1>
      </div>

      <div className="max-w-5xl mx-auto mt-15 px-4 flex-grow">
        {/* Gambar */}
        {data.image && (
          <AspectRatio ratio={16 / 9}>
            <img
              src={data.image}
              alt={`Foto Masjid ${data.name}`}
              className="object-cover w-full h-full rounded-md shadow-md"
            />
          </AspectRatio>
        )}

        {/* Deskripsi */}
        <div className="mt-15 grid grid-cols-3 md:grid-cols-6 gap-7 text-gray-700 text-justify">
            <div className="font-bold text-lg col-span-1">
                {data.name}
            </div>

            {/* Separator vertikal */}
            <div className="hidden md:block border-l border-gray-300 mx-20"></div>

            <div className="md:col-span-4 col-span-4">
                {data.description?.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">
                    {paragraph.trim()}
                </p>
                ))}
            </div>
        </div>


      </div>
    </div>
  );
}
