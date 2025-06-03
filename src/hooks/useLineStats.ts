// src/hooks/useLineStats.ts
import { useEffect, useState } from 'react';

export interface LineChartData {
    labels: string[];
    datasets: {
        income: number[];
        expense: number[];
    };
}

export const useLineStats = (mosqueId: string, range: '7d' | '1m' | '1y' = '7d') => {
    const [data, setData] = useState<LineChartData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!mosqueId) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/dashboard/transactions/line-stats?mosque_id=${mosqueId}&range=${range}`);
                const json = await res.json();
                setData(json);
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
