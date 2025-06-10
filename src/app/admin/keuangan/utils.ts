import { Keuangan, Transaction, Wallet, TransactionCategory } from "./types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { apiClient as api } from '@/lib/api-client';

export async function fetchWalletsByMosque(mosqueId: number): Promise<Record<number, Wallet>> {
    try {
        const response = await api.get(`/api/wallets/mosque/${mosqueId}`);
        const wallets: Wallet[] = response.data;
        const walletMap: Record<number, Wallet> = {};
        wallets.forEach((wallet) => {
            walletMap[wallet.wallet_id] = wallet;
        });
        return walletMap;
    } catch (error) {
        console.error("Gagal mengambil dompet:", error);
        throw new Error("Gagal mengambil dompet");
    }
}

export function mapTransactionTypeToBackend(type: "Pemasukan" | "Pengeluaran"): "income" | "expense" {
    return type === "Pemasukan" ? "income" : "expense"
}

// Fungsi ini sekarang menangani semua tipe transaksi
export function mapFullTransactionTypeToFrontend(type: Transaction['transaction_type']): Keuangan['jenis'] {
    switch (type) {
        case 'income': return 'Pemasukan';
        case 'expense': return 'Pengeluaran';
        case 'transfer_in': return 'Transfer Masuk';
        case 'transfer_out': return 'Transfer Keluar';
        case 'initial_balance': return 'Saldo Awal';
        default: return 'Lainnya';
    }
}

export async function fetchTransactionsWithWallets(
    mosqueId: number,
    filterType: string // 'cashflow', 'transfer', atau 'all'
): Promise<Keuangan[]> {
    try {
        const [transactionsRes, walletsMap, categoriesRes] = await Promise.all([
            api.get("/api/finance/transactions", {
                params: { type: filterType }, // Mengirimkan parameter filter ke backend
            }),
            fetchWalletsByMosque(mosqueId),
            api.get(`/api/finance/categories/mosque/${mosqueId}`),
        ]);

        const transactions: Transaction[] = transactionsRes.data;
        const categories: TransactionCategory[] = categoriesRes.data;

        const categoryMap: Record<number, string> = {};
        categories.forEach((category) => {
            categoryMap[category.category_id] = category.category_name;
        });

        return transactions.map((item) => ({
            id: item.transaction_id,
            tanggal: format(new Date(item.transaction_date), "dd MMMM yyyy", { locale: id }),
            jenis: mapFullTransactionTypeToFrontend(item.transaction_type),
            dompet: walletsMap[item.wallet_id]?.wallet_name ?? "-",
            amount: item.amount,
            source_or_usage: item.source_or_usage,
            kategori: categoryMap[item.category_id ?? -1] ?? (item.transaction_type.includes('transfer') ? 'Transfer Dana' : '-'),
        }));
    } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
        throw new Error("Gagal mengambil data keuangan");
    }
}

export async function deleteTransaction(id: number) {
    return await api.delete(`/api/finance/transactions/${id}`);
}