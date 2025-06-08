"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetPasswordSucces() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen flex items-center justify-center h-screen bg-white ">
      <div
        className={`w-full flex flex-col items-center gap-6 p-10 rounded-3xl transition-all duration-700 ease-out transform ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <CheckCircle className="text-custom-orange w-16 h-16 animate-bounce" />
        <h1 className="text-2xl font-semibold text-center text-black">Reset Password Berhasil!</h1>
        <p className="text-gray-600 text-center">
          Silakan login dengan password baru Anda.
        </p>
        <Link href="/login">
          <Button className="rounded-xl px-6 py-2 mt-4">Kembali ke Login</Button>
        </Link>
      </div>
    </div>
  );
}
