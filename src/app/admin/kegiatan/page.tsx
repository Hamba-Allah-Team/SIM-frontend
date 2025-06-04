// Halaman utama untuk mengelola daftar Kegiatan (Diperbarui)
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ListPlus, RefreshCw } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // 👈 Menggunakan sonner untuk toast
import { Activity } from "./types";
import { getActivities } from "./utils";
import axios from "axios";

export default function KegiatanPage() {
    const router = useRouter();
    const [data, setData] = useState<Activity[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true); // Mengganti nama state
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        if (!isRefreshing) setIsLoadingData(true); // Menggunakan setIsLoadingData
        else setIsRefreshing(true); // Tetap set isRefreshing jika memang sedang refresh

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
            toast.error("Gagal Memuat Data", { description: errorMessage }); // 👈 Menggunakan sonner toast
        } finally {
            setIsLoadingData(false); // Menggunakan setIsLoadingData
            setIsRefreshing(false);
        }
    }, [isRefreshing]); // Hapus toast dari dependensi jika tidak dipakai langsung di sini

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddActivity = () => {
        router.push("/admin/kegiatan/tambah");
    };

    const handleRefresh = () => {
        // setIsRefreshing(true); // Sudah dihandle di dalam fetchData
        fetchData();
    };

    const tableColumns = useMemo(() => columns(fetchData), [fetchData]);

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-800">Kelola Kegiatan Masjid</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={isLoadingData || isRefreshing} // Menggunakan isLoadingData
                    >
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    <Button
                        onClick={handleAddActivity}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-70"
                    >
                        <ListPlus size={18} />
                        Tambah Kegiatan
                    </Button>
                </div>
            </div>

            {/* Menggunakan prop 'isLoading' sesuai definisi DataTable Anda */}
            <DataTable columns={tableColumns} data={data} isLoading={isLoadingData || isRefreshing} />
        </div>
    );
}