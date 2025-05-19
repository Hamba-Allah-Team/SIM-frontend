"use client";

import { useEffect, useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, User, Hash, Image } from "lucide-react";

export default function ExtensionForm() {
  const [loaded, setLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [proofNumber, setProofNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!formData.get("username") || !formData.get("email") || !formData.get("proof_number") || !formData.get("proof_image")) {
      alert("Semua field wajib diisi!");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/extensions/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        alert(`Gagal mengirim: ${text}`);
      } else {
        form.reset();
        setPreview(null);
        setSelectedFile(null);
        window.location.href = "/activation/extend/success";
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim.");
      console.error("Submit error:", error);
    }

    setSubmitting(false);
  }

  const inputWrapperClass = "relative w-full";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";
  const inputWithIconClass =
    "pl-10 bg-white hover:bg-gray-100 border-none rounded-2xl w-full text-gray-400 placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500";

  return (
    <div className="w-full min-h-screen bg-custom-orange flex items-center justify-center px-4 py-6">
      <Card
        className={`shadow-none w-full max-w-2xl border-0 rounded-3xl bg-custom-orange transform transition-all duration-700 ease-out ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <CardHeader className="pb-4 flex flex-col items-center text-center bg-custom-orange rounded-t-3xl">
          <CardTitle className="text-3xl pt-2 text-white">Form Perpanjangan Akun</CardTitle>
        </CardHeader>

        <CardContent className="pb-4 flex flex-col items-center bg-custom-orange rounded-b-3xl">
          <form onSubmit={handleSubmit} className="space-y-5 text-white w-full">
            {/* Username */}
            <div>
              <label className="block mb-1 font-medium text-white">Username</label>
              <div className={inputWrapperClass}>
                <User size={20} className={iconClass} />
                <Input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-white">Email</label>
              <div className={inputWrapperClass}>
                <Mail size={20} className={iconClass} />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* Nomor Bukti Transfer */}
            <div>
              <label className="block mb-1 font-medium text-white">Nomor Bukti Transfer</label>
              <div className={inputWrapperClass}>
                <Hash size={20} className={iconClass} />
                <Input
                  type="text"
                  name="proof_number"
                  placeholder="Nomor Bukti Transfer"
                  required
                  value={proofNumber}
                  onChange={(e) => setProofNumber(e.target.value)}
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* Hidden Type */}
            <input type="hidden" name="type" value="extension" />

            {/* Upload Bukti */}
            <div>
              <label className="block mb-1 font-medium text-white">Upload Bukti Transfer</label>
              <div className="relative w-full h-48 bg-white rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
                <input
                  id="fileUpload"
                  type="file"
                  name="proof_image"
                  accept="image/*"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      const reader = new FileReader();
                      reader.onload = () => setPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setSelectedFile(null);
                      setPreview(null);
                    }
                  }}
                />
                {preview ? (
                  <img src={preview} alt="Preview" className="object-contain w-full h-full" />
                ) : (
                  <div className="text-center z-0">
                    <Image size={28} className="mx-auto mb-2 text-custom-orange" />
                    <p className="text-sm text-gray-400">Klik atau seret gambar ke sini</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedFile instanceof File ? selectedFile.name : "Unggah gambar"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tombol Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl mt-4"
            >
              {submitting ? "Mengirim..." : "Kirim"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
