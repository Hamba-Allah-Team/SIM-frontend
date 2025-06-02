import { ColumnDef } from "@tanstack/react-table";
import { Keuangan } from "./types";
import TransactionActions from "@/components/finance/FinanceAction";

export const columns = (onDeleted: () => void): ColumnDef<Keuangan>[] => [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => row.original.tanggal,
    },
    {
        accessorKey: "jenis",
        header: "Jenis",
        cell: ({ row }) => row.original.jenis,
    },
    {
        accessorKey: "kategori",
        header: "Kategori",
        cell: ({ row }) => row.original.kategori,
    },
    {
        accessorKey: "dompet",
        header: "Dompet",
        cell: ({ row }) => row.original.dompet,
    },
    {
        accessorKey: "amount",
        header: "Jumlah",
        cell: ({ row }) => `Rp ${row.original.amount.toLocaleString("id-ID")}`,
    },
    // {
    //     accessorKey: "source_or_usage",
    //     header: "Sumber / Penggunaan",
    //     cell: ({ row }) => row.original.source_or_usage,
    // },
    {
        id: "actions",
        header: () => <div>Aksi</div>,
        cell: ({ row }) => (
            <TransactionActions transaction={row.original} onDeleted={onDeleted} />
        ),
    },
];
