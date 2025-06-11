"use client"

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Reservation = {
    reservation_id: number;
    title: string;
    name: string;
    phone_number: string;
    room_id: number;
    reservation_date: string;
    description: string;
    start_time: string;
    end_time: string;
    status: "pending" | "approved" | "rejected" | "completed";
    created_at: string;
    updated_at: string;
    room: {
        place_name: string;
    }
    admin: {
        name: string;
    }
};

type DetailDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reservationId: number | null;
};

const API = process.env.NEXT_PUBLIC_API_URL;

export function DetailDialog({ open, onOpenChange, reservationId }: DetailDialogProps) {
    const [ reservation, setReservation ] = useState<Reservation | null>(null);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const fetchReservation = async () => {
            if (open && reservationId !== null) {
                setLoading(true);
                try {
                    const token = localStorage.getItem("token");
                    const res = await fetch(`${API}/api/reservations/${reservationId}`, {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : "",
                        },
                    });

                    if (!res.ok) throw new Error("Gagal mengambil detail reservasi");

                    const json = await res.json();
                    setReservation(json.data || null);
                } catch (error) {
                    console.error("Error saat mengambil reservasi:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchReservation();
    }, [open, reservationId]);

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-white text-black">
                <DialogHeader>
                    <DialogTitle>
                        <label className="text-[28px] font-bold font-poppins text-black">Detail Reservasi</label>
                    </DialogTitle>
                    {loading ? (
                        <div className="mt-4 space-y-4">
                            <p className="animate-pulse">Loading...</p>
                        </div>
                    ) : reservation ? (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-[16px] font-semibold font-poppins text-black">Judul Reservasi</label>
                                <input
                                    type="text"
                                    value={reservation.title}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-[16px] font-semibold font-poppins text-black">Nama Pemesan</label>
                                <input 
                                    type="text"
                                    value={reservation.name}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-[16px] font-semibold font-poppins text-black">Nomor Telepon</label>
                                <input
                                    type="text"
                                    value={reservation.phone_number}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-[16px] font-semibold font-poppins text-black">Nama Ruangan</label>
                                <input
                                    type="text"
                                    value={reservation.room?.place_name ? reservation.room.place_name : " - "}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-[16px] font-semibold font-poppins text-black">Deskripsi</label>
                                <textarea
                                    value={reservation.description}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2 h-24 resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-[16px] font-semibold font-poppins text-black">Tanggal Reservasi</label>
                                <input
                                    type="text"
                                    value={new Date(reservation.reservation_date).toLocaleDateString("id-ID")}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[16px] font-semibold font-poppins text-black">Waktu Mulai</label>
                                    <input
                                        type="text"
                                        value={reservation.start_time}
                                        readOnly
                                        className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-[16px] font-semibold font-poppins text-black">Waktu Selesai</label>
                                    <input
                                        type="text"
                                        value={reservation.end_time}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[16px] font-semibold font-poppins text-black">Status</label>
                                <input
                                    value={reservation.status}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="text-[16px] font-semibold font-poppins text-black">Penanggung Jawab</label>
                                <input
                                    type="text"
                                    value={reservation.admin?.name ? reservation.admin.name : " - "}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-red-600">Konten tidak ditemukan.</div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}