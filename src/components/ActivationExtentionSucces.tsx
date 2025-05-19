"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActivationExtendSuccess() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div
        className={`flex flex-col items-center gap-6 p-10 rounded-3xl transition-all duration-700 ease-out transform ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <CheckCircle className="text-green-500 w-16 h-16 animate-bounce" />
        <h1 className="text-2xl font-semibold text-center">
          Permintaan Perpanjangan Akun Berhasil Dikirim!
        </h1>
        <Link href="/">
          <Button className="rounded-xl w-full sm:w-64 px-6 py-2 mt-4">
            Kembali
          </Button>
        </Link>
      </div>
    </div>
  );
}
