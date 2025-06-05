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
    DialogTrigger,
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
import { toast } from "sonner";
import { Activity } from "@/app/admin/kegiatan/types"; // Path disesuaikan
import { deleteActivity, getFullImageUrl } from "@/app/admin/kegiatan/utils"; // Path disesuaikan
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { id as LocaleID } from 'date-fns/locale';
import axios from "axios";

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
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = () => {
        router.push(`/admin/kegiatan/edit/${activity.activities_id}`);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await deleteActivity(activity.activities_id);
            toast.success("Kegiatan berhasil dihapus.");
            onDeleted();
        } catch (error: unknown) {
            console.error("Gagal menghapus kegiatan:", error);
            let errorMessage = "Terjadi kesalahan saat menghapus kegiatan.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const fullImageUrl = getFullImageUrl(activity.image);

    return (
        <TooltipProvider>
            <div className="flex items-center justify-center gap-1">
                {/* Tombol Detail dengan Dialog */}
                <Dialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span className="sr-only">Detail Kegiatan</span>
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Detail Kegiatan</p>
                        </TooltipContent>
                    </Tooltip>
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
                                <Label htmlFor={`detailEventName-${activity.activities_id}`} className="text-sm font-medium text-gray-700">Nama Kegiatan</Label>
                                <Input id={`detailEventName-${activity.activities_id}`} value={activity.event_name} readOnly disabled className="mt-1 bg-gray-50 cursor-default" />
                            </div>
                            <div>
                                <Label htmlFor={`detailDescription-${activity.activities_id}`} className="text-sm font-medium text-gray-700">Deskripsi</Label>
                                <Textarea id={`detailDescription-${activity.activities_id}`} value={activity.event_description || "-"} readOnly disabled className="mt-1 bg-gray-50 cursor-default resize-none" rows={4} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label className="text-sm font-medium">Tgl Mulai</Label><Input value={formatDateDetails(activity.start_date)} readOnly disabled className="mt-1 bg-gray-50" /></div>
                                <div><Label className="text-sm font-medium">Jam Mulai</Label><Input value={formatTimeDetails(activity.start_time)} readOnly disabled className="mt-1 bg-gray-50" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label className="text-sm font-medium">Tgl Selesai</Label><Input value={formatDateDetails(activity.end_date)} readOnly disabled className="mt-1 bg-gray-50" /></div>
                                <div><Label className="text-sm font-medium">Jam Selesai</Label><Input value={formatTimeDetails(activity.end_time)} readOnly disabled className="mt-1 bg-gray-50" /></div>
                            </div>
                            <div><Label className="text-sm font-medium">Dibuat</Label><Input value={formatDateDetails(activity.created_at, true)} readOnly disabled className="mt-1 bg-gray-50" /></div>
                            <div><Label className="text-sm font-medium">Diperbarui</Label><Input value={formatDateDetails(activity.updated_at, true)} readOnly disabled className="mt-1 bg-gray-50" /></div>
                        </div>
                        <DialogFooter className="p-6 pt-0">
                            {/* Tombol Tutup bisa menjadi DialogClose agar lebih semantik */}
                            {/* <DialogClose asChild> */}
                            <Button variant="outline">Tutup</Button>
                            {/* </DialogClose> */}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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

                {/* Tombol Hapus dengan AlertDialog */}
                <AlertDialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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
            </div>
        </TooltipProvider>
    );
}