"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient as api } from '@/lib/api-client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "@/hooks/useUserProfile";
import { CreateTransactionCategoryPayload } from "@/app/admin/kategori/types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";


export default function CreateCategoryPage() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { profile } = useUserProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!name.trim() || !type) {
            toast.error("Nama dan tipe kategori wajib diisi.");
            setIsLoading(false);
            return;
        }
        if (!profile?.mosque_id) {
            toast.error("Gagal mendapatkan ID masjid dari profil.");
            setIsLoading(false);
            return;
        }

        const payload: CreateTransactionCategoryPayload = {
            mosque_id: profile.mosque_id,
            category_name: name.trim(),
            category_type: type as "income" | "expense",
            description: description.trim() || null,
        };

        try {
            await api.post("/api/finance/categories", payload);
            toast.success("Kategori baru berhasil ditambahkan.");
            router.push("/admin/kategori");
            router.refresh();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || "Gagal membuat kategori";
            toast.error("Gagal Menambah Kategori", { description: message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 group text-slate-600 hover:text-slate-900 px-0"
            >
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Daftar Kategori
            </Button>
            <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200/80">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D] mb-2">
                    Tambah Kategori Transaksi
                </h1>
                <p className="text-gray-500 mb-6">Buat kategori baru untuk pemasukan atau pengeluaran.</p>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                        <Label htmlFor="categoryName" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nama Kategori <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="categoryName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Donasi Jumat, Biaya Listrik"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="categoryType" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Tipe Kategori <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={setType} value={type}>
                            <SelectTrigger className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]">
                                <SelectValue placeholder="Pilih tipe kategori" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="income" className="text-slate-800/80">Pemasukan</SelectItem>
                                <SelectItem value="expense" className="text-slate-800/80">Pengeluaran</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="description" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Deskripsi (Opsional)
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Keterangan tambahan mengenai kategori ini"
                            className="w-full bg-[#F7F8FA] rounded-lg px-4 py-3 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/kategori")}
                            className="w-full bg-white h-12 rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10 transition-colors"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}