import { ColumnDef } from "@tanstack/react-table";
import { Keuangan } from "./types";
import TransactionActions from "@/components/finance/FinanceAction";

export const columns = (onDeleted: () => void): ColumnDef<Keuangan>[] => [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => row.original.tanggal,
        meta: { className: "whitespace-nowrap text-left" },
    },
    {
        accessorKey: "jenis",
        header: "Jenis",
        cell: ({ row }) => row.original.jenis,
        meta: { className: "whitespace-nowrap text-left" },
    },
    {
        accessorKey: "kategori",
        header: "Kategori",
        cell: ({ row }) => row.original.kategori,
        meta: { className: "text-left truncate max-w-[150px]" },
    },
    {
        accessorKey: "dompet",
        header: "Dompet",
        cell: ({ row }) => row.original.dompet,
        meta: { className: "text-left truncate max-w-[150px]" },
    },
    {
        accessorKey: "amount",
        header: "Jumlah",
        cell: ({ row }) => `Rp ${row.original.amount.toLocaleString("id-ID")}`,
        meta: { className: "text-left whitespace-nowrap" },
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
            <div className="flex justify-start items-center">
                <TransactionActions transaction={row.original} onDeleted={onDeleted} />
            </div>
        ),
        meta: { className: "text-center w-[1%] whitespace-nowrap" }, // w-[1%] supaya sempit tapi cukup
    },
];
