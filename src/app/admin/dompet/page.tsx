"use client"

import { columns, Dompet } from "./columns"
import { DataTable } from "./data-table"

const dummyData: Dompet[] = [
    { id: 1, name: "Kas Masjid", balance: 1500000 },
    { id: 2, name: "Dana Infaq", balance: 250000 },
]

export default function DompetPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Data Dompet</h1>
            <DataTable columns={columns} data={dummyData} />
        </div>
    )
}
