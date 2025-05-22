export type Keuangan = {
    id: number
    tanggal: string
    jenis: "Pemasukan" | "Pengeluaran"
    dompet: "Cash" | "Bank"
    nominal: number
}
