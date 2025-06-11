'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from './components/PageHeader';
import ActivityList from './components/ActivityList';

export default function KegiatanPage() {
    return (
        <>
            <PageHeader title="Kegiatan Masjid" />
            <section className="container mx-auto px-4 py-12 md:py-16">
                <Tabs defaultValue="upcoming" className="w-full">
                    {/* 👈 Perbaikan Styling di sini */}
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
                    <TabsContent value="upcoming" className="mt-8">
                        <ActivityList type="upcoming" />
                    </TabsContent>
                    <TabsContent value="past" className="mt-8">
                        <ActivityList type="past" />
                    </TabsContent>
                </Tabs>
            </section>
        </>
    );
}