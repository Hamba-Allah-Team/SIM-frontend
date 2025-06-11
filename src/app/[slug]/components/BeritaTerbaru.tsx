import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenText, Newspaper } from 'lucide-react';

// 👈 Menambahkan interface untuk tipe data berita
interface Berita {
    id: number;
    title: string;
    date: string;
    excerpt?: string; // Opsional untuk berita sekunder
}

export function BeritaTerbaru({ berita, slug }: { berita: Berita[], slug: string }) {
    if (!berita || berita.length === 0) return (
        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-[#0A1E4A]">Berita Terbaru</h2>
                <Button variant="outline" asChild className="border-[#FF9357] text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357] bg-orange-50">
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
                    <Link href={`/${slug}/berita`}>Berita Lainnya</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="bg-white shadow-lg border-l-4 border-orange-400 h-full flex flex-col p-8 justify-center">
                        <CardHeader className="p-0">
                            <p className="text-sm text-slate-500 mb-2">{beritaUtama.date}</p>
                            <CardTitle className="text-3xl text-slate-800 hover:text-[#FF9357] transition-colors leading-tight">
                                <Link href={`/${slug}/berita/${beritaUtama.id}`}>{beritaUtama.title}</Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow p-0 mt-4">
                            <p className="text-slate-600 line-clamp-3 leading-relaxed">{beritaUtama.excerpt}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-4">
                    {beritaSekunder.map(item => (
                        <Link key={item.id} href={`/${slug}/berita/${item.id}`} className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-50 p-3 rounded-lg mt-1">
                                    <BookOpenText className="w-5 h-5 text-orange-500" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-xs text-slate-500">{item.date}</p>
                                    <h3 className="font-semibold text-slate-800 leading-tight">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}