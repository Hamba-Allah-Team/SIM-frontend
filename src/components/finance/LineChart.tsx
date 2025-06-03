'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LineChartData } from '@/hooks/useLineStats';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface Props {
    data: LineChartData;
}

export default function LineChart({ data }: Props) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Pemasukan',
                data: data.datasets.income,
                borderColor: '#22c55e', // Tailwind green-500
                backgroundColor: '#22c55e33',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Pengeluaran',
                data: data.datasets.expense,
                borderColor: '#ef4444', // Tailwind red-500
                backgroundColor: '#ef444433',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return <Line data={chartData} options={options} />;
}
