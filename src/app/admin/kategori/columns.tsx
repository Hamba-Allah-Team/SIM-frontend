import { ColumnDef } from "@tanstack/react-table"
import { TransactionCategory } from "./types"
// import { Button } from "@/components/ui/button"
import CategoryActions from "@/components/category/CategoryActions";

export const columns = (
    onDeleted: () => void
): ColumnDef<TransactionCategory>[] => [
        {
            accessorKey: "name",
            header: () => <div className="min-w-[150px]">Nama Kategori</div>,
            cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("name")}</div>,
        },
        {
            accessorKey: "type",
            header: () => <div className="min-w-[100px]">Tipe</div>,
            cell: ({ row }) => (
                <div className="whitespace-nowrap">
                    {row.getValue("type") === "income" ? "Pemasukan" : "Pengeluaran"}
                </div>
            ),
        },
        {
            id: "actions",
            header: () => <div className="min-w-[180px] text-center">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <CategoryActions category={row.original} onDeleted={onDeleted} />
                </div>
            ),
        },

    ];

