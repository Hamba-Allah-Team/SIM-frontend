"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useBreakpoint } from "./hook/useBreakpoint";

interface RoomItem {
    room_id: string;
    place_name: string;
    image: string;
}

interface GuestRoomListProps {
    slug: string;
    mosqueName: string;
}

export default function GuestRoomList({ slug }: GuestRoomListProps) {
    const [room, setRoom] = useState<RoomItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);
    const breakpoint = useBreakpoint();

    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
    if (!slug || !API) return;

    const fetchRoom = async () => {
    setLoading(true);
    setError(null);
    try {
        const res = await fetch(`${API}/api/guest/rooms/${slug}`);
        if (!res.ok) {
            const { message } = await res.json().catch(() => ({ message: null }));
            throw new Error(message || "Gagal memuat ruangan");
        }

        const json = await res.json();
        const items = Array.isArray(json.data) ? json.data : [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped = items.map((item: any) => ({
            ...item,
            room_id: item.room_id,
            image: item.image
                ? item.image.startsWith("http")
                ? item.image
                    : `${API}/uploads/${item.image}`
                    : "",
            }));
            setRoom(mapped);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan");
        } finally {
            setLoading(false);
    }
    };

    fetchRoom();
    }, [slug, API]);

    const handleDetailClick = (roomId: string) => {
        router.push(`/${slug}/reservasi/${roomId}`);
    };

    const initialVisibleCount = useMemo(() => {
        if (breakpoint === 'sm') return 2;
        if (breakpoint === 'md') return 3;
        return 6;
    }, [breakpoint]);

    const visibleRooms = useMemo(() => {
        return isExpanded ? room : room.slice(0, initialVisibleCount);
    }, [room, isExpanded, initialVisibleCount]);

    return (
        <div className="h-full w-full"> 
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 font-poppins text-3xl">Memuat ruangan...</p>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 font-poppins text-3xl">{error}</p>
                </div>
            ) : room.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 font-poppins text-3xl">Tidak ada ruangan tersedia.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
                        {visibleRooms.map((item) => (
                            <div
                                key={item.room_id}
                                className="rounded-lg p-4 text-center cursor-pointer transition-transform hover:scale-105"
                                onClick={() => handleDetailClick(item.room_id)}
                            >
                                <img
                                    src={item.image || "https://placehold.co/400x300/E0E0E0/333333?text=No+Image"}
                                    alt={item.place_name}
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                    onError={(e) => {
                                        const img = e.target as HTMLImageElement;
                                        img.onerror = null;
                                        img.src = "https://placehold.co/400x300/E0E0E0/333333?text=No+Image";
                                    }}
                                />
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">{item.place_name}</h3>
                                <Button
                                    onClick={() => handleDetailClick(item.room_id)}
                                >
                                    Lihat Detail
                                </Button>
                            </div>
                        ))}
                    </div>
                    {!isExpanded && room.length > initialVisibleCount && (
                        <Button
                            onClick={() => setIsExpanded(true)}
                            className="self-center mt-6"
                        >
                            Lebih Banyak
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}