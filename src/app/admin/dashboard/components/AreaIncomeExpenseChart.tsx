'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface Props {
    data: {
        label: string;
        income: number;
        expense: number;
    }[];
}

export default function AreaIncomeExpenseChart({ data }: Props) {
    return (
        <div className="rounded-md border bg-background p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Pemasukan vs Pengeluaran</h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="income" stroke="#22c55e" fillOpacity={1} fill="url(#incomeColor)" name="Pemasukan" />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#expenseColor)" name="Pengeluaran" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
