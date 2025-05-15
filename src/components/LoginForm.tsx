"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (data.role === "superadmin") {
        window.location.href = "/superadmin/dashboard";
      } else {
        alert("Role tidak dikenali");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Card className="w-full max-w-xl min-h-[400px] bg-white border-0 rounded-3xl shadow-md">
        <CardHeader className="pb-4 flex flex-col items-start justify-center text-center">
          <div className="flex items-center gap-2">
            <img src="/sima-icon.png" alt="Logo SIMA" className="w-10 h-10" />
            <span className="text-3xl font-semibold">SIMA</span>
          </div>
          <CardTitle className="text-3xl pt-3">Login</CardTitle>
        </CardHeader>

        <CardContent className=" pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                className="w-full pl-10 border-0 bg-gray-200 rounded-2xl"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                className="w-full pl-10 pr-10 border-0 bg-gray-200 rounded-2xl"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="text-left text-sm">
              <Link
                href="/reset-password"
                className="text-primary hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
