"use client";

import { ColumnDef } from "@tanstack/react-table";
// import Image from "next/image"; // Impor kembali Image
import { Activity } from "./types";
import ActivityActions from "@/components/activity/ActivityAction"; // Sesuaikan path jika perlu
// import { getFullImageUrl } from "./utils"; // Impor kembali getFullImageUrl
import { format } from 'date-fns';
import { id as LocaleID } from 'date-fns/locale';

// Helper untuk format tanggal dan waktu
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    try {
        return format(new Date(dateString), "dd MMM yyyy", { locale: LocaleID });
    } catch (e) { // Menggunakan variabel 'e' atau '_' jika tidak digunakan
        console.error("Invalid date string for formatDate:", dateString, e);
        return "Tanggal Tidak Valid";
    }
};

const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return "-";
    const parts = timeString.split(':');
    if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`; // Format HH:mm
    }
    return timeString;
};


export const columns = (
    onActionSuccess: () => void
): ColumnDef<Activity>[] => [
        // {
        //     accessorKey: "image",
        //     header: () => <div className="text-center min-w-[100px]">Gambar</div>,
        //     cell: ({ row }) => {
        //         const imageUrl = getFullImageUrl(row.original.image);
        //         return (
        //             <div className="flex justify-center items-center h-16 w-24 mx-auto overflow-hidden rounded-md border bg-gray-50">
        //                 {imageUrl ? (
        //                     <Image
        //                         src={imageUrl}
        //                         alt={row.original.event_name || "Gambar Kegiatan"}
        //                         width={96}
        //                         height={64}
        //                         className="object-cover h-full w-full"
        //                         onError={(e) => {
        //                             (e.target as HTMLImageElement).src = "https://placehold.co/96x64/E2E8F0/94A3B8?text=Error";
        //                             (e.target as HTMLImageElement).alt = "Gagal memuat gambar";
        //                         }}
        //                         unoptimized // Tambahkan ini jika gambar dari domain eksternal (backend Anda) untuk menghindari error optimasi Next.js
        //                     />
        //                 ) : (
        //                     <div className="text-xs text-gray-400 flex items-center justify-center h-full">
        //                         Tidak Ada Gambar
        //                     </div>
        //                 )}
        //             </div>
        //         );
        //     },
        // },
        {
            accessorKey: "event_name",
            header: () => <div className="min-w-[200px]">Nama Kegiatan</div>,
            cell: ({ row }) => <div className="font-medium whitespace-nowrap">{row.getValue("event_name")}</div>,
        },
        {
            accessorKey: "start_date",
            header: "Tanggal Mulai",
            cell: ({ row }) => formatDate(row.getValue("start_date")),
        },
        {
            accessorKey: "start_time",
            header: "Jam Mulai", // Mengganti "Waktu Mulai" menjadi "Jam Mulai"
            cell: ({ row }) => formatTime(row.getValue("start_time")),
        },
        // {
        //     accessorKey: "end_date",
        //     header: "Tanggal Selesai",
        //     cell: ({ row }) => formatDate(row.getValue("end_date")),
        // },
        // {
        //     accessorKey: "end_time",
        //     header: "Jam Selesai", // Mengganti "Waktu Selesai" menjadi "Jam Selesai"
        //     cell: ({ row }) => formatTime(row.getValue("end_time")),
        // },
        {
            id: "actions",
            header: () => <div className="text-center min-w-[100px]">Aksi</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <ActivityActions activity={row.original} onDeleted={onActionSuccess} />
                </div>
            ),
        },
    ];