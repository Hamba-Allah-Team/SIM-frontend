export type Keuangan = {
    id: number;
    tanggal: string;
    jenis: "Pemasukan" | "Pengeluaran";
    dompet: "cash" | "bank" | "ewallet" | "other"; // ✅ ditambah
    amount: number;
    source_or_usage: string;
    kategori: string;
};

export interface Wallet {
    wallet_id: number;
    wallet_name: string;
    wallet_type: "cash" | "bank" | "ewallet" | "other";
}

export interface Transaction {
    transaction_id: number;
    wallet_id: number;
    transaction_type: "income" | "expense" | "transfer_in" | "transfer_out" | "initial_balance";
    transaction_date: string;
    amount: number;
    source_or_usage: string;
    category?: {
        category_id: number;
        category_name: string;
    };
}
