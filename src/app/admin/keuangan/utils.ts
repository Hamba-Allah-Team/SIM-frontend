import api from "@/lib/api";

export const fetchTransactions = async (includeDeleted: boolean = false) => {
    try {
        const response = await api.get("/api/finance/transactions", {
            params: { includeDeleted: includeDeleted ? 'true' : 'false' }
        });
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
        throw new Error("Gagal mengambil transaksi");
    }
};