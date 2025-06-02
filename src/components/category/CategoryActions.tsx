"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { TransactionCategory } from "@/app/admin/kategori/types";
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
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

interface Props {
    category: TransactionCategory;
    onDeleted?: () => void;
}

export default function CategoryActions({ category, onDeleted }: Props) {
    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/finance/categories/${category.id}`);
            toast.success("Kategori berhasil dihapus.");
            onDeleted?.();
        } catch (error) {
            console.error("Gagal menghapus kategori:", error);
            toast.error("Gagal menghapus kategori.");
        }
    };

    return (
        <TooltipProvider>
            <div className="flex items-center gap-2">
                {/* Detail */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => setShowDetail(true)}
                        >
                            <Eye className="w-4 h-4" />
                            Detail
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Detail</TooltipContent>
                </Tooltip>

                {/* Edit */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-blue-600 hover:bg-blue-100"
                            onClick={() => router.push(`/admin/kategori/edit/${category.id}`)}
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit</TooltipContent>
                </Tooltip>

                {/* Delete */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1 text-red-600 hover:bg-red-100"
                                >
                                    <Trash className="w-4 h-4" />
                                    Hapus
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <p>
                                    Apakah Anda yakin ingin menghapus kategori{" "}
                                    <strong>{category.name}</strong>?
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
                        <DialogTitle>Detail Kategori</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nama Kategori</label>
                            <Input value={category.name} readOnly disabled />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Tipe</label>
                            <Input
                                value={category.type === "income" ? "Pemasukan" : "Pengeluaran"}
                                readOnly
                                disabled
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Deskripsi</label>
                            <Textarea
                                value={category.description || "-"}
                                readOnly
                                disabled
                                className="resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
