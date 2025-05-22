import { ColumnDef } from "@tanstack/react-table"
import { Keuangan } from "./types";
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Keuangan>[] = [
    {
        accessorKey: "transaction_date",
        header: () => <div className="min-w-[120px]">Tanggal</div>,
        cell: ({ row }) =>
            new Date(row.getValue("transaction_date")).toLocaleDateString("id-ID"),
    },
    {
        accessorKey: "transaction_type",
        header: () => <div className="min-w-[100px]">Jenis</div>,
    },
    {
        accessorKey: "wallet_type",
        header: () => <div className="min-w-[100px]">Dompet</div>,
        cell: ({ row }) => row.getValue("wallet_type") ?? "-",
    },
    {
        accessorKey: "amount",
        header: () => <div className="min-w-[140px]">Nominal</div>,
        cell: ({ row }) => {
            const value = row.getValue("amount") as number;
            return `Rp ${value.toLocaleString("id-ID")}`;
        },
    },
    {
        id: "actions",
        header: () => <div className="min-w-[200px]">Aksi</div>,
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
