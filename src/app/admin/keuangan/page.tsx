"use client";

import { useRouter } from "next/navigation";
import { ListPlus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { fetchTransactions, mapApiToKeuangan } from "./utils";
import { Keuangan } from "./types";

export default function KeuanganPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Keuangan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTransactions(); // Ambil dari API
                const mapped = mapApiToKeuangan(data);  // Ubah ke format Keuangan
                setTransactions(mapped);
            } catch (error) {
                console.error("Gagal mengambil transaksi:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Panggil sekali saat komponen dimount

    const handleAddKeuangan = () => {
        router.push("/admin/keuangan/tambah");
    };

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

            <DataTable columns={columns} data={transactions} isLoading={isLoading} />
        </div>
    );
}
