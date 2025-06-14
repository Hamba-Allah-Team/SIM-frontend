import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { CalendarX2, Clock, MapPin } from "lucide-react";

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

export function KegiatanMendatang({ kegiatan, slug }: { kegiatan: KegiatanItem[], slug: string }) {
    return (
        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E4A]">Kegiatan Mendatang</h2>
                <Button variant="outline" asChild className="border-[#FF9357] text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357] shrink-0">
                    <Link href={`/${slug}/kegiatan`} className="bg-orange-50">Kegiatan Lainnya</Link>
                </Button>
            </div>

            {!kegiatan || kegiatan.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <CalendarX2 className="mx-auto w-16 h-16 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600">Tidak Ada Kegiatan</h3>
                    <p className="text-sm text-slate-400">Belum ada kegiatan yang dijadwalkan dalam waktu dekat.</p>
                </div>
            ) : (
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
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" className="text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357]">Lihat Detail</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg bg-white p-0">
                                    {item.image && (
                                        <div className="relative w-full h-56">
                                            <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" className="rounded-t-lg" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <DialogHeader className="mb-4">
                                            <DialogTitle className="text-2xl font-bold text-[#0A1E4A] leading-snug">{item.title}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <p className="text-slate-600 text-sm max-h-[120px] overflow-y-auto pr-3">
                                                {item.description || "Tidak ada deskripsi untuk kegiatan ini."}
                                            </p>
                                            <div className="border-t pt-4 space-y-3">
                                                <div className="flex items-center gap-3 text-slate-700">
                                                    <Clock className="w-5 h-5 text-[#FF9357] flex-shrink-0" />
                                                    <span>{item.full_date}, Pukul {item.time} WIB</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-700">
                                                    <MapPin className="w-5 h-5 text-[#FF9357] flex-shrink-0" />
                                                    <span>{item.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter className="p-6 bg-slate-50 rounded-b-lg">
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline" className="w-full bg-white text-slate-600 hover:bg-slate-600/10 rounded-full">
                                                Tutup
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}