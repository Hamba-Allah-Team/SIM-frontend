"use client"

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Room = {
    room_id: number;
    place_name: string;
    image?: string;
    description: string;
}

type DetailDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roomId: number | null;
};

const API = process.env.NEXT_PUBLIC_API_URL;

export function DetailDialog({ open, onOpenChange, roomId }: DetailDialogProps) {
    const [ room, setRoom ] = useState<Room | null>(null);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const fetchRoom = async () => {
            if (open && roomId !== null) {
                setLoading(true);
                try {
                    const token = localStorage.getItem("token");
                    const res = await fetch(`${API}/api/rooms/${roomId}`, {
                        headers: {
                            Authorization: token ? `Bearer ${token}` : "",
                        },
                    });

                    if (!res.ok) throw new Error("Gagal mengambil detail ruangan");

                    const json = await res.json();
                    setRoom(json.data || null);
                } catch (error) {
                    console.error("Error saat mengambil ruangan:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRoom();
    }, [open, roomId]);

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-white text-black">
                <DialogHeader>
                    <DialogTitle>
                        <label className="text-[28px] font-bold font-poppins text-black">Detail Room</label>
                    </DialogTitle>
                    {loading ? (
                        <div className="mt-4 space-y-4">
                            <p className="animate-pulse">Loading...</p>
                        </div>
                    ) : room ? (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label className="text-[16px] font-semibold font-poppins text-black">Nama Ruangan</label>
                                <input 
                                    type="text"
                                    value={room.place_name}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                                <div className="mt-4 space-y-4">
                                <label className="text-[16px] font-semibold font-poppins text-black">Deskripsi</label>
                                <textarea
                                    value={room.description}
                                    readOnly
                                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2 h-24 resize-none"
                                />
                            </div>
                            {room.image && (
                                <div>
                                    <label className="text-[16px] font-semibold font-poppins text-black">Foto Cover Konten</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            value={room.image.split("/").pop() || ""}
                                            readOnly
                                            className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                                        />
                                        <div className="mt-2 flex justify-center">
                                            <img
                                                src={room.image ? `${API}/uploads/${room.image}` : ""}
                                                alt={room.place_name}
                                                className="max-w-full max-h-48 object-contain rounded border"
                                                onError={(e) => {
                                                    const img = e.target as HTMLImageElement;
                                                    img.onerror = null;
                                                    img.src = `https://placehold.co/400x300/E0E0E0/333333?text=No+Image`;
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                )}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-red-600">Konten tidak ditemukan.</div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}