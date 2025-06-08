// --- File: src/app/[slug]/components/LaporanKeuangan.tsx ---
import {Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

// 👈 Perbaikan di sini: Menambahkan interface untuk tipe data prop
interface LaporanData {
    pemasukan: number;
    pengeluaran: number;
}

export function LaporanKeuangan({ laporan }: { laporan: LaporanData }) {
    return (
        <section className="bg-slate-100">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#0A1E4A]">Laporan Keuangan</h2>
                    <p className="text-slate-500 mt-2">Ringkasan total pemasukan dan pengeluaran.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Card Pemasukan */}
                    <Card className="bg-white shadow-lg border-t-4 border-orange-400 p-6">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase">
                                Total Pemasukan
                            </CardTitle>
                            <ArrowUpCircle className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent className="p-0 mt-2">
                            <div className="text-4xl font-bold text-slate-900">
                                {formatCurrency(laporan.pemasukan)}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Card Pengeluaran */}
                    <Card className="bg-white shadow-lg border-t-4 border-orange-400 p-6">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase">
                                Total Pengeluaran
                            </CardTitle>
                            <ArrowDownCircle className="h-5 w-5 text-red-500" />
                        </CardHeader>
                        <CardContent className="p-0 mt-2">
                            <div className="text-4xl font-bold text-slate-900">
                                {formatCurrency(laporan.pengeluaran)}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}