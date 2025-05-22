import { ColumnDef } from "@tanstack/react-table"
import { Keuangan } from "./types";
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Keuangan>[] = [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
    },
    {
        accessorKey: "jenis",
        header: "Jenis",
    },
    {
        accessorKey: "dompet",
        header: "Dompet",
    },
    {
        accessorKey: "nominal",
        header: "Nominal",
        cell: ({ row }) => {
            const nominal = row.getValue("nominal") as number
            return `Rp ${nominal.toLocaleString("id-ID")}`
        },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const transaksi = row.original

            return (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => alert(`Detail ID ${transaksi.id}`)}>
                        Detail
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => alert(`Edit ID ${transaksi.id}`)}>
                        Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => alert(`Hapus ID ${transaksi.id}`)}>
                        Hapus
                    </Button>
                </div>
            )
        },
    },
]
