"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Pencil, Trash } from "lucide-react";
import api from "@/lib/api";
import { Keuangan } from "@/app/admin/keuangan/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface Props {
    transaction: Keuangan;
    onDeleted?: () => void;
}

export default function TransactionActions({ transaction, onDeleted }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`/api/finance/transactions/${transaction.id}`);
            toast.success("Transaksi berhasil dihapus.");
            onDeleted?.();
        } catch (error: unknown) {
            console.error("Gagal menghapus transaksi:", error);
            let errorMessage = "Gagal menghapus transaksi.";
            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-slate-600 hover:bg-slate-100">
                        <Eye className="w-4 h-4" />
                        Detail
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white p-0">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle className="text-xl text-slate-900">Detail Transaksi</DialogTitle>
                    </DialogHeader>
                    <div className="p-6 space-y-4">
                        <div>
                            <Label htmlFor={`detail-tanggal-${transaction.id}`} className="text-sm font-medium text-slate-600">Tanggal</Label>
                            <Input id={`detail-tanggal-${transaction.id}`} value={transaction.tanggal} readOnly disabled className="mt-1 bg-slate-100 text-slate-900 cursor-default" />
                        </div>
                        <div>
                            <Label htmlFor={`detail-jenis-${transaction.id}`} className="text-sm font-medium text-slate-600">Jenis</Label>
                            <Input id={`detail-jenis-${transaction.id}`} value={transaction.jenis} readOnly disabled className="mt-1 bg-slate-100 text-slate-900 cursor-default" />
                        </div>
                        <div>
                            <Label htmlFor={`detail-jumlah-${transaction.id}`} className="text-sm font-medium text-slate-600">Jumlah</Label>
                            <Input id={`detail-jumlah-${transaction.id}`} value={`Rp ${transaction.amount.toLocaleString("id-ID")}`} readOnly disabled className="mt-1 bg-slate-100 text-slate-900 cursor-default" />
                        </div>
                        <div>
                            <Label htmlFor={`detail-kategori-${transaction.id}`} className="text-sm font-medium text-slate-600">Kategori</Label>
                            <Input id={`detail-kategori-${transaction.id}`} value={transaction.kategori} readOnly disabled className="mt-1 bg-slate-100 text-slate-900 cursor-default" />
                        </div>
                        <div>
                            <Label htmlFor={`detail-dompet-${transaction.id}`} className="text-sm font-medium text-slate-600">Dompet</Label>
                            <Input id={`detail-dompet-${transaction.id}`} value={transaction.dompet} readOnly disabled className="mt-1 bg-slate-100 text-slate-900 cursor-default" />
                        </div>
                        <div>
                            <Label htmlFor={`detail-keterangan-${transaction.id}`} className="text-sm font-medium text-slate-600">Keterangan</Label>
                            <Textarea
                                id={`detail-keterangan-${transaction.id}`}
                                value={transaction.source_or_usage || "-"}
                                readOnly
                                disabled
                                className="resize-none mt-1 bg-slate-100 text-slate-900 cursor-default"
                                rows={3}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => router.push(`/admin/keuangan/edit/${transaction.id}`)}
            >
                <Pencil className="w-4 h-4" />
                Edit
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700">
                        <Trash className="w-4 h-4" />
                        Hapus
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900">Hapus Transaksi?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600">
                            Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-end gap-2">
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto bg-white rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10"
                                disabled={loading}
                            >
                                Batal
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={handleDelete}
                                disabled={loading}
                                className="w-full sm:w-auto rounded-full bg-red-600 text-white hover:bg-red-700"
                            >
                                {loading ? "Menghapus..." : "Ya, Hapus"}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}