// --- File: src/app/[slug]/components/LaporanKeuangan.tsx ---
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowDownCircle, ArrowUpCircle, FileX2 } from 'lucide-react';

// 👈 Perbaikan di sini: Menambahkan interface untuk tipe data prop
interface LaporanData {
    pemasukan: number;
    pengeluaran: number;
}

export function LaporanKeuangan({ laporan }: { laporan: LaporanData }) {
    const hasData = laporan && (laporan.pemasukan > 0 || laporan.pengeluaran > 0);
    
    return (
        <section className="bg-slate-100">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#0A1E4A]">Laporan Keuangan</h2>
                    <p className="text-slate-500 mt-2">Ringkasan total pemasukan dan pengeluaran.</p>
                </div>
                {hasData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="bg-white shadow-lg border-t-4 border-green-500 p-6">
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
                        <Card className="bg-white shadow-lg border-t-4 border-red-500 p-6">
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
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg max-w-4xl mx-auto">
                        <FileX2 className="mx-auto w-16 h-16 text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-600">Laporan Keuangan Belum Tersedia</h3>
                        <p className="text-sm text-slate-400">Data akan muncul di sini setelah ada transaksi yang tercatat.</p>
                    </div>
                )}
            </div>
        </section>
    );
}