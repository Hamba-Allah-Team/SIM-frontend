// Halaman utama untuk mengelola daftar Kegiatan (Diperbarui dengan warna base putih)
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListPlus, RefreshCw } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/app/admin/kegiatan/data-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Activity } from "./types";
import { getActivities } from "./utils";
import axios from "axios";

export default function KegiatanPage() {
    const router = useRouter();
    const [data, setData] = useState<Activity[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        if (!isRefreshing) setIsLoadingData(true);
        else setIsRefreshing(true);

        try {
            const activities = await getActivities();
            setData(activities);
        } catch (error: unknown) {
            console.error("Gagal fetch kegiatan:", error);
            let errorMessage = "Tidak dapat mengambil data kegiatan.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error("Gagal Memuat Data", { description: errorMessage });
        } finally {
            setIsLoadingData(false);
            setIsRefreshing(false);
        }
    }, [isRefreshing]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddActivity = () => {
        router.push("/admin/kegiatan/tambah");
    };

    const handleRefresh = () => {
        fetchData();
    };

    const tableColumns = useMemo(() => columns(fetchData), [fetchData]);

    return (
        // 3. Menambahkan bg-white dan styling pada kontainer utama halaman
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D]">Kelola Kegiatan Masjid</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        // 3. Styling tombol Refresh dibuat eksplisit agar tidak berubah di mode gelap
                        className="flex items-center gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        disabled={isLoadingData || isRefreshing}
                    >
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    <Button
                        onClick={handleAddActivity}
                        className="flex items-center gap-2 bg-[#FF8A4C] hover:bg-[#ff7a38] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-70"
                    >
                        <ListPlus size={18} />
                        Tambah Kegiatan
                    </Button>
                </div>
            </div>
            <DataTable columns={tableColumns} data={data} isLoading={isLoadingData || isRefreshing} />
        </div>
    );
}