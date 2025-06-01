import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "./types";
// import { Button } from "@/components/ui/button"
import TransactionActions from "@/components/finance/FinanceCategory";

export const columns = (onDeleted: () => void): ColumnDef<Transaction>[] => [
    {
        accessorKey: "transaction_date",
        header: () => <div className="min-w-[120px]">Tanggal</div>,
        cell: ({ row }) =>
            new Date(row.getValue("transaction_date")).toLocaleDateString("id-ID"),
    },
    {
        accessorKey: "transaction_type",
        header: () => <div className="min-w-[100px]">Jenis</div>,
        cell: ({ row }) => {
            const type = row.getValue("transaction_type");
            return type === "income" ? "Pemasukan" :
                   type === "expense" ? "Pengeluaran" :
                   type === "transfer_in" ? "Transfer Masuk" :
                   type === "transfer_out" ? "Transfer Keluar" : "Saldo Awal";
        }
    },
    {
        accessorKey: "category",
        header: () => <div className="min-w-[140px]">Kategori</div>,
        cell: ({ row }) => row.original.category?.category_name ?? "-",
    },
    {
        accessorKey: "wallet_id",
        header: () => <div className="min-w-[100px]">Dompet</div>,
        cell: ({ row }) => row.original.wallet_id.toString(), // bisa ubah sesuai nama kalau kamu punya mapping
    },
    {
        accessorKey: "amount",
        header: () => <div className="min-w-[140px]">Nominal</div>,
        cell: ({ row }) => {
            const value = row.getValue("amount") as number
            return `Rp ${value.toLocaleString("id-ID")}`
        },
    },
    {
        id: "actions",
        header: () => <div className="min-w-[200px]">Aksi</div>,
        cell: ({ row }) => (
            <TransactionActions transaction={row.original} onDeleted={onDeleted} />
        ),
    },
]
