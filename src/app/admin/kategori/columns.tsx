import { ColumnDef } from "@tanstack/react-table";
import { TransactionCategory } from "./types";

export const columns: ColumnDef<TransactionCategory>[] = [
    {
        accessorKey: "name",
        header: "Nama Kategori",
    },
    {
        accessorKey: "type",
        header: "Tipe",
        cell: ({ row }) => (row.getValue("type") === "income" ? "Pemasukan" : "Pengeluaran"),
    },
    {
        accessorKey: "created_at",
        header: "Tanggal Dibuat",
        cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString("id-ID"),
    },
];
