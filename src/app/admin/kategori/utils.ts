import { apiClient as api } from '@/lib/api-client';
import { TransactionCategory, TransactionCategoryResponse } from "./types"

export async function getTransactionCategories(mosqueId: number): Promise<TransactionCategory[]> {
    try {
        const response = await api.get(`/api/finance/categories/mosque/${mosqueId}`)
        const rawData: TransactionCategoryResponse[] = response.data

        return rawData.map(item => ({
            id: item.category_id,
            name: item.category_name,
            type: item.category_type,
            description: item.description || null,
            mosque_id: item.mosque_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            deleted_at: item.deleted_at,
        }))
    } catch (error) {
        console.error("Gagal mengambil kategori transaksi:", error)
        return []
    }
}

