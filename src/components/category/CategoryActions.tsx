"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { TransactionCategory } from "@/app/admin/kategori/types";
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
    AlertDialogDescription, // Pastikan ini diimpor
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label"; // Tambahkan impor Label
import axios from "axios";

interface Props {
    category: TransactionCategory;
    onDeleted?: () => void;
}

export default function CategoryActions({ category, onDeleted }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`/api/finance/categories/${category.id}`);
            toast.success("Kategori berhasil dihapus.");
            onDeleted?.();
        } catch (error: unknown) {
            console.error("Gagal menghapus kategori:", error);
            let errorMessage = "Gagal menghapus kategori.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {/* Detail */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-slate-600 hover:bg-slate-100">
                        <Eye className="w-4 h-4" />
                        Detail
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900">Detail Kategori</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label className="text-sm font-medium text-slate-600">Nama Kategori</Label>
                            <Input value={category.name} readOnly disabled className="mt-1 bg-slate-100 text-slate-900" />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-slate-600">Tipe</Label>
                            <Input
                                value={category.type === "income" ? "Pemasukan" : "Pengeluaran"}
                                readOnly
                                disabled
                                className="mt-1 bg-slate-100 text-slate-900"
                            />
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-slate-600">Deskripsi</Label>
                            <Textarea
                                value={category.description || "-"}
                                readOnly
                                disabled
                                className="resize-none mt-1 bg-slate-100 text-slate-900"
                                rows={3}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit */}
            <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={() => router.push(`/admin/kategori/edit/${category.id}`)}
            >
                <Pencil className="w-4 h-4" />
                Edit
            </Button>

            {/* Delete */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash className="w-4 h-4" />
                        Hapus
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900">Hapus Kategori?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600">
                            Apakah Anda yakin ingin menghapus kategori <strong>{category.name}</strong>? Tindakan ini tidak dapat dibatalkan.
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