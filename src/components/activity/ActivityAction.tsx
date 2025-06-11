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
    DialogTrigger,
    // DialogClose,
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
import { toast } from "sonner";
import { Activity } from "@/app/admin/kegiatan/types";
import { deleteActivity, getFullImageUrl } from "@/app/admin/kegiatan/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { id as LocaleID } from 'date-fns/locale';
import axios from "axios";

const formatDateDetails = (dateString: string | null | undefined, includeTime = false) => {
    if (!dateString) return "-";
    try {
        const formatString = includeTime ? "dd MMM yy, HH:mm" : "dd MMMM yy";
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
        <div className="flex items-center justify-center gap-2">
            {/* Tombol Detail dengan Dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-slate-600 hover:bg-slate-100">
                        <Eye className="w-4 h-4" />
                        Detail
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg p-0 bg-white">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <DialogTitle className="text-xl text-slate-900">Detail Kegiatan</DialogTitle>
                        <DialogDescription className="text-slate-500">Informasi lengkap mengenai kegiatan &quot;{activity.event_name}&quot;.</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4">
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
                            <Label htmlFor={`detailEventName-${activity.activities_id}`} className="text-sm font-medium text-slate-600">Nama Kegiatan</Label>
                            <Input id={`detailEventName-${activity.activities_id}`} value={activity.event_name} readOnly disabled className="mt-1 bg-slate-100 text-slate-900 cursor-default" />
                        </div>
                        <div>
                            <Label htmlFor={`detailDescription-${activity.activities_id}`} className="text-sm font-medium text-slate-600">Deskripsi</Label>
                            <Textarea id={`detailDescription-${activity.activities_id}`} value={activity.event_description || "-"} readOnly disabled className="mt-1 bg-slate-100 text-slate-900 cursor-default resize-none" rows={4} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label className="text-sm font-medium text-slate-600">Tgl Mulai</Label><Input value={formatDateDetails(activity.start_date)} readOnly disabled className="mt-1 bg-slate-100 text-slate-900" /></div>
                            <div><Label className="text-sm font-medium text-slate-600">Jam Mulai</Label><Input value={formatTimeDetails(activity.start_time)} readOnly disabled className="mt-1 bg-slate-100 text-slate-900" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label className="text-sm font-medium text-slate-600">Tgl Selesai</Label><Input value={formatDateDetails(activity.end_date)} readOnly disabled className="mt-1 bg-slate-100 text-slate-900" /></div>
                            <div><Label className="text-sm font-medium text-slate-600">Jam Selesai</Label><Input value={formatTimeDetails(activity.end_time)} readOnly disabled className="mt-1 bg-slate-100 text-slate-900" /></div>
                        </div>
                        <div><Label className="text-sm font-medium text-slate-600">Dibuat</Label><Input value={formatDateDetails(activity.created_at, true)} readOnly disabled className="mt-1 bg-slate-100 text-slate-900" /></div>
                        <div><Label className="text-sm font-medium text-slate-600">Diperbarui</Label><Input value={formatDateDetails(activity.updated_at, true)} readOnly disabled className="mt-1 bg-slate-100 text-slate-900" /></div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Tombol Edit */}
            <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                onClick={handleEdit}
            >
                <Edit className="w-4 h-4" />
                Ubah
            </Button>

            {/* Tombol Hapus */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900">Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-600">
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus kegiatan
                            &quot;{activity.event_name}&quot; secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-end gap-2">
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto bg-white rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10"
                                disabled={isDeleting}
                            >
                                Batal
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="w-full sm:w-auto rounded-full bg-red-600 text-white hover:bg-red-700"
                            >
                                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}