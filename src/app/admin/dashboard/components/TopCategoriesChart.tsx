// app/admin/dashboard/components/TopCategoriesChart.tsx

'use client'

import { TopCategory } from '../types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'

interface Props {
    data: TopCategory[]
    title: string
}

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#A28EFF', '#FF6B81', '#B5E853', '#FFB6C1',
]

export default function TopCategoriesChart({ data, title }: Props) {
    const chartData = data.map((item) => ({
        name: item.category_name,
        value: item.total_amount,
    }))

    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
                {chartData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Belum ada data.</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) =>
                                    `${name} (${(percent * 100).toFixed(0)}%)`
                                }
                            >
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString('id-ID')}`} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}
