import { ColumnDef } from "@tanstack/react-table"
import { TransactionCategory } from "./types"
// import { Button } from "@/components/ui/button"
import CategoryActions from "@/components/category/CategoryActions";

export const columns = (
    onDeleted: () => void
): ColumnDef<TransactionCategory>[] => [
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
            id: "actions",
            header: () => <div className="min-w-[200px]">Aksi</div>,
            cell: ({ row }) => (
                <CategoryActions category={row.original} onDeleted={onDeleted} />
            ),
        },
    ];

