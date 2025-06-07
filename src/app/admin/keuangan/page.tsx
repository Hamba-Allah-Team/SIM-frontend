"use client";

import { useRouter } from "next/navigation";
import { ListPlus, ScrollText, RefreshCw } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchTransactionsWithWallets } from "./utils";
import { Keuangan } from "./types";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ExportReportModal } from "./modal/ExportModalReport";
import { toast } from "sonner";
import axios from "axios";

export default function KeuanganPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Keuangan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [openExportModal, setOpenExportModal] = useState(false);
    const { profile, loading: profileLoading, error } = useUserProfile();

    const fetchData = useCallback(async () => {
        if (!profile || profileLoading) return;
        if (!isRefreshing) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const mosqueId = profile.mosque_id;
            const mapped = await fetchTransactionsWithWallets(mosqueId);
            setTransactions(mapped);
        } catch (error: unknown) {
            console.error("Gagal mengambil transaksi:", error);
            let errorMessage = "Gagal mengambil data transaksi.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            }
            toast.error("Gagal Memuat Data", { description: errorMessage });
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [profile, profileLoading, isRefreshing]);

    const handleDeleted = useCallback(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (profile) { // Hanya fetch jika profile sudah ada
            fetchData();
        }
    }, [profile, fetchData]);

    const handleAddKeuangan = () => {
        router.push("/admin/keuangan/tambah");
    };

    // 👈 Pemanggilan useMemo dipindahkan ke atas
    const tableColumns = useMemo(() => columns(handleDeleted), [handleDeleted]);

    if (error) {
        return <div className="p-4 text-red-500"><p>{error}</p></div>;
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200/80">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D]">Data Keuangan</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setIsRefreshing(true)}
                        variant="outline"
                        className="flex items-center gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        disabled={isLoading || isRefreshing}
                    >
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setOpenExportModal(true)}
                        variant="secondary"
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
                    >
                        <ScrollText size={16} />
                        Cetak Laporan
                    </Button>

                    <Button
                        onClick={handleAddKeuangan}
                        className="flex items-center gap-2 bg-[#FF8A4C] hover:bg-[#ff7a38] text-white px-4 py-2 rounded-lg shadow-md"
                    >
                        <ListPlus size={16} />
                        Tambah
                    </Button>
                </div>
            </div>
            <DataTable columns={tableColumns} data={transactions} isLoading={isLoading || profileLoading} />
            <ExportReportModal open={openExportModal} onClose={() => setOpenExportModal(false)} />
        </div>
    );
}