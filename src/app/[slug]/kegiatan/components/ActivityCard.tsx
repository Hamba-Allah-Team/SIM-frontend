'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KegiatanItem {
    id: number; day: string; month: string; title: string; location: string;
    image: string | null; description: string | null; full_date: string; time: string;
}

interface ActivityCardProps {
    item: KegiatanItem;
    type: 'upcoming' | 'past';
}

export default function ActivityCard({ item, type }: ActivityCardProps) {
    return (
        <div className={`bg-white p-6 rounded-xl shadow-lg flex items-center gap-6 hover:shadow-xl transition-all duration-300 ${type === 'past' ? 'opacity-70 hover:opacity-100' : ''}`}>
            <div className="text-center border-r pr-6">
                <p className="text-3xl font-bold text-[#FF9357]">{item.day}</p>
                <p className="text-slate-500">{item.month}</p>
            </div>
            <div className="flex-grow min-w-0">
                <h3 className="text-lg font-semibold text-slate-800 truncate">{item.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.time} WIB</span>
                </div>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white border-[#FF9357] text-[#FF9357] hover:bg-[#FF9357]/10 hover:text-[#FF9357] rounded-full px-6 whitespace-nowrap">
                        Lihat Detail
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg bg-white p-0">
                    {item.image && (
                        <div className="relative w-full h-56">
                            <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" className="rounded-t-lg" />
                        </div>
                    )}
                    <div className="p-6">
                        <DialogHeader className="mb-4">
                            <Badge className={cn(
                                "w-fit mb-2 font-semibold",
                                type === 'past' ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-green-100 text-green-700 border-green-200"
                            )}>
                                {type === 'past' ? 'Telah Berlangsung' : 'Akan Datang'}
                            </Badge>
                            <DialogTitle className="text-2xl font-bold text-[#0A1E4A] leading-snug">{item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {/* 👈 Perbaikan Styling Teks Modal */}
                            <p className="text-slate-600 text-sm max-h-[120px] overflow-y-auto pr-3 leading-relaxed">
                                {item.description || "Tidak ada deskripsi untuk kegiatan ini."}
                            </p>
                            <div className="border-t pt-4 space-y-3">
                                <div className="flex items-start gap-3 text-slate-700">
                                    <Clock className="w-5 h-5 text-[#FF9357] flex-shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium leading-relaxed">{item.full_date}, Pukul {item.time} WIB</span>
                                </div>
                                <div className="flex items-start gap-3 text-slate-700">
                                    <MapPin className="w-5 h-5 text-[#FF9357] flex-shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium leading-relaxed">{item.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-6 pt-0">
                        <DialogClose asChild>
                            {/* 👈 Perbaikan Styling Tombol Tutup */}
                            <Button type="button" variant="outline" className="w-full bg-white hover:bg-slate-100 text-slate-700 border-slate-300 rounded-full">
                                Tutup
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}