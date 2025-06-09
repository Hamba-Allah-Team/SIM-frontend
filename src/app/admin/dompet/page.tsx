"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ListPlus, HandCoins, RefreshCw } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table"; // Pastikan path ke DataTable benar
import { Button } from "@/components/ui/button";
import { apiClient as api } from '@/lib/api-client';
import { WalletApiResponse, Dompet } from "./types";
import { mapWalletApiToDompet } from "./utils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import axios from "axios";

export default function DompetPage() {
    const { profile } = useUserProfile();
    const router = useRouter();
    const [data, setData] = useState<Dompet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        if (!profile?.mosque_id) return;
        if (!isRefreshing) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await api.get<WalletApiResponse[]>(`/api/wallets/mosque/${profile.mosque_id}`);
            const mapped = mapWalletApiToDompet(res.data);
            setData(mapped);
        } catch (error: unknown) {
            console.error("Gagal fetch dompet:", error);
            let errorMessage = "Gagal mengambil data dompet.";
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

    const handleAddDompet = () => {
        router.push("/admin/dompet/tambah");
    };

    const handleTransferDompet = () => {
        router.push("/admin/dompet/transfer");
    };

    // 👈 Memperbaiki pemanggilan columns
    const tableColumns = useMemo(() => columns(fetchData), [fetchData]);

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D]">Kelola Dompet Masjid</h1>
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
                        onClick={handleTransferDompet}
                        // 👈 Diperbaiki: Dihapus variant default (atau di set variant="secondary")
                        // dan semua style di-handle oleh className
                        variant="secondary"
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
                    >
                        <HandCoins size={16} />
                        Transfer
                    </Button>
                    <Button
                        onClick={handleAddDompet}
                        className="flex items-center gap-2 bg-[#FF8A4C] hover:bg-[#ff7a38] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
                    >
                        <ListPlus size={18} />
                        Tambah
                    </Button>
                </div>
            </div>
            <DataTable columns={tableColumns} data={data} isLoading={isLoading} />
        </div>
    );
}