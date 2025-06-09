import Link from 'next/link';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

// 👈 Menambahkan interface untuk tipe data berita
interface Berita {
    id: number;
    img: string;
    title: string;
    date: string;
    excerpt?: string; // Opsional untuk berita sekunder
}

export function BeritaTerbaru({ berita, slug }: { berita: Berita[], slug: string }) {
    if (!berita || berita.length === 0) return (
        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#0A1E4A]">Berita Terbaru</h2>
                <Button variant="outline" asChild className="border-[#FF9357] text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357]">
                    <Link href={`/${slug}/berita`}>Berita Lainnya</Link>
                </Button>
            </div>
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <Newspaper className="mx-auto w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-600">Belum Ada Berita</h3>
                <p className="text-sm text-slate-400">Berita terbaru dari masjid akan ditampilkan di sini.</p>
            </div>
        </section>
    );

    const [beritaUtama, ...beritaSekunder] = berita;
    return (
        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#0A1E4A]">Berita Terbaru</h2>
                <Button variant="outline" asChild className="border-[#FF9357] text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357]">
                    <Link href={`/${slug}/berita`} className="bg-orange-50">Berita Lainnya</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="overflow-hidden shadow-lg border-0 h-full flex flex-col">
                        <div className="relative w-full h-64">
                            <Image src={beritaUtama.img} alt={beritaUtama.title} layout="fill" className="object-cover" />
                        </div>
                        <CardHeader>
                            <p className="text-sm text-slate-500">{beritaUtama.date}</p>
                            <CardTitle className="text-2xl text-slate-800 hover:text-[#FF9357] transition-colors"><Link href={`/${slug}/berita/${beritaUtama.id}`}>{beritaUtama.title}</Link></CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-slate-600">{beritaUtama.excerpt}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4">
                    {/* 👈 Perbaikan di sini */}
                    {beritaSekunder.map(item => (
                        <Card key={item.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow overflow-hidden">
                            <div className="flex items-start gap-4 p-4">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <Image src={item.img} alt={item.title} layout="fill" className="object-cover rounded-md" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-xs text-slate-500 mb-1">{item.date}</p>
                                    <h3 className="font-semibold text-slate-800 hover:text-[#FF9357] transition-colors leading-tight mb-2">
                                        <Link href={`/${slug}/berita/${item.id}`}>{item.title}</Link>
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">{item.excerpt}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}