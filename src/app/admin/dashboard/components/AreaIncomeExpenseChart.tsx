// app/admin/dashboard/components/AreaIncomeExpenseChart.tsx

'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';


interface ChartData {
    label: string; // Misal: "2024-06-07" atau "Juni"
    income: number;
    expense: number;
}

interface Props {
    data: ChartData[];
    range: '7d' | '1m' | '1y'; // 👈 1. Menerima prop 'range'
}

const chartConfig = {
    income: {
        label: 'Pemasukan',
        color: 'hsl(var(--chart-green))',
    },
    expense: {
        label: 'Pengeluaran',
        color: 'hsl(var(--chart-red))',
    },
} satisfies ChartConfig;

export default function AreaIncomeExpenseChart({ data, range }: Props) {

    // 2. Fungsi tickFormatter yang dinamis berdasarkan range
    const tickFormatter = (tick: string) => {
        try {
            if (range === '1y') {
                // Jika range 1 tahun, tampilkan 3 huruf pertama bulan
                return tick.slice(0, 3);
            }
            if (range === '7d') {
                // Jika range 7 hari, tampilkan nama hari
                return format(parseISO(tick), "EEE", { locale: localeID });
            }
            // Jika range 1 bulan (default), tampilkan tanggal dan bulan
            return format(parseISO(tick), "d MMM", { locale: localeID });
        } catch {
            // Fallback jika format tanggal tidak sesuai
            return tick;
        }
    };

    // Fungsi untuk tooltip yang lebih informatif
    const tooltipLabelFormatter = (label: string) => {
        try {
            if (range === '1y') {
                return format(parseISO(label), "MMMM yyyy", { locale: localeID });
            }
            return format(parseISO(label), "eeee, d MMMM yyyy", { locale: localeID });
        } catch {
            return label;
        }
    }


    return (
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                    top: 10,
                }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={tickFormatter} // 👈 Menggunakan formatter dinamis
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                        if (typeof value === 'number') {
                            if (value >= 1000000) return `${(value / 1000000).toFixed(1)} Jt`;
                            if (value >= 1000) return `${Math.round(value / 1000)} Rb`;
                        }
                        return String(value);
                    }}
                />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            labelFormatter={tooltipLabelFormatter} // 👈 Menggunakan formatter label yang informatif
                            indicator="dot"
                            formatter={(value) => formatCurrency(value as number)}
                        />
                    }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <defs>
                    <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area
                    dataKey="income"
                    type="monotone"
                    fill="url(#fillIncome)"
                    fillOpacity={0.4}
                    stroke="var(--color-income)"
                    stackId="a"
                    name="Pemasukan"
                />
                <Area
                    dataKey="expense"
                    type="monotone"
                    fill="url(#fillExpense)"
                    fillOpacity={0.4}
                    stroke="var(--color-expense)"
                    stackId="a"
                    name="Pengeluaran"
                />
            </AreaChart>
        </ChartContainer>
    );
}
