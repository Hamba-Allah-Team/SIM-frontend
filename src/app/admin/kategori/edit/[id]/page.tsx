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
import { Textarea } from "@/components/ui/textarea";
import { useUserProfile } from "@/hooks/useUserProfile";
import { TransactionCategoryResponse } from "@/app/admin/kategori/types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const { profile } = useUserProfile();

    const [categoryName, setCategoryName] = useState("");
    const [categoryType, setCategoryType] = useState<"income" | "expense" | "">("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            setIsFetching(true);
            try {
                const id = params.id;
                const res = await api.get(`/api/finance/categories/${id}`);
                const data: TransactionCategoryResponse = res.data;

                setCategoryName(data.category_name);
                setCategoryType(data.category_type);
                setDescription(data.description || "");
            } catch (err) {
                console.error("Gagal mengambil data kategori:", err);
                toast.error("Gagal mengambil data kategori.");
                router.push("/admin/kategori");
            } finally {
                setIsFetching(false);
            }
        };

        if (params.id) fetchCategory();
    }, [params.id, router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!profile?.mosque_id) {
            toast.error("Gagal mendapatkan ID masjid dari profil.");
            setIsLoading(false);
            return;
        }

        const payload = {
            mosque_id: profile.mosque_id,
            category_name: categoryName.trim(),
            category_type: categoryType,
            description: description.trim(),
        };

        try {
            await api.put(`/api/finance/categories/${params.id}`, payload);
            toast.success("Kategori berhasil diperbarui.");
            router.push("/admin/kategori");
            router.refresh();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || "Gagal memperbarui kategori";
            toast.error("Gagal Memperbarui", { description: message });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="w-full">
                <Button variant="ghost" className="mb-6 group text-slate-600 px-0">
                    <ArrowLeft size={16} className="mr-2" />
                    <Skeleton className="h-5 w-40" />
                </Button>
                <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
                    <Skeleton className="h-8 w-1/3 mb-1" />
                    <Skeleton className="h-6 w-2/3 mb-6" />
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="mb-1"><Skeleton className="h-4 w-1/4" /></div>
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Skeleton className="h-12 w-full rounded-full" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

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
                    Edit Kategori Transaksi
                </h1>
                <p className="text-gray-500 mb-6">Perbarui detail kategori yang sudah ada.</p>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                        <Label htmlFor="categoryName" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nama Kategori
                        </Label>
                        <Input
                            id="categoryName"
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Contoh: Donasi Jumat"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="categoryType" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Jenis Kategori
                        </Label>
                        <Select value={categoryType} onValueChange={(v) => setCategoryType(v as "income" | "expense")}>
                            <SelectTrigger className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]">
                                <SelectValue placeholder="Pilih jenis kategori" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="income">Pemasukan</SelectItem>
                                <SelectItem value="expense">Pengeluaran</SelectItem>
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

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/kategori")}
                            className="w-full h-12 rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10"
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