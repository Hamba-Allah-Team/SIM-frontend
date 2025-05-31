"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { useUserProfile } from "@/hooks/useUserProfile";
import { TransactionCategory } from "@/app/admin/kategori/types";
import { AxiosError } from "axios";

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const { profile } = useUserProfile();

    const [categoryName, setCategoryName] = useState("");
    const [categoryType, setCategoryType] = useState<"income" | "expense" | "">("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const id = params.id;
                const res = await api.get(`/api/finance/categories/${id}`);
                const rawData = res.data;

                const data: TransactionCategory = {
                    id: rawData.category_id,
                    name: rawData.category_name,
                    type: rawData.category_type,
                    description: rawData.description,
                    mosque_id: rawData.mosque_id,
                    created_at: rawData.created_at,
                    updated_at: rawData.updated_at,
                    deleted_at: rawData.deleted_at,
                };

                setCategoryName(data.name);
                setCategoryType(data.type);
                setDescription(data.description || "");
            } catch (err) {
                console.error("Gagal mengambil data kategori:", err);
                alert("Gagal mengambil data kategori.");
                router.push("/admin/kategori");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) fetchCategory();
    }, [params.id, router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profile?.mosque_id) {
            alert("Gagal mendapatkan ID masjid dari profil.");
            return;
        }

        const payload = {
            mosque_id: profile.mosque_id,
            category_name: categoryName.trim(),
            category_type: categoryType,
            description: description.trim(),
        };

        try {
            // const id = params.id;
            const res = await api.put(`/api/finance/categories/${params.id}`, payload);
            console.log("Kategori berhasil diupdate:", res.data);
            router.push("/admin/kategori");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error("Error updating category:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Gagal memperbarui kategori");
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 text-orange-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="ml-2 text-sm text-gray-600">Memuat data kategori...</span>
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-6">
            <div className="w-full mx-auto">
                <h1 className="text-2xl font-bold text-[#1C143D] mb-6">
                    Edit Kategori Transaksi
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nama Kategori
                        </label>
                        <Input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Contoh: Donasi Jumat"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Jenis Kategori
                        </label>
                        <Select value={categoryType} onValueChange={(v) => setCategoryType(v as "income" | "expense")}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm">
                                <SelectValue placeholder="Pilih jenis kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Pemasukan</SelectItem>
                                <SelectItem value="expense">Pengeluaran</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Deskripsi (Opsional)
                        </label>
                        <Input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Contoh: Kategori untuk pengeluaran rutin"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/kategori")}
                            className="w-full h-12 rounded-full border-[#FF8A4C] text-[#FF8A4C] font-semibold hover:bg-[#FF8A4C]/10"
                            type="button"
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
