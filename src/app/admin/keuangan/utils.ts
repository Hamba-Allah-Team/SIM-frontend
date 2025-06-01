import { Keuangan, Transaction, Wallet, TransactionCategory } from "./types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import api from "@/lib/api";

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

export function mapTransactionTypeToFrontend(type: "income" | "expense"): "Pemasukan" | "Pengeluaran" {
    return type === "income" ? "Pemasukan" : "Pengeluaran";
}

export async function fetchTransactionsWithWallets(
    mosqueId: number,
    includeDeleted: boolean = false
): Promise<Keuangan[]> {
    try {
        const [transactionsRes, walletsMap, categoriesRes] = await Promise.all([
            api.get("/api/finance/transactions", {
                params: { includeDeleted: includeDeleted ? "true" : "false" },
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

        console.log("CategoryMap:", categoryMap);

        return transactions
            .filter((item) => item.transaction_type === "income" || item.transaction_type === "expense")
            .map((item) => ({
                id: item.transaction_id,
                tanggal: format(new Date(item.transaction_date), "dd MMMM yyyy", { locale: id }), // ✅ UX friendly
                jenis: mapTransactionTypeToFrontend(item.transaction_type as "income" | "expense"),
                dompet: walletsMap[item.wallet_id]?.wallet_name ?? "-",
                amount: item.amount,
                source_or_usage: item.source_or_usage,
                kategori: categoryMap[item.category_id ?? -1] ?? "-", // ✅ aman
            }));
    } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
        throw new Error("Gagal mengambil data keuangan");
    }
}

export async function deleteTransaction(id: number) {
    return await api.delete(`/api/finance/transactions/${id}`);
}