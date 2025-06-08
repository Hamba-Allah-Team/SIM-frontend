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
      {/* Header disesuaikan dengan PageHeader */}
      <div className="bg-[#EBF1F4] py-16 pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#0A1E4A] text-center">
            Tentang {data.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto mt-16 px-4 flex-grow">
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
        <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-7 text-gray-700 text-justify mb-16">
          <div className="font-bold text-lg col-span-1">
            {data.name}
          </div>

          {/* Separator vertikal */}
          <div className="hidden md:block border-l border-gray-300 mx-4"></div>

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
