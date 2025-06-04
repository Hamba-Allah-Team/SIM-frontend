"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner"; // 👈 Menggunakan sonner untuk toast
import { Activity } from "@/app/admin/kegiatan/types";
import { deleteActivity, getFullImageUrl } from "@/app/admin/kegiatan/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { id as LocaleID } from 'date-fns/locale';
import axios from "axios"; // Untuk type checking error

// Helper dari columns.tsx (bisa dipindahkan ke file helper umum jika sering dipakai)
const formatDateDetails = (dateString: string | null | undefined, includeTime = false) => {
    if (!dateString) return "-";
    try {
        const formatString = includeTime ? "dd MMM yyyy, HH:mm" : "dd MMMM yyyy"; // Menggunakan yyyy untuk tahun
        return format(new Date(dateString), formatString, { locale: LocaleID });
    } catch (e) {
        console.error("Invalid date for formatDateDetails:", dateString, e);
        return "Tanggal/Waktu Tidak Valid";
    }
};

const formatTimeDetails = (timeString: string | null | undefined) => {
    if (!timeString) return "-";
    const parts = timeString.split(':');
    if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
};


interface ActivityActionsProps {
    activity: Activity;
    onDeleted: () => void;
}

export default function ActivityActions({ activity, onDeleted }: ActivityActionsProps) {
    const router = useRouter();
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = () => {
        router.push(`/admin/kegiatan/edit/${activity.activities_id}`);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await deleteActivity(activity.activities_id);
            toast.success("Kegiatan berhasil dihapus."); // 👈 Menggunakan sonner toast.success
            onDeleted();
        } catch (error: unknown) { // 👈 Menggunakan unknown untuk error
            console.error("Gagal menghapus kegiatan:", error);
            let errorMessage = "Terjadi kesalahan saat menghapus kegiatan.";
            if (axios.isAxiosError(error)) { // 👈 Type checking dengan axios
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage); // 👈 Menggunakan sonner toast.error
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    const fullImageUrl = getFullImageUrl(activity.image);

    return (
        <TooltipProvider>
            <div className="flex items-center justify-center gap-1">
                {/* Tombol Detail */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            onClick={() => setShowDetailDialog(true)}
                        >
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">Detail Kegiatan</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Detail Kegiatan</p>
                    </TooltipContent>
                </Tooltip>

                {/* Tombol Edit */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={handleEdit}
                        >
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">Ubah Kegiatan</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Ubah Kegiatan</p>
                    </TooltipContent>
                </Tooltip>

                {/* Tombol Hapus */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            // onClick={() => setIsDeleteDialogOpen(true)} // Dihapus karena AlertDialogTrigger sudah handle
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="sr-only">Hapus Kegiatan</span>
                            </Button>
                        </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Hapus Kegiatan</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            {/* Dialog untuk Detail Kegiatan */}
            <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
                <DialogContent className="sm:max-w-lg p-0">
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="text-xl">Detail Kegiatan</DialogTitle>
                        <DialogDescription>Informasi lengkap mengenai kegiatan &quot;{activity.event_name}&quot;.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto px-6 pb-6 space-y-4">
                        {fullImageUrl && (
                            <div className="mb-4 rounded-md overflow-hidden border aspect-video relative w-full">
                                <Image
                                    src={fullImageUrl}
                                    alt={activity.event_name || "Gambar Kegiatan"}
                                    layout="fill"
                                    objectFit="contain"
                                    unoptimized
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://placehold.co/400x225/E2E8F0/94A3B8?text=Gambar+Tidak+Tersedia";
                                        (e.target as HTMLImageElement).alt = "Gambar tidak tersedia";
                                    }}
                                />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="detailEventName" className="text-sm font-medium text-gray-700">Nama Kegiatan</Label>
                            <Input id="detailEventName" value={activity.event_name} readOnly disabled className="mt-1 bg-gray-50 cursor-default" />
                        </div>
                        <div>
                            <Label htmlFor="detailDescription" className="text-sm font-medium text-gray-700">Deskripsi</Label>
                            <Textarea
                                id="detailDescription"
                                value={activity.event_description || "-"}
                                readOnly
                                disabled
                                className="mt-1 bg-gray-50 cursor-default resize-none"
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="detailStartDate" className="text-sm font-medium text-gray-700">Tanggal Mulai</Label>
                                <Input id="detailStartDate" value={formatDateDetails(activity.start_date)} readOnly disabled className="mt-1 bg-gray-50 cursor-default" />
                            </div>
                            <div>
                                <Label htmlFor="detailStartTime" className="text-sm font-medium text-gray-700">Waktu Mulai</Label>
                                <Input id="detailStartTime" value={formatTimeDetails(activity.start_time)} readOnly disabled className="mt-1 bg-gray-50 cursor-default" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="detailEndDate" className="text-sm font-medium text-gray-700">Tanggal Selesai</Label>
                                <Input id="detailEndDate" value={formatDateDetails(activity.end_date)} readOnly disabled className="mt-1 bg-gray-50 cursor-default" />
                            </div>
                            <div>
                                <Label htmlFor="detailEndTime" className="text-sm font-medium text-gray-700">Waktu Selesai</Label>
                                <Input id="detailEndTime" value={formatTimeDetails(activity.end_time)} readOnly disabled className="mt-1 bg-gray-50 cursor-default" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="detailCreatedAt" className="text-sm font-medium text-gray-700">Dibuat Pada</Label>
                            <Input id="detailCreatedAt" value={formatDateDetails(activity.created_at, true)} readOnly disabled className="mt-1 bg-gray-50 cursor-default" />
                        </div>
                        <div>
                            <Label htmlFor="detailUpdatedAt" className="text-sm font-medium text-gray-700">Diperbarui Pada</Label>
                            <Input id="detailUpdatedAt" value={formatDateDetails(activity.updated_at, true)} readOnly disabled className="mt-1 bg-gray-50 cursor-default" />
                        </div>
                    </div>
                    <DialogFooter className="p-6 pt-0">
                        <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Tutup</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AlertDialog untuk Konfirmasi Hapus */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kegiatan
                            &quot;{activity.event_name}&quot; secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TooltipProvider>
    );
}