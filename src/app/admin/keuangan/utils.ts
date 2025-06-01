import { Keuangan, Transaction, Wallet } from "./types";
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

// Mapping dari backend ke frontend untuk tipe transaksi
export function mapTransactionTypeToFrontend(type: "income" | "expense"): "Pemasukan" | "Pengeluaran" {
    return type === "income" ? "Pemasukan" : "Pengeluaran";
}

// Ambil dan map data transaksi
export async function fetchTransactionsWithWallets(
    mosqueId: number,
    includeDeleted: boolean = false
): Promise<Keuangan[]> {
    try {
        const [transactionsRes, walletsMap] = await Promise.all([
            api.get("/api/finance/transactions", {
                params: { includeDeleted: includeDeleted ? "true" : "false" },
            }),
            fetchWalletsByMosque(mosqueId),
        ]);

        const transactions: Transaction[] = transactionsRes.data;

        return transactions
            .filter((item) => item.transaction_type === "income" || item.transaction_type === "expense")
            .map((item) => ({
                id: item.transaction_id,
                tanggal: item.transaction_date,
                jenis: mapTransactionTypeToFrontend(item.transaction_type as "income" | "expense"),
                dompet: walletsMap[item.wallet_id]?.wallet_type ?? "cash", // fallback aman
                amount: item.amount,
                source_or_usage: item.source_or_usage,
                kategori: item.category?.category_name ?? "-",
            }));
    } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
        throw new Error("Gagal mengambil data keuangan");
    }
}
