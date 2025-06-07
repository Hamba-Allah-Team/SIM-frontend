// app/admin/dashboard/components/SummaryCard.tsx (Diperbarui)

'use client'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    // CardFooter
} from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
import { SummaryData } from '../types' // Pastikan path ini benar
import { formatCurrency } from '@/lib/utils' // Pastikan path ini benar
import { TrendingUp, TrendingDown, Scale } from 'lucide-react'

interface Props {
    summary: SummaryData
}

export default function SummaryCard({ summary }: Props) {
    return (
        // Menggunakan <section> untuk semantik yang lebih baik
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card Pemasukan */}
            <Card className="bg-white shadow-lg border-l-4 border-green-500">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardDescription className="text-md text-slate-600">Total Pemasukan</CardDescription>
                            <CardTitle className="text-3xl font-bold text-green-600">
                                {formatCurrency(summary.total_income)}
                            </CardTitle>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-slate-500">Total pemasukan yang tercatat.</p>
                </CardContent>
            </Card>

            {/* Card Pengeluaran */}
            <Card className="bg-white shadow-lg border-l-4 border-red-500">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardDescription className="text-md text-slate-600">Total Pengeluaran</CardDescription>
                            <CardTitle className="text-3xl font-bold text-red-600">
                                {formatCurrency(summary.total_expense)}
                            </CardTitle>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <TrendingDown className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-slate-500">Total pengeluaran yang tercatat.</p>
                </CardContent>
            </Card>

            {/* Card Saldo Bersih */}
            <Card className="bg-white shadow-lg border-l-4 border-blue-500">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardDescription className="text-md text-slate-600">Saldo Bersih</CardDescription>
                            <CardTitle className="text-3xl font-bold text-blue-600">
                                {formatCurrency(summary.net_balance)}
                            </CardTitle>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Scale className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-slate-500">Total saldo akhir semua dompet.</p>
                </CardContent>
            </Card>
        </section>
    )
}
