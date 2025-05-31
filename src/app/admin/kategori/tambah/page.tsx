"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
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

export default function CreateCategoryPage() {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const router = useRouter();
    const { profile } = useUserProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !type) {
            alert("Nama dan tipe kategori wajib diisi.");
            return;
        }

        if (!profile?.mosque_id) {
            alert("Gagal mendapatkan ID masjid dari profil.");
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

            router.push("/admin/kategori");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error("Error creating category:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Gagal membuat kategori");
        }
    };

    return (
        <div className="w-full px-4 py-6">
            <div className="w-full mx-auto">
                <h1 className="text-2xl font-bold text-[#1C143D] mb-6">
                    Tambah Kategori Transaksi
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nama Kategori
                        </label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: Donasi Jumat"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Tipe Kategori
                        </label>
                        <Select onValueChange={setType}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm">
                                <SelectValue placeholder="Pilih tipe kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Pemasukan</SelectItem>
                                <SelectItem value="expense">Pengeluaran</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Deskripsi (opsional)
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Keterangan tambahan mengenai kategori ini"
                            className="w-full bg-[#F7F8FA] rounded-lg px-4 py-2 text-sm placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/kategori")}
                            className="w-full h-12 rounded-full border-[#FF8A4C] text-[#FF8A4C] font-semibold hover:bg-[#FF8A4C]/10"
                        >
                            Batal
                        </Button>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold"
                        >
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
