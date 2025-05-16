"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordNewPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Link
        href="/reset-password/verify"
        className={`absolute top-6 left-6 flex items-center text-lg text-black hover:text-primary transition-all duration-500 ease-out transform ${
          loaded ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        <ArrowLeft size={22} className="mr-2" />
        Kembali
      </Link>
      <Card
        className={`w-full max-w-xl min-h-[400px] bg-white border-0 rounded-3xl shadow-background transform transition-all duration-700 ease-out ${
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
            <span className="text-3xl font-semibold">SIMA</span>
          </div>
          <CardTitle className="text-3xl pt-3">Login</CardTitle>
        </CardHeader>

        <CardContent className="pb-6">
          <form className="space-y-5">
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                className="w-full pl-10 pr-10 border-0 bg-gray-200 rounded-2xl hover:bg-gray-300 transition-colors duration-300"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                className="w-full pl-10 pr-10 border-0 bg-gray-200 rounded-2xl hover:bg-gray-300 transition-colors duration-300"
                type={showPassword ? "text" : "password"}
                placeholder="Konfirmasi Password"
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" className="w-full rounded-2xl">
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
