'use client'; // 👈 Halaman ini sekarang menjadi Client Component

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { apiClient as api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarX2, ChevronLeft, ChevronRight } from 'lucide-react';

// Impor komponen yang akan kita buat di bawah
import PageHeader from './components/PageHeader';
import ActivityCard from './components/ActivityCard';

interface KegiatanItem {
    id: number;
    day: string;
    month: string;
    title: string;
    location: string;
    image: string | null;
    description: string | null;
    full_date: string;
    time: string;
}

// Fungsi untuk mengambil data dari backend dengan paginasi
async function getAllKegiatanPage(slug: string, page: number, limit: number): Promise<{ data: KegiatanItem[], totalPages: number }> {
    try {
        const response = await api.get(`/api/public/activities/all/${slug}`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil data semua kegiatan:", error);
        return { data: [], totalPages: 0 }; // Kembalikan nilai default jika gagal
    }
}

function KegiatanPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <Skeleton className="h-10 w-1/3 mb-8" />
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        </div>
    )
}

export default function KegiatanPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [kegiatan, setKegiatan] = useState<KegiatanItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 10; // Jumlah item per halaman

    const fetchData = useCallback(async (page: number) => {
        setIsLoading(true);
        const response = await getAllKegiatanPage(slug, page, limit);
        setKegiatan(response.data);
        setTotalPages(response.totalPages);
        setIsLoading(false);
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetchData(currentPage);
        }
    }, [slug, currentPage, fetchData]);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    return (
        <>
            <PageHeader title="Kegiatan" />
            <section className="container mx-auto px-4 py-16 md:py-24">
                {isLoading ? (
                    <KegiatanPageSkeleton />
                ) : (
                    <div className="space-y-4">
                        {kegiatan.length > 0 ? (
                            kegiatan.map(item => (
                                <ActivityCard key={item.id} item={item} />
                            ))
                        ) : (
                            // 👈 PERBAIKAN DI SINI: Tampilan empty state yang lebih baik
                            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                                <CalendarX2 className="mx-auto w-16 h-16 text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-600">Tidak Ada Kegiatan</h3>
                                <p className="text-sm text-slate-400">Belum ada kegiatan mendatang yang dijadwalkan.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Kontrol Paginasi */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-slate-700">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || isLoading}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </section>
        </>
    );
}