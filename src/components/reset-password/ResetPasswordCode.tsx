"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordCode() {
  const [loaded, setLoaded] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (!savedEmail) {
      window.location.href = "/reset-password";
    } else {
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${API}/api/reset-password/verify-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, resetCode: code }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("resetVerified", "true");
        localStorage.setItem("resetCode", code);
        window.location.href = "/reset-password/new-password";
      } else {
        alert(data.message || "Verifikasi gagal, coba lagi.");
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      alert("Terjadi kesalahan saat verifikasi kode.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      alert("Email tidak ditemukan.");
      return;
    }

    setResending(true);
    try {
      const res = await fetch(
        `${API}/api/reset-password/send-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Kode baru telah dikirim ke email.");
      } else {
        alert(data.message || "Gagal mengirim ulang kode.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim ulang kode.");
      console.error(error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full relative ">
      <Link
        href="/reset-password"
        className={`absolute top-6 left-6 flex items-center text-lg text-black hover:text-primary transition-all duration-500 ease-out transform ${
          loaded ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        <ArrowLeft size={22} className="mr-2" />
        Kembali
      </Link>

      <Card
        className={`w-full max-w-xl shadow-none min-h-[400px] bg-white border-0 rounded-3xl shadow-background transform transition-all duration-700 ease-out ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <CardHeader className="pb-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-start gap-2 my-10">
            <img
              src="/sima-icon.png"
              alt="Logo SIMA"
              className="w-10 h-10 transition-transform duration-300 hover:scale-110"
            />
            <span className="text-3xl font-semibold text-black">SIMA</span>
          </div>
          <CardTitle className="text-3xl pt-3 text-black">
            Masukkan Kode
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Kode ini berlaku selama 60 detik{" "}
          </p>
        </CardHeader>

        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                className="pl-10 w-full border-0 bg-gray-200 rounded-2xl hover:bg-gray-300 placeholder:text-gray-500 transition-colors duration-300 text-gray-700"
                type="text"
                placeholder="Masukkan Kode"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl"
              disabled={loading || resending}
            >
              {loading ? "Memverifikasi..." : "Selanjutnya"}
            </Button>
          </form>
          <div className="text-center text-sm mt-6">
            <span className="text-black">Tidak menerima kode? </span>
            <button
              type="button"
              onClick={!resending ? handleResendCode : undefined}
              disabled={resending || loading}
              className={`font-medium text-custom-orange hover:text-orange-600 focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out`}
            >
              {resending ? "Mengirim ulang..." : "Kirim Ulang"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
