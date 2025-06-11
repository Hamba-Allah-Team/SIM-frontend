'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { apiClient as api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarX2, ChevronLeft, ChevronRight } from 'lucide-react';
import ActivityCard from './ActivityCard';

interface KegiatanItem {
    id: number; day: string; month: string; title: string; location: string;
    image: string | null; description: string | null; full_date: string; time: string;
}

interface ActivityListProps {
    type: 'upcoming' | 'past';
}

// Fungsi untuk mengambil data dari backend dengan dinamis
const fetchActivities = async (slug: string, type: 'upcoming' | 'past', page: number, limit: number): Promise<{ data: KegiatanItem[], totalPages: number }> => {
    // Memilih endpoint API berdasarkan tipe yang diminta
    const endpoint = type === 'upcoming' ? `/api/public/activities/all/${slug}` : `/api/public/activities/past/${slug}`;
    try {
        const response = await api.get(endpoint, { params: { page, limit } });
        return response.data;
    } catch (error) {
        console.error(`Gagal mengambil data kegiatan (${type}):`, error);
        return { data: [], totalPages: 0 };
    }
};

function KegiatanPageSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
        </div>
    )
}

export default function ActivityList({ type }: ActivityListProps) {
    const params = useParams();
    const slug = params.slug as string;

    const [kegiatan, setKegiatan] = useState<KegiatanItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 10;

    const fetchData = useCallback(async (page: number) => {
        setIsLoading(true);
        const response = await fetchActivities(slug, type, page, limit);
        setKegiatan(response.data);
        setTotalPages(response.totalPages);
        setIsLoading(false);
    }, [slug, type]);

    useEffect(() => {
        // Efek ini akan berjalan setiap kali 'type' (tab) berubah
        if (slug) {
            setCurrentPage(1); // Selalu reset ke halaman 1 saat tab diganti
            fetchData(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, type]);

    useEffect(() => {
        // Efek ini berjalan saat halaman paginasi diubah
        if (slug && currentPage > 1) {
            fetchData(currentPage);
        }
    }, [currentPage, fetchData, slug]);

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    if (isLoading) {
        return <KegiatanPageSkeleton />;
    }

    return (
        <div className="space-y-4">
            {kegiatan.length > 0 ? (
                // Meneruskan 'type' ke ActivityCard agar bisa dibedakan tampilannya
                kegiatan.map(item => <ActivityCard key={item.id} item={item} type={type} />)
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <CalendarX2 className="mx-auto w-16 h-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600">Tidak Ada Kegiatan</h3>
                    <p className="text-sm text-slate-400">
                        {type === 'upcoming' ? 'Belum ada kegiatan mendatang yang dijadwalkan.' : 'Tidak ada riwayat kegiatan yang ditemukan.'}
                    </p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                    <Button variant="outline" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium text-slate-700">Halaman {currentPage} dari {totalPages}</span>
                    <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}