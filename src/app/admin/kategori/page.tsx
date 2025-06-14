// src/app/admin/kategori/page.tsx (Diperbarui)
// Menggunakan styling konsisten yang telah kita tetapkan

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListPlus, RefreshCw } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { TransactionCategory } from "./types";
import { getTransactionCategories } from "./utils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import axios from "axios";

export default function TransactionCategoryPage() {
    const { profile } = useUserProfile();
    const router = useRouter();
    const [data, setData] = useState<TransactionCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        if (!profile?.mosque_id) return;
        if (!isRefreshing) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const categories = await getTransactionCategories(profile.mosque_id);
            setData(categories);
        } catch (error: unknown) {
            console.error("Gagal fetch kategori transaksi:", error);
            let errorMessage = "Gagal mengambil data kategori.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error("Gagal Memuat Data", { description: errorMessage });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [profile?.mosque_id, isRefreshing]);

    useEffect(() => {
        if (profile?.mosque_id) {
            fetchData();
        }
    }, [profile?.mosque_id, fetchData]);

    const handleAddCategory = () => {
        router.push("/admin/kategori/tambah");
    };

    const tableColumns = useMemo(() => columns(fetchData), [fetchData]);

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D]">
                    Kategori Transaksi
                </h1>
                <div className="flex gap-2">
                    <Button
                        onClick={() => { setIsRefreshing(true); fetchData(); }}
                        variant="outline"
                        className="flex items-center gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        disabled={isLoading || isRefreshing}
                    >
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    <Button
                        onClick={handleAddCategory}
                        className="flex items-center gap-2 bg-[#FF8A4C] hover:bg-[#ff7a38] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
                    >
                        <ListPlus size={16} />
                        Tambah
                    </Button>
                </div>
            </div>
            <DataTable columns={tableColumns} data={data} isLoading={isLoading} />
        </div>
    );
}
