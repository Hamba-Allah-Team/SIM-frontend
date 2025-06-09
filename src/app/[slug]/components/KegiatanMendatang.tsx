import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";

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
    if (!kegiatan || kegiatan.length === 0) return null;
    
    return (
        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1E4A]">Kegiatan Mendatang</h2>
                <Button variant="outline" asChild className="border-[#FF9357] text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357] shrink-0">
                    <Link href={`/${slug}/kegiatan`} className="bg-orange-50">Kegiatan Lainnya</Link>
                </Button>
            </div>
            
            <div className="space-y-4">
                {kegiatan.map(item => (
                    <div key={item.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            {/* Date Section dengan width yang konsisten */}
                            <div className="flex-shrink-0 text-center border-b sm:border-b-0 sm:border-r pb-4 sm:pb-0 sm:pr-6 w-full sm:w-auto">
                                <p className="text-2xl sm:text-3xl font-bold text-[#FF9357] leading-tight">{item.day}</p>
                                <p className="text-sm text-slate-500 mt-1">{item.month}</p>
                            </div>
                            
                            {/* Content Section */}
                            <div className="flex-grow min-w-0 w-full sm:w-auto">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2 leading-tight break-words">
                                    {item.title}
                                </h3>
                                <div className="flex items-start gap-2 text-sm text-slate-500 mb-1">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span className="break-words">{item.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                    <span>{item.time} WIB</span>
                                </div>
                            </div>
                            
                            {/* Button Section */}
                            <div className="flex-shrink-0 w-full sm:w-auto">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            className="text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357] w-full sm:w-auto whitespace-nowrap"
                                        >
                                            Lihat Detail
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-lg bg-white p-0 mx-4">
                                        {item.image && (
                                            <div className="relative w-full h-48 sm:h-56">
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.title} 
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, 640px"
                                                    style={{ objectFit: 'cover' }}
                                                    className="rounded-t-lg" 
                                                />
                                            </div>
                                        )}
                                        <div className="p-4 sm:p-6">
                                            <DialogHeader className="mb-4">
                                                <DialogTitle className="text-xl sm:text-2xl font-bold text-[#0A1E4A] leading-snug break-words">
                                                    {item.title}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <p className="text-slate-600 text-sm max-h-[120px] overflow-y-auto pr-2 leading-relaxed">
                                                    {item.description || "Tidak ada deskripsi untuk kegiatan ini."}
                                                </p>
                                                <div className="border-t pt-4 space-y-3">
                                                    <div className="flex items-start gap-3 text-slate-700">
                                                        <Clock className="w-5 h-5 text-[#FF9357] flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm leading-relaxed break-words">
                                                            {item.full_date}, Pukul {item.time} WIB
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-slate-700">
                                                        <MapPin className="w-5 h-5 text-[#FF9357] flex-shrink-0 mt-0.5" />
                                                        <span className="text-sm leading-relaxed break-words">{item.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter className="p-4 sm:p-6 bg-slate-50 rounded-b-lg">
                                            <DialogClose asChild>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    className="w-full bg-white hover:bg-[#FF9357]/10 border-[#FF9357] hover:text-[#FF9357] text-[#FF9357]"
                                                >
                                                    Tutup
                                                </Button>
                                            </DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}