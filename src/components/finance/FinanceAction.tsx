"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Pencil, Trash } from "lucide-react";
import api from "@/lib/api";
import { Keuangan } from "@/app/admin/keuangan/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
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
// import { Label } from "@/components/ui/label";
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
                <DialogContent className="sm:max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900">Detail Transaksi</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 text-slate-800">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-sm text-slate-500">Tanggal</span>
                            <span className="font-medium">{transaction.tanggal}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-sm text-slate-500">Jenis</span>
                            <span className={`font-medium ${transaction.jenis === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>{transaction.jenis}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-sm text-slate-500">Jumlah</span>
                            <span className={`font-medium ${transaction.jenis === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>Rp {transaction.amount.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-sm text-slate-500">Kategori</span>
                            <span className="font-medium">{transaction.kategori}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-sm text-slate-500">Dompet</span>
                            <span className="font-medium">{transaction.dompet}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-sm text-slate-500">Keterangan</span>
                            <p className="font-medium p-2 bg-slate-50 rounded-md">{transaction.source_or_usage || '-'}</p>
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
                                className="w-full sm:w-auto rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10"
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