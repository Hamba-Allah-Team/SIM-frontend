// app/admin/dashboard/utils.ts

import { apiClient as api } from '@/lib/api-client'; // kamu pakai Axios interceptor di sini
import { SummaryData, Transaction, TopCategory } from './types';

export async function fetchSummary(mosqueId: string): Promise<SummaryData> {
    const res = await api.get(`/api/dashboard/summary/${mosqueId}`);
    return res.data;
}

export async function fetchRecentTransactions(mosqueId: string): Promise<Transaction[]> {
    const res = await api.get(`/api/dashboard/recent/${mosqueId}`);
    return res.data;
}

export async function fetchTopCategories(
    mosqueId: string,
    type: 'income' | 'expense',
    startDate: string,
    endDate: string,
): Promise<TopCategory[]> {
    const res = await api.get(`/api/dashboard/top-categories/${mosqueId}`, {
        params: { type, startDate, endDate },
    });
    return res.data;
}
