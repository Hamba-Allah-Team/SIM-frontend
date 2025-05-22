import { ColumnDef } from "@tanstack/react-table"
import { Dompet } from "./types"

export const columns: ColumnDef<Dompet>[] = [
    {
        accessorKey: "name",
        header: "Jenis Dompet",
    },
    {
        accessorKey: "balance",
        header: "Saldo",
        cell: ({ row }) => {
            const balance = row.getValue("balance") as number
            return `Rp ${balance.toLocaleString("id-ID")}`
        },
    },
]
