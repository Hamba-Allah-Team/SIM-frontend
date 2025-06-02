import { ColumnDef } from "@tanstack/react-table";
import { Keuangan } from "./types";
import TransactionActions from "@/components/finance/FinanceAction";

export const columns = (onDeleted: () => void): ColumnDef<Keuangan>[] => [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => row.original.tanggal,
        meta: { className: "w-[120px] whitespace-nowrap" },
    },
    {
        accessorKey: "jenis",
        header: "Jenis",
        cell: ({ row }) => row.original.jenis,
        meta: { className: "w-[100px] whitespace-nowrap text-center" },
    },
    {
        accessorKey: "kategori",
        header: "Kategori",
        cell: ({ row }) => row.original.kategori,
        meta: { className: "w-[180px] truncate" },
    },
    {
        accessorKey: "dompet",
        header: "Dompet",
        cell: ({ row }) => row.original.dompet,
        meta: { className: "w-[160px] truncate" },
    },
    {
        accessorKey: "amount",
        header: "Jumlah",
        cell: ({ row }) => `Rp ${row.original.amount.toLocaleString("id-ID")}`,
        meta: { className: "w-[140px] text-right whitespace-nowrap" },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <TransactionActions transaction={row.original} onDeleted={onDeleted} />
            </div>
        ),
        meta: { className: "w-[140px] text-center" },
    }
];
