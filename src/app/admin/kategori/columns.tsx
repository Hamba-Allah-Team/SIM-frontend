import { ColumnDef } from "@tanstack/react-table"
import { TransactionCategory } from "./types"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<TransactionCategory>[] = [
    {
        accessorKey: "name",
        header: "Nama Kategori",
    },
    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) => (row.getValue("type") === "income" ? "Pemasukan" : "Pengeluaran"),
    },
    // {
    //     accessorKey: "created_at",
    //     header: "Tanggal Dibuat",
    //     cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("id-ID"),
    // },
    {
        id: "actions",
        header: () => <div className="min-w-[200px]">Aksi</div>,
        cell: ({ row }) => {
            const kategori = row.original

            return (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => alert(`Detail ID ${kategori.id}`)}>
                        Detail
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => alert(`Edit ID ${kategori.id}`)}>
                        Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => alert(`Hapus ID ${kategori.id}`)}>
                        Hapus
                    </Button>
                </div>
            )
        },
    },
]
