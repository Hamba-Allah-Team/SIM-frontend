import { useEffect, useState } from 'react';
import api from '@/lib/api'; // Ganti fetch() dengan ini

export interface LineChartPoint {
    label: string;
    income: number;
    expense: number;
}

export const useLineStats = (mosqueId: string, range: '7d' | '1m' | '1y' = '7d') => {
    const [data, setData] = useState<LineChartPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!mosqueId) return;

        const fetchData = async () => {
            try {
                const res = await api.get(`/api/dashboard/line-stats`, {
                    params: { mosque_id: mosqueId, range }
                });
                const json = res.data;

                const mergedData = json.labels.map((label: string, idx: number) => ({
                    label,
                    income: json.datasets.income[idx] || 0,
                    expense: json.datasets.expense[idx] || 0,
                }));

                setData(mergedData);
            } catch (err) {
                console.error('Failed to fetch line stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mosqueId, range]);

    return { data, loading };
};
