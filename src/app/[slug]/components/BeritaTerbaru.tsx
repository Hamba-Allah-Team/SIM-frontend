import Link from 'next/link';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// 👈 Menambahkan interface untuk tipe data berita
interface Berita {
    id: number;
    img: string;
    title: string;
    date: string;
    excerpt?: string; // Opsional untuk berita sekunder
}

export function BeritaTerbaru({ berita, slug }: { berita: Berita[], slug: string }) {
    if (!berita || berita.length === 0) return null;

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
                        <Image src={beritaUtama.img} alt={beritaUtama.title} width={800} height={400} className="w-full h-64 object-cover" />
                        <CardHeader>
                            <p className="text-sm text-slate-500">{beritaUtama.date}</p>
                            <CardTitle className="text-2xl hover:text-[#FF9357] transition-colors"><Link href={`/${slug}/berita/${beritaUtama.id}`}>{beritaUtama.title}</Link></CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-slate-600">{beritaUtama.excerpt}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    {beritaSekunder.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                            <Image src={item.img} alt={item.title} width={100} height={100} className="w-24 h-24 object-cover rounded-lg" />
                            <div>
                                <p className="text-xs text-slate-500">{item.date}</p>
                                <h3 className="font-semibold text-slate-800 hover:text-[#FF9357] transition-colors"><Link href={`/${slug}/berita/${item.id}`}>{item.title}</Link></h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}