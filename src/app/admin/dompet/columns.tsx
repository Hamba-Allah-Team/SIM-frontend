import { ColumnDef } from "@tanstack/react-table"
import { Dompet } from "./types"
import DompetAction from "@/components/dompet/DompetAction"

export const columns = (onDeleted: () => void): ColumnDef<Dompet>[] => [
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
        header: () => "Saldo",
        cell: ({ row }) => {
            const balance = row.getValue("balance") as number
            return <div>Rp {balance.toLocaleString("id-ID")}</div>
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <DompetAction wallet={row.original} onDeleted={onDeleted} />
            </div>
        ),
    },
]
