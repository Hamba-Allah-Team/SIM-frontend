'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from './components/PageHeader';
import ActivityList from './components/ActivityList';
import { apiClient as api } from '@/lib/api-client';
import { KegiatanItem } from './types'; // Asumsi Anda punya file types.ts

export default function KegiatanPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [kegiatan, setKegiatan] = useState<KegiatanItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 10;

    const fetchData = useCallback(async (page: number, type: 'upcoming' | 'past') => {
        if (!slug) return;
        setIsLoading(true);
        const endpoint = type === 'upcoming' ? `/api/public/activities/all/${slug}` : `/api/public/activities/past/${slug}`;
        try {
            const response = await api.get(endpoint, { params: { page, limit } });
            setKegiatan(response.data.data || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error(`Gagal mengambil data kegiatan (${type}):`, error);
            setKegiatan([]);
            setTotalPages(0);
        } finally {
            setIsLoading(false);
        }
    }, [slug]);

    // Efek untuk mengambil data saat tab atau halaman berubah
    useEffect(() => {
        fetchData(currentPage, activeTab);
    }, [activeTab, currentPage, fetchData]);

    // Handler saat tab diubah
    const handleTabChange = (value: string) => {
        setCurrentPage(1); // Selalu reset ke halaman 1 saat tab diganti
        setActiveTab(value as 'upcoming' | 'past');
    };

    return (
        <>
            <PageHeader title="Kegiatan Masjid" />
            <section className="container mx-auto px-4 py-12 md:py-16">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12 p-1 bg-slate-200/75 rounded-full">
                        <TabsTrigger
                            value="upcoming"
                            className="rounded-full text-sm font-medium text-slate-600 transition-all data-[state=active]:bg-[#FF9357] data-[state=active]:text-white data-[state=active]:shadow-lg"
                        >
                            Akan Datang
                        </TabsTrigger>
                        <TabsTrigger
                            value="past"
                            className="rounded-full text-sm font-medium text-slate-600 transition-all data-[state=active]:bg-[#FF9357] data-[state=active]:text-white data-[state=active]:shadow-lg"
                        >
                            Kegiatan Lampau
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-8">
                        <ActivityList
                            kegiatan={kegiatan}
                            isLoading={isLoading}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            type={activeTab}
                        />
                    </div>
                </Tabs>
            </section>
        </>
    );
}