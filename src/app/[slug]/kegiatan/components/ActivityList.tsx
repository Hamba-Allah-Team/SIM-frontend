'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarX2, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import ActivityCard from './ActivityCard';
import { KegiatanItem } from '../types';
import { cn } from '@/lib/utils';

interface ActivityListProps {
    kegiatan: KegiatanItem[];
    isLoading: boolean;
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    type: 'upcoming' | 'past';
}

function KegiatanPageSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
        </div>
    )
}

export default function ActivityList({ kegiatan, isLoading, totalPages, currentPage, setCurrentPage, type }: ActivityListProps) {

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const getPaginationButtons = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > 3) {
                pageNumbers.push('...');
            }
            if (currentPage > 2 && currentPage < totalPages - 1) {
                pageNumbers.push(currentPage);
            }
            if (currentPage > 1 && currentPage < totalPages - 1 && currentPage + 1 < totalPages - 1) {
                pageNumbers.push(currentPage + 1);
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }
            if (totalPages > 1) pageNumbers.push(totalPages);
        }
        // Hapus duplikat elipsis jika ada
        return [...new Set(pageNumbers)];
    };

    if (isLoading) {
        return <KegiatanPageSkeleton />;
    }

    return (
        <div className="space-y-4">
            {kegiatan.length > 0 ? (
                kegiatan.map(item => <ActivityCard key={item.id} item={item} type={type} />)
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <CalendarX2 className="mx-auto w-16 h-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600">Tidak Ada Kegiatan</h3>
                    <p className="text-sm text-slate-400">
                        {type === 'upcoming' ? 'Belum ada kegiatan yang dijadwalkan.' : 'Tidak ada riwayat kegiatan yang ditemukan.'}
                    </p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                    <Button variant="outline" size="icon" onClick={handlePreviousPage} disabled={currentPage === 1} className="h-9 w-9 p-0 rounded-full">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    {getPaginationButtons().map((page, index) => {
                        const isActive = page === currentPage;
                        return typeof page === 'number' ? (
                            <Button
                                key={`${page}-${index}`}
                                variant={isActive ? "default" : "ghost"}
                                size="icon"
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    "h-9 w-9 p-0 rounded-full font-semibold transition-colors",
                                    isActive && "bg-[#FF9357] hover:bg-[#FF9357]/90 text-white",
                                    !isActive && "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                )}
                            >
                                {page}
                            </Button>
                        ) : (
                            <span key={`ellipsis-${index}`} className="flex items-center justify-center h-9 w-9 text-slate-400">
                                <MoreHorizontal className="h-5 w-5" />
                            </span>
                        );
                    })}

                    <Button variant="outline" size="icon" onClick={handleNextPage} disabled={currentPage === totalPages} className="h-9 w-9 p-0 rounded-full">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
    );
}