export type Keuangan = {
    id: number
    tanggal: string
    jenis: "Pemasukan" | "Pengeluaran"
    dompet: "Cash" | "Bank"
    amount: number
}

export interface Transaction {
    transaction_id: number;
    wallet_id: number;
    // wallet_type?: string; // opsional, jika tidak langsung tersedia dari API
    transaction_type: "Pemasukan" | "Pengeluaran";
    transaction_date: string;
    amount: number;
}