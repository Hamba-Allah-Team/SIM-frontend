"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Hash,
  Building,
  MapPin,
  Info,
  Phone,
  Facebook,
  Instagram,
  Image,
} from "lucide-react";

export default function ActivationRegisterForm() {
  const [loaded, setLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState("Unggah gambar");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const inputWrapperClass = "relative w-full";
  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";
  const inputWithIconClass =
    "pl-10 bg-white hover:bg-gray-100 border-none rounded-2xl w-full text-gray-400 placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500";

  return (
    <div className="w-full h-screen px-4 pt-4 pb-4 bg-custom-orange overflow-auto flex flex-col items-center">
      <Card
        className={`shadow-none w-full max-w-3xl border-0 rounded-3xl bg-custom-orange transform transition-all duration-700 ease-out ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <CardHeader className="pb-4 flex flex-col items-center text-center bg-custom-orange rounded-t-3xl">
          <CardTitle className="text-3xl pt-2 text-white">
            Form Aktivasi Akun
          </CardTitle>

          {/* Card rekening */}
          <div className="bg-white text-black w-full mt-6 p-4 rounded-2xl border border-custom-orange max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3 text-center">
              <div>
                <p className="font-semibold text-black">
                  Transfer ke rekening:
                </p>
                <p className="text-black">
                  BANK BRI - 1234567890 <br /> a.n. SIMA
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 flex flex-col items-center text-left bg-custom-orange rounded-t-3xl">
          <form className="space-y-5 text-white w-full">
            {/* Username */}
            <div>
              <label className="block mb-1 font-medium text-white">
                Username
              </label>
              <div className={inputWrapperClass}>
                <User size={20} className={iconClass} />
                <Input
                  type="text"
                  placeholder="Username"
                  required
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
                  placeholder="Email"
                  required
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* Nomor Bukti Transfer */}
            <div>
              <label className="block mb-1 font-medium text-white">
                Nomor Bukti Transfer
              </label>
              <div className={inputWrapperClass}>
                <Hash size={20} className={iconClass} />
                <Input
                  type="text"
                  placeholder="Nomor Bukti Transfer"
                  required
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* Upload Bukti Transfer */}
            <div>
              <label className="block mb-1 font-medium text-white">
                Upload Bukti Transfer
              </label>

              <div className="relative w-full h-48 bg-white rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file.name);
                      const reader = new FileReader();
                      reader.onload = () => {
                        setPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setSelectedFile("Unggah gambar");
                      setPreview(null);
                    }
                  }}
                />

                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="text-center z-0">
                    <Image size={28} className="mx-auto mb-2 text-custom-orange" />
                    <p className="text-sm text-gray-400">
                      Klik atau seret gambar ke sini
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{selectedFile}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Nama Masjid */}
            <div>
              <label className="block mb-1 font-medium text-white">
                Nama Masjid
              </label>
              <div className={inputWrapperClass}>
                <Building size={20} className={iconClass} />
                <Input
                  type="text"
                  placeholder="Nama Masjid (opsional)"
                  required
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* Alamat Masjid */}
            <div>
              <label className="block mb-1 font-medium text-white">
                Alamat Masjid
              </label>
              <div className={inputWrapperClass}>
                <MapPin size={20} className={iconClass} />
                <Input
                  type="text"
                  placeholder="Alamat Masjid (opsional)"
                  required
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* WhatsApp Masjid */}
            <div>
              <label className="block mb-1 font-medium text-white">
                WhatsApp Masjid
              </label>
              <div className={inputWrapperClass}>
                <Phone size={20} className={iconClass} />
                <Input
                  type="text"
                  placeholder="No. WhatsApp (opsional)"
                  required
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* Facebook Masjid */}
            <div>
              <label className="block mb-1 font-medium text-white">
                Facebook Masjid
              </label>
              <div className={inputWrapperClass}>
                <Facebook size={20} className={iconClass} />
                <Input
                  type="text"
                  placeholder="Tautan Facebook (opsional)"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* Instagram Masjid */}
            <div>
              <label className="block mb-1 font-medium text-white">
                Instagram Masjid
              </label>
              <div className={inputWrapperClass}>
                <Instagram size={20} className={iconClass} />
                <Input
                  type="text"
                  placeholder="Tautan Instagram (opsional)"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            {/* Tombol Submit */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl mt-4"
            >
              Kirim
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
