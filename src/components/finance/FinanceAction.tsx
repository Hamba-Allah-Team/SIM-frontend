"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Pencil, Trash } from "lucide-react";

import api from "@/lib/api";
import { Keuangan } from "@/app/admin/keuangan/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
    transaction: Keuangan;
    onDeleted?: () => void;
}

export default function TransactionActions({ transaction, onDeleted }: Props) {
    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/finance/transactions/${transaction.id}`);
            toast.success("Transaksi berhasil dihapus.");
            onDeleted?.();
        } catch (error) {
            console.error("Gagal menghapus transaksi:", error);
            toast.error("Gagal menghapus transaksi.");
        }
    };

    return (
        <TooltipProvider>
            <div className="flex gap-2">
                {/* Detail */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="outline" onClick={() => setShowDetail(true)}>
                            <Eye className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Detail</TooltipContent>
                </Tooltip>

                {/* Edit */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => router.push(`/admin/keuangan/edit/${transaction.id}`)}
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                </Tooltip>

                {/* Delete */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="icon" variant="destructive">
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <p>
                                    Apakah Anda yakin ingin menghapus transaksi dengan nominal{" "}
                                    <strong>Rp {transaction.amount.toLocaleString("id-ID")}</strong>?
                                </p>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete();
                                        }}
                                    >
                                        Hapus
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TooltipTrigger>
                    <TooltipContent>Hapus</TooltipContent>
                </Tooltip>
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
                            <Input value={transaction.tanggal} readOnly disabled />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
