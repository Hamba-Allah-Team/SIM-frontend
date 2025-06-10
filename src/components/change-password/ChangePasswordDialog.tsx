"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const resetState = () => {
    setMessage({ type: "", text: "" });
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setShowPassword({ current: false, new: false, confirm: false });
    setIsSaving(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validasi (tidak ada perubahan)
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setMessage({ type: "error", text: "Semua kolom wajib diisi." });
      return;
    }
    if (formData.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password baru minimal harus 8 karakter." });
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage({ type: "error", text: "Konfirmasi password baru tidak cocok." });
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Sesi tidak valid. Silakan login kembali.");

      const response = await fetch(`${API_URL}/api/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal mengubah password.");

      setMessage({ type: "success", text: data.message });
      setFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });

    } catch (error: unknown) {
      if (error instanceof Error) setMessage({ type: "error", text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        resetState();
      }
    }}>
      <DialogTrigger asChild>
        <button className="text-sm font-medium text-custom-orange hover:text-orange-600">
          Ubah Password
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle>Ubah Password</DialogTitle>
          <DialogDescription>
            Perbarui password Anda.Pastikan untuk menggunakan password yang kuat.
          </DialogDescription>
        </DialogHeader>

        {message.text && (
          <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form id="change-password-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* MODIFIKASI: Input Password Lama dengan Ikon Mata */}
          <div className="space-y-2">
            <label htmlFor="currentPassword">Password Lama</label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPassword.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="Masukkan password saat ini"
                className="pr-10" // Beri ruang untuk ikon
              />
              <button type="button" onClick={() => toggleShowPassword('current')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700">
                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* MODIFIKASI: Input Password Baru dengan Ikon Mata */}
          <div className="space-y-2">
            <label htmlFor="newPassword">Password Baru</label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPassword.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="Minimal 8 karakter"
                className="pr-10"
              />
              <button type="button" onClick={() => toggleShowPassword('new')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700">
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* MODIFIKASI: Input Konfirmasi Password Baru dengan Ikon Mata */}
          <div className="space-y-2">
            <label htmlFor="confirmNewPassword">Konfirmasi Password Baru</label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type={showPassword.confirm ? "text" : "password"}
                value={formData.confirmNewPassword}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="Ketik ulang password baru"
                className="pr-10"
              />
              <button type="button" onClick={() => toggleShowPassword('confirm')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700">
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={isSaving}>Batal</Button>
          </DialogClose>
          <Button type="submit" form="change-password-form" disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}