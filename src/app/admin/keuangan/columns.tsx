import { ColumnDef } from "@tanstack/react-table";
import { Transaksi } from "./your-types"; // kalau terpisah

export const columns: ColumnDef<Transaksi>[] = [
    {
        accessorKey: "tanggal",
        header: "Tanggal",
        cell: ({ row }) => {
            const date = new Date(row.getValue("tanggal"));
            return date.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        },
    },
    {
        accessorKey: "jenis",
        header: "Jenis Transaksi",
        cell: ({ row }) => {
            const jenis = row.getValue("jenis") as string;
            return (
                <span className={jenis === "Pemasukan" ? "text-green-600" : "text-red-600"}>
                    {jenis}
                </span>
            );
        },
    },
    {
        accessorKey: "dompet",
        header: "Dompet",
    },
    {
        accessorKey: "nominal",
        header: "Nominal",
        cell: ({ row }) => {
            const nominal = row.getValue("nominal") as number;
            return `Rp ${nominal.toLocaleString("id-ID")}`;
        },
    },
    {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => {
            const transaksi = row.original;
            return (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleLihatDetail(transaksi)}
                        className="text-blue-500 hover:underline"
                    >
                        Lihat
                    </button>
                    <button
                        onClick={() => handleEdit(transaksi)}
                        className="text-yellow-500 hover:underline"
                    >
                        Ubah
                    </button>
                    <button
                        onClick={() => handleHapus(transaksi.id)}
                        className="text-red-500 hover:underline"
                    >
                        Hapus
                    </button>
                </div>
            );
        },
    },
];
