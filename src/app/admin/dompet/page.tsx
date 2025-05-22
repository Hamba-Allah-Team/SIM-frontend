"use client"

import { useState, useEffect } from "react"
import { columns, Dompet } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { ListPlus } from 'lucide-react'

export default function DompetPage() {
    const [data, setData] = useState<Dompet[]>([])

    useEffect(() => {
        // TODO: Ganti dengan fetch dari API
        const dummyData = [
            { id: 1, name: "Cash", balance: 1500000 },
            { id: 2, name: "Bank", balance: 250000 },
        ]
        setData(dummyData)
    }, [])

    // Cek apakah jenis Cash dan Bank sudah ada
    const hasCash = data.some((dompet) => dompet.name.toLowerCase() === "cash")
    const hasBank = data.some((dompet) => dompet.name.toLowerCase() === "bank")
    const disableAddButton = hasCash && hasBank

    const handleAddDompet = () => {
        // Logika menampilkan modal atau form tambah dompet
        alert("Tampilkan form/modal untuk tambah dompet")
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Data Dompet</h1>
                <Button
                    onClick={handleAddDompet}
                    disabled={disableAddButton}
                    className="flex items-center gap-2 bg-[#FF9357]/20 text-[#FF9357] px-4 py-2 rounded-md hover:bg-[#FF9357]/30 transition disabled:opacity-50"
                >
                    <ListPlus size={16} />
                    Tambah
                </Button>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
