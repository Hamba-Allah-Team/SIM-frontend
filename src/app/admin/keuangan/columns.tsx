"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Keuangan } from "./types";
import TransactionActions from "@/components/finance/FinanceAction";
import { Badge } from "@/components/ui/badge";

export const columns = (onDeleted: () => void): ColumnDef<Keuangan>[] => [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
    },
    {
        accessorKey: "jenis",
        header: "Jenis",
        cell: ({ row }) => {
            const isIncome = row.original.jenis === "Pemasukan";
            return (
                <Badge variant={isIncome ? "default" : "destructive"} className={isIncome ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {row.original.jenis}
                </Badge>
            )
        }
    },
    {
        accessorKey: "kategori",
        header: "Kategori",
    },
    {
        accessorKey: "dompet",
        header: "Dompet",
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-center">Jumlah</div>,
        cell: ({ row }) => {
            const isIncome = row.original.jenis === "Pemasukan";
            return (
                <div className={`text-center font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'} Rp {row.original.amount.toLocaleString("id-ID")}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => (
            <div className="flex justify-center items-center">
                <TransactionActions transaction={row.original} onDeleted={onDeleted} />
            </div>
        ),
    },
];