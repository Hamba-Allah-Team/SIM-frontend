export type Keuangan = {
    id: number
    tanggal: string
    jenis: "Pemasukan" | "Pengeluaran"
    dompet: "cash" | "bank"
    amount: number
}

export interface Transaction {
    transaction_id: number;
    wallet_id: number;
    transaction_type: "Pemasukan" | "Pengeluaran";
    transaction_date: string;
    amount: number;
}