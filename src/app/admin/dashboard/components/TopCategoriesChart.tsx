// app/admin/dashboard/components/TopCategoriesChart.tsx

'use client'

import { Pie, PieChart, Cell } from 'recharts' // 👈 1. Impor kembali 'Cell'
import * as React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart'
import { TopCategory } from '../types'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface Props {
    data: TopCategory[]
    title: string
}

export default function TopCategoriesChart({ data, title }: Props) {
    // Palet warna yang akan digunakan, diambil dari variabel CSS tema shadcn/ui
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const colorPalette = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
    ];

    // Data sekarang tidak lagi memerlukan properti 'fill'
    const chartData = React.useMemo(() => {
        return data?.map((item) => ({
            name: item.category_name,
            value: item.total_amount,
        })) || []; // Pastikan selalu array
    }, [data]);

    // Konfigurasi chart untuk legenda dan tooltip
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {};
        if (chartData.length > 0) {
            chartData.forEach((item, index) => {
                config[item.name] = {
                    label: item.name,
                    color: `hsl(${colorPalette[index % colorPalette.length]})`,
                };
            });
        }
        return config;
    }, [chartData, colorPalette]);


    return (
        <Card className="bg-white shadow-lg border border-slate-200/80 flex flex-col h-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-[#1C143D]">{title}</CardTitle>
                <CardDescription className='text-slate-400'>Berdasarkan total nominal 30 hari terakhir</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                        <TrendingUp className="w-16 h-16 text-slate-300 mb-2" />
                        <p className="font-medium">Belum ada data yang cukup.</p>
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[280px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    formatter={(value) => formatCurrency(value as number)}
                                    hideLabel
                                />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                strokeWidth={5}
                                labelLine={false}
                            >
                                {/* 👈 2. Render <Cell> secara manual untuk setiap data */}
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={`hsl(${colorPalette[index % colorPalette.length]})`} />
                                ))}
                            </Pie>
                            <ChartLegend
                                content={<ChartLegendContent nameKey="name" />}
                                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center text-xs text-slate-600 font-medium"
                            />
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
