import api from "@/lib/api";
import { Keuangan, Transaction } from "./types";

// Fungsi ambil data transaksi dari API
export const fetchTransactions = async (includeDeleted: boolean = false) => {
    try {
        const response = await api.get("/api/finance/transactions", {
            params: { includeDeleted: includeDeleted ? "true" : "false" },
        });
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
        throw new Error("Gagal mengambil transaksi");
    }
};

// Mapping dari struktur data backend ke tipe frontend (Keuangan)
const walletMap: Record<number, "cash" | "bank"> = {
    1: "cash",
    2: "bank",
};

export function mapApiToKeuangan(data: Transaction[]): Keuangan[] {
    return data.map((item) => ({
        id: item.transaction_id,
        tanggal: item.transaction_date,
        jenis: item.transaction_type,
        dompet: walletMap[item.wallet_id] ?? "cash", // fallback default
        amount: item.amount,
    }));
}
