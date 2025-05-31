"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TransactionCategory } from "@/app/admin/kategori/types";
import { toast } from "sonner";
import api from "@/lib/api";

interface Props {
    category: TransactionCategory;
    onDeleted?: () => void;
}

export default function CategoryActions({ category, onDeleted }: Props) {
    const router = useRouter();
    const [showDetail, setShowDetail] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = async () => {
        try {
            await api.delete(`/api/finance/categories/${category.id}`);
            toast.success("Kategori berhasil dihapus.");
            onDeleted?.();
        } catch (error) {
            console.error("Gagal menghapus kategori:", error);
            toast.error("Gagal menghapus kategori.");
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
                    onClick={() => router.push(`/admin/kategori/edit/${category.id}`)}
                >
                    Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                    Hapus
                </Button>
            </div>

            {/* Modal Detail dengan Field ReadOnly */}
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

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Hapus</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-gray-700">
                        Apakah Anda yakin ingin menghapus kategori <strong>{category.name}</strong>?
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
