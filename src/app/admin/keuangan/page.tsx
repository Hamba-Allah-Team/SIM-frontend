"use client";

import { useRouter } from "next/navigation";
import { ListPlus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { fetchTransactionsWithWallets } from "./utils";
import { Keuangan } from "./types";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function KeuanganPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Keuangan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { profile, loading: profileLoading, error } = useUserProfile();

    useEffect(() => {
        const fetchData = async () => {
            if (!profile || profileLoading) return;

            setIsLoading(true);
            try {
                const mosqueId = profile.mosque_id;
                const mapped = await fetchTransactionsWithWallets(mosqueId);
                setTransactions(mapped);
            } catch (error) {
                console.error("Gagal mengambil transaksi:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [profile, profileLoading]);

    const handleAddKeuangan = () => {
        router.push("/admin/keuangan/tambah");
    };

    const handleDeleted = () => {
        // Refresh data setelah hapus
        if (profile) {
            fetchTransactionsWithWallets(profile.mosque_id)
                .then(setTransactions)
                .catch((err) => console.error("Gagal refresh setelah hapus:", err));
        }
    };

    if (error) {
        return <div className="p-4 text-red-500"><p>{error}</p></div>;
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Data Keuangan</h1>
                <Button
                    onClick={handleAddKeuangan}
                    className="flex items-center gap-2 bg-[#FF9357]/20 text-[#FF9357] px-4 py-2 rounded-md hover:bg-[#FF9357]/30 transition"
                >
                    <ListPlus size={16} />
                    Tambah
                </Button>
            </div>
            <DataTable columns={columns(handleDeleted)} data={transactions} isLoading={isLoading} />
        </div>
    );
}
