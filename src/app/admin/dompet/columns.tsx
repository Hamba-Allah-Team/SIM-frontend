import { ColumnDef } from "@tanstack/react-table"

export type Dompet = {
    id: number
    name: string
    balance: number
}

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
