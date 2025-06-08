import { Button } from "@/components/ui/button";
import Link from "next/link";

interface KegiatanItem {
    id: number;
    day: string;
    month: string;
    title: string;
    location: string;
}

// --- File: src/app/[slug]/components/KegiatanMendatang.tsx ---
export function KegiatanMendatang({ kegiatan, slug }: { kegiatan: KegiatanItem[], slug: string }) {
    if (!kegiatan || kegiatan.length === 0) return null;
    return (
        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#0A1E4A]">Kegiatan Mendatang</h2>
                <Button variant="outline" asChild className="border-[#FF9357] text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357]">
                    <Link href={`/${slug}/kegiatan`} className="bg-orange-50">Kegiatan Lainnya</Link>
                </Button>
            </div>
            <div className="space-y-4">
                {kegiatan.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-6 hover:shadow-xl transition-shadow">
                        <div className="text-center border-r pr-6">
                            <p className="text-3xl font-bold text-[#FF9357]">{item.day}</p>
                            <p className="text-slate-500">{item.month}</p>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                            <p className="text-sm text-slate-500">{item.location}</p>
                        </div>
                        <Button variant="ghost" className="text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357]">Lihat Detail</Button>
                    </div>
                ))}
            </div>
        </section>
    );
}