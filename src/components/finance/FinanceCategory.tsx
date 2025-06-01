"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/lib/api";
import { Keuangan } from "@/app/admin/keuangan/types";

interface Props {
    transaction: Keuangan;
    onDeleted?: () => void;
}

export default function TransactionActions({ transaction, onDeleted }: Props) {
    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/finance/transactions/${transaction.id}`);
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
                    onClick={() => router.push(`/admin/keuangan/edit/${transaction.id}`)}
                >
                    Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
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
                            <label className="text-sm font-medium">Dompet</label>
                            <Input value={transaction.dompet ?? "-"} readOnly disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Nominal</label>
                            <Input value={`Rp ${transaction.amount.toLocaleString("id-ID")}`} readOnly disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Jenis Transaksi</label>
                            <Input value={transaction.jenis ?? "-"} readOnly disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Kategori</label>
                            <Input value={transaction.kategori ?? "-"} readOnly disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Deskripsi</label>
                            <Textarea
                                value={transaction.source_or_usage ?? "-"}
                                readOnly
                                disabled
                                className="resize-none"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Tanggal</label>
                            <Input
                                value={transaction.tanggal}
                                readOnly
                                disabled
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
                        Apakah Anda yakin ingin menghapus transaksi dengan nominal{" "}
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
