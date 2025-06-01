"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
import { Transaction as FinanceTransaction } from "@/app/admin/keuangan/types";

interface Props {
    transaction: FinanceTransaction;
    onDeleted?: () => void;
}

export default function TransactionActions({ transaction, onDeleted }: Props) {
    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/finance/transactions/${transaction.transaction_id}`);
            toast.success("Transaksi berhasil dihapus.");
            onDeleted?.();
        } catch (error) {
            console.error("Gagal menghapus transaksi:", error);
            toast.error("Gagal menghapus transaksi.");
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    return (
        <>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowDetail(true)}>
                    Detail
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        router.push(`/admin/keuangan/edit/${transaction.transaction_id}`)
                    }
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                >
                    Hapus
                </Button>
            </div>

            {/* Modal Detail */}
            <Dialog open={showDetail} onOpenChange={setShowDetail}>
                <DialogContent className="sm:max-w-xl p-6">
                    <DialogHeader>
                        <DialogTitle>Detail Transaksi</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Tanggal</label>
                            <Input value={transaction.transaction_date} readOnly disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Nominal</label>
                            <Input
                                value={`Rp ${transaction.amount.toLocaleString("id-ID")}`}
                                readOnly
                                disabled
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Kategori</label>
                            <Input
                                value={transaction.category?.category_name ?? "-"}
                                readOnly
                                disabled
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Deskripsi</label>
                            <Textarea
                                value={transaction.source_or_usage || "-"}
                                readOnly
                                disabled
                                className="resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-gray-700">
                        Yakin ingin menghapus transaksi sebesar{" "}
                        <strong>Rp {transaction.amount.toLocaleString("id-ID")}</strong>?
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
