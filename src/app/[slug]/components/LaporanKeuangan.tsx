// --- File: src/app/[slug]/components/LaporanKeuangan.tsx ---
import { Card as CardLaporan, CardHeader as CardHeaderLaporan, CardTitle as CardTitleLaporan, CardDescription as CardDescriptionLaporan } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

// 👈 Perbaikan di sini: Menambahkan interface untuk tipe data prop
interface LaporanData {
    pemasukan: number;
    pengeluaran: number;
}

export function LaporanKeuangan({ laporan }: { laporan: LaporanData }) {
    return (
        <section className="bg-slate-100">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <h2 className="text-3xl font-bold text-[#0A1E4A] text-center mb-8">Laporan Keuangan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <CardLaporan className="p-6 text-center shadow-lg">
                        <CardHeaderLaporan className="p-0">
                            <CardDescriptionLaporan>PEMASUKAN</CardDescriptionLaporan>
                            <CardTitleLaporan className="text-4xl font-bold text-green-600">{formatCurrency(laporan.pemasukan)}</CardTitleLaporan>
                        </CardHeaderLaporan>
                    </CardLaporan>
                    <CardLaporan className="p-6 text-center shadow-lg">
                        <CardHeaderLaporan className="p-0">
                            <CardDescriptionLaporan>PENGELUARAN</CardDescriptionLaporan>
                            <CardTitleLaporan className="text-4xl font-bold text-red-600">{formatCurrency(laporan.pengeluaran)}</CardTitleLaporan>
                        </CardHeaderLaporan>
                    </CardLaporan>
                </div>
            </div>
        </section>
    );
}