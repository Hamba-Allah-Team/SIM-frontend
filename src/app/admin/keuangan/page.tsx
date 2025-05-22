"use client"

import { useRouter } from "next/navigation"
import { ListPlus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Keuangan } from "./types";

export default function KeuanganPage() {
    const router = useRouter()
    const [data, setData] = useState<Keuangan[]>([])

    useEffect(() => {
        // Dummy data untuk keuangan
        const dummyData: Keuangan[] = [
            {
                id: 1,
                tanggal: "2025-05-21",
                jenis: "Pemasukan",
                dompet: "Cash",
                nominal: 1000000,
            },
            {
                id: 2,
                tanggal: "2025-05-20",
                jenis: "Pengeluaran",
                dompet: "Bank",
                nominal: 250000,
            },
        ]

        setData(dummyData)
    }, [])

    const handleAddKeuangan = () => {
        router.push("/admin/keuangan/tambah")
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

            <DataTable columns={columns} data={data} isLoading={false} />
        </div>
    )
}
