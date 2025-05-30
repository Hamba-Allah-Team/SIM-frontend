import api from "@/lib/api"
import { TransactionCategory } from "./types"

export async function getTransactionCategories(mosqueId: number): Promise<TransactionCategory[]> {
    try {
        const response = await api.get(`/api/finance/categories/mosque/${mosqueId}`)
        return response.data
    } catch (error) {
        console.error("Gagal mengambil kategori transaksi:", error)
        return []
    }
}
