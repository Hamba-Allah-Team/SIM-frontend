import { ColumnDef } from "@tanstack/react-table"
import { Dompet } from "./types"

export const columns: ColumnDef<Dompet>[] = [
    {
        accessorKey: "name",
        header: "Nama Dompet",
    },
    {
        accessorKey: "type",
        header: "Jenis Dompet",
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
        },
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
