"use client";

import { Keuangan } from "@/app/admin/keuangan/types";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteTransaction } from "@/app/admin/keuangan/utils";

interface Props {
    transaction: Keuangan;
    onDeleted: () => void;
}

export default function TransactionActions({ transaction, onDeleted }: Props) {
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/admin/keuangan/edit/${transaction.id}`);
    };

    const handleDelete = async () => {
        if (confirm("Yakin ingin menghapus transaksi ini?")) {
            try {
                await deleteTransaction(transaction.id);
                onDeleted();
            } catch (error) {
                console.error("Gagal menghapus transaksi:", error);
                alert("Gagal menghapus transaksi");
            }
        }
    };

    return (
        <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleEdit}>
                <Pencil size={16} className="mr-1" />
                Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDelete}>
                <Trash2 size={16} className="mr-1" />
                Hapus
            </Button>
        </div>
    );
}
