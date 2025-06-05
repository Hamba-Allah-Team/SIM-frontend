// app/admin/dashboard/components/SummaryCard.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SummaryData } from '../types'
import { formatCurrency } from '@/lib/utils'

interface Props {
    summary: SummaryData
}

export default function SummaryCard({ summary }: Props) {
    return (
        <div className="grid md:grid-cols-3 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Total Pemasukan</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(summary.total_income)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Total Pengeluaran</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(summary.total_expense)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Selisih</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-semibold text-blue-600">
                        {formatCurrency(summary.net_balance)}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
