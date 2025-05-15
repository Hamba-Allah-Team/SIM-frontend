"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function LoginImage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`flex-1 relative w-full h-full transition-opacity duration-1000 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src="/masjid-image.webp"
        alt="Login Image"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
    </div>
  );
}