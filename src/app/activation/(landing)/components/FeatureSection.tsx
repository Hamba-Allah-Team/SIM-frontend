import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, CreditCard, CalendarCheck, Dumbbell } from "lucide-react";

// 1. Array fitur diperbarui menjadi 4 item
const features = [
    { title: 'Konten', description: 'Publikasikan artikel, berita, dan galeri kegiatan.', icon: <Monitor className="w-8 h-8 text-orange-500" /> },
    { title: 'Keuangan', description: 'Catat pemasukan dan pengeluaran secara transparan.', icon: <CreditCard className="w-8 h-8 text-orange-500" /> },
    { title: 'Reservasi', description: 'Kelola peminjaman ruangan dan fasilitas masjid.', icon: <CalendarCheck className="w-8 h-8 text-orange-500" /> },
    { title: 'Kegiatan', description: 'Jadwalkan dan informasikan kegiatan rutin.', icon: <Dumbbell className="w-8 h-8 text-orange-500" /> },
];

export default function FeaturesSection() {
    return (
        <section id="fitur" className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#0A1E4A]">Fitur Unggulan</h2>
                    <p className="text-slate-500 mt-2">Semua yang Anda butuhkan untuk manajemen masjid yang lebih baik.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map(feature => (
                        <Card key={feature.title} className="p-6 text-left shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-orange-400">
                            <CardHeader className="p-0 mb-4">
                                <div className="bg-orange-100 p-4 rounded-xl w-max mb-4">
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-lg font-bold text-slate-900">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-sm text-slate-600">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
