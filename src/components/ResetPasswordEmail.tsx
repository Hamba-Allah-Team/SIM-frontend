"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";

export default function ResetPasswordEmail() {
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // untuk tombol kirim ulang

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const sendResetEmail = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/reset-password/send-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("resetEmail", email);
        if (data.resetCode) {
          localStorage.setItem("resetCode", data.resetCode);
        }
        alert("Kode reset password berhasil dikirim ke email Anda.");
        setEmailSent(true);
        window.location.href = "/reset-password/verify";
      } else {
        if (data.message?.toLowerCase().includes("email tidak ditemukan")) {
          alert("Email salah atau tidak terdaftar.");
        } else {
          alert(data.message || "Gagal mengirim kode reset password.");
        }
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim kode reset password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetEmail();
  };

  const handleResend = async () => {
    await sendResetEmail();
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full relative bg-white">
      <Link
        href="/login"
        className={`absolute top-6 left-6 flex items-center text-lg text-black hover:text-primary transition-all duration-500 ease-out transform ${
          loaded ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        <ArrowLeft size={22} className="mr-2" />
        Kembali
      </Link>

      <Card
        className={`shadow-none w-full max-w-xl min-h-[400px] bg-white border-0 rounded-3xl shadow-background transform transition-all duration-700 ease-out ${
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
          <CardTitle className="text-3xl pt-3 text-black">Lupa Password</CardTitle>
        </CardHeader>

        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                className="w-full pl-10 border-0 bg-gray-200 rounded-2xl hover:bg-gray-300 transition-colors duration-300 text-gray-700 placeholder:text-gray-500"
                type="email"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl mt-2"
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Kirim"}
            </Button>

            {emailSent && (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-2xl mt-2"
                onClick={handleResend}
                disabled={loading}
              >
                Kirim Ulang Email
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
