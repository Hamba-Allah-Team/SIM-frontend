"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Keuangan } from "./types";
import TransactionActions from "@/components/finance/FinanceAction";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns = (onDeleted: () => void): ColumnDef<Keuangan>[] => [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
    },
    {
        accessorKey: "jenis",
        header: "Jenis",
        cell: ({ row }) => {
            // 👈 PERBAIKAN 1: Logika diperbarui untuk menangani semua jenis transaksi
            const jenis = row.original.jenis;
            const isIncome = jenis === "Pemasukan";
            const isExpense = jenis === "Pengeluaran";
            const isTransfer = jenis.includes("Transfer");

            return (
                <Badge
                    variant="outline"
                    className={cn(
                        "font-semibold",
                        isIncome && "bg-green-100 text-green-800 border-green-200",
                        isExpense && "bg-red-100 text-red-800 border-red-200",
                        isTransfer && "bg-blue-100 text-blue-800 border-blue-200",
                        !isIncome && !isExpense && !isTransfer && "bg-slate-100 text-slate-800 border-slate-200"
                    )}
                >
                    {jenis}
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
        header: () => <div className="text-right">Jumlah</div>,
        cell: ({ row }) => {
            // 👈 PERBAIKAN 2: Logika diperbarui untuk mencakup semua jenis pemasukan
            const isPositive = ["Pemasukan", "Transfer Masuk", "Saldo Awal"].includes(row.original.jenis);
            const isNegative = ["Pengeluaran", "Transfer Keluar"].includes(row.original.jenis);

            return (
                <div className={cn(
                    "text-right font-medium",
                    isPositive && "text-green-600",
                    isNegative && "text-red-600"
                )}>
                    {isPositive && '+'}
                    {isNegative && '-'}
                    Rp {row.original.amount.toLocaleString("id-ID")}
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