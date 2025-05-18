"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function ActivationSideImage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`flex-1 bg-white relative w-full h-full transition-opacity duration-1000 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Tombol Kembali */}
      <div className="pl-24 pt-16">
        <Link
          href="/"
          className={`flex items-center gap-2 text-lg font-bold text-black hover:text-primary transition-all duration-500 ease-out transform ${
            loaded ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-4"
          }`}
        >
          <ArrowLeft size={26} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Logo dan Deskripsi */}
      <div className="flex flex-col items-start justify-start gap-4 mt-12 pl-24 pr-6">
        <div className="flex items-center gap-4">
          <img
            src="/sima-icon.png"
            alt="Logo SIMA"
            className="w-16 h-16 transition-transform duration-300 hover:scale-110"
          />
          <span className="text-4xl font-extrabold">SIMA</span>
        </div>
        <p className="text-4xl font-bold text-black mt-6 w-full max-w-2xl mb-24">
          Nikmati seluruh akses untuk semua fitur selama 1 Bulan
        </p>
      </div>
    </div>
  );
}
