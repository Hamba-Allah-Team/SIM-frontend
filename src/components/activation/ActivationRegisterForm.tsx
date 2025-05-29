"use client";

import { useEffect, useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Hash,
  Building,
  MapPin,
  Phone,
  Upload,
  Landmark,
  Lock,
} from "lucide-react";

export default function ActivationRegisterForm() {
  const [loaded, setLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState("Maksimal 2 MB");
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const inputWrapperClass = "relative w-full";
  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";
  const inputWithIconClass =
    "pl-10 bg-white hover:bg-gray-100 border-none rounded-2xl w-full text-gray-400 placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500";

  const inputs = [
    {
      name: "username",
      icon: <User size={20} className={iconClass} />,
      placeholder: "Username",
      required: true,
    },
    {
      name: "email",
      icon: <Mail size={20} className={iconClass} />,
      placeholder: "Email",
      required: true,
    },
    {
      name: "password",
      icon: <Lock size={20} className={iconClass} />,
      placeholder: "Password",
      required: true,
    },
    {
      name: "confirm_password",
      icon: <Lock size={20} className={iconClass} />,
      placeholder: "Konfirmasi Password",
      required: true,
    },
    {
      name: "mosque_name",
      icon: <Building size={20} className={iconClass} />,
      placeholder: "Nama Masjid",
      required: true,
    },
    {
      name: "mosque_address",
      icon: <MapPin size={20} className={iconClass} />,
      placeholder: "Alamat Masjid",
      required: true,
    },
    {
      name: "proof_number",
      icon: <Hash size={20} className={iconClass} />,
      placeholder: "Nomor Bukti Transfer",
      required: true,
    },
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!formData.get("proof_image")) {
      alert("Upload Bukti Transfer wajib diisi!");
      setSubmitting(false);
      return;
    }

    const requiredFields = [
      "username",
      "email",
      "password", 
      "confirm_password", 
      "proof_number",
      "mosque_name",
      "mosque_address",
    ];

    for (const fieldName of requiredFields) {
      const inputConfig = inputs.find(input => input.name === fieldName);
      const placeholderText = inputConfig ? inputConfig.placeholder.replace(" (opsional)","") : fieldName.replace(/_/g, " ");

      if (!formData.get(fieldName) || String(formData.get(fieldName)).trim() === "") {
        alert(`Field "${placeholderText}" wajib diisi!`);
        setSubmitting(false);
        return;
      }
    }

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      setSubmitting(false);
      const passwordInput = form.elements.namedItem("password") as HTMLInputElement | null;
      if (passwordInput) {
        passwordInput.focus();
      }
      return;
    }
    formData.delete("confirm_password");


    try {
      const response = await fetch(`${API}/api/activations/submit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        alert(`Gagal mengirim permintaan. Server jawab: ${text}`);
      } else {
        form.reset();
        setPreview(null);
        setSelectedFile("Unggah Gambar");
        window.location.href = "/activation/register/success";
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim permintaan.");
      console.error(error);
    }

    setSubmitting(false);
  }

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
          <div className="bg-white text-black w-full mt-6 p-4 rounded-2xl border border-custom-orange max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-black font-bold">Rekening BCA</p>
              <div className="flex items-center gap-2">
                <Landmark className="text-black" size={20} />
                <span className="text-black font-semibold">78806350373</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 flex flex-col items-center text-left bg-custom-orange rounded-t-3xl">
          <form
            className="space-y-5 text-white w-full"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            {inputs.map(({ name, icon, placeholder, required }) => (
              <div key={name}>
                <label className="block mb-1 font-medium text-white capitalize">
                  {placeholder}
                </label>
                <div className={inputWrapperClass}>
                  {icon}
                  <Input
                    type={
                      name.includes("email") ? "email" :
                      name.includes("password") ? "password" : "text"
                    }
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    className={inputWithIconClass}
                    disabled={submitting}
                  />
                </div>
              </div>
            ))}

            <input type="hidden" name="type" value="activation" />

            <div>
              <label className="block mb-1 font-medium text-white">
                Upload Bukti Transfer
              </label>
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
                      const maxSize = 2 * 1024 * 1024;
                      if (file.size > maxSize) {
                        alert("Ukuran file tidak boleh lebih dari 2MB.");
                        e.target.value = "";
                        setSelectedFile("Unggah gambar"); 
                        setPreview(null);
                        return;
                      }
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
                  disabled={submitting}
                />
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview" 
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="text-center z-0">
                    <Upload size={28} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-400">
                      Klik atau seret gambar ke sini
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{selectedFile}</p>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl mt-4"
              disabled={submitting}
            >
              {submitting ? "Mengirim..." : "Kirim"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}