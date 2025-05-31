"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUserProfile } from "@/hooks/useUserProfile";
import { WalletApiResponse } from "../types";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function TransferWalletPage() {
    const [wallets, setWallets] = useState<WalletApiResponse[]>([]);
    const [fromWalletId, setFromWalletId] = useState<string>("");
    const [toWalletId, setToWalletId] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [transactionDate, setTransactionDate] = useState("");
    const [sourceOrUsage, setSourceOrUsage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { profile } = useUserProfile();

    useEffect(() => {
        const fetchWallets = async () => {
            if (!profile?.mosque_id) return;
            try {
                const response = await api.get(`/api/wallets/mosque/${profile.mosque_id}`);
                setWallets(response.data || []);
            } catch (error) {
                console.error("Gagal mengambil data dompet:", error);
            }
        };
        fetchWallets();
    }, [profile?.mosque_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi input dasar
        if (!fromWalletId || !toWalletId || !amount || !transactionDate) {
            toast.error("Semua field wajib diisi.");
            return;
        }

        // Validasi dompet
        if (fromWalletId === toWalletId) {
            toast.error("Dompet sumber dan tujuan tidak boleh sama.");
            return;
        }

        // Validasi nominal
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error("Nominal transfer harus berupa angka positif.");
            return;
        }

        // Validasi tanggal
        const today = new Date();
        const inputDate = new Date(transactionDate);
        if (isNaN(inputDate.getTime())) {
            toast.error("Tanggal transaksi tidak valid.");
            return;
        }

        if (inputDate > today) {
            toast.error("Tanggal transaksi tidak boleh di masa depan.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/api/wallets/transfer", {
                from_wallet_id: Number(fromWalletId),
                to_wallet_id: Number(toWalletId),
                amount: parsedAmount,
                transaction_date: transactionDate,
                source_or_usage: sourceOrUsage,
            });
            toast.success("Transfer berhasil.");
            router.push("/admin/dompet");
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            const message = error?.response?.data?.message || "Gagal melakukan transfer";
            toast.error(message);
            console.error("Transfer error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full px-4 py-6">
            <div className="w-full mx-auto">
                <h1 className="text-2xl font-bold text-[#1C143D] mb-6">
                    Transfer Antar Dompet
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Dompet Sumber
                        </label>
                        <Select onValueChange={setFromWalletId}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm">
                                <SelectValue placeholder="Pilih dompet sumber" />
                            </SelectTrigger>
                            <SelectContent>
                                {wallets.map((wallet) => (
                                    <SelectItem key={wallet.wallet_id} value={wallet.wallet_id.toString()}>
                                        {wallet.wallet_name} ({wallet.wallet_type}) - Rp{wallet.balance.toLocaleString()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Dompet Tujuan
                        </label>
                        <Select onValueChange={setToWalletId}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm">
                                <SelectValue placeholder="Pilih dompet tujuan" />
                            </SelectTrigger>
                            <SelectContent>
                                {wallets
                                    .filter((wallet) => wallet.wallet_id.toString() !== fromWalletId)
                                    .map((wallet) => (
                                        <SelectItem key={wallet.wallet_id} value={wallet.wallet_id.toString()}>
                                            {wallet.wallet_name} ({wallet.wallet_type}) - Rp{wallet.balance.toLocaleString()}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nominal Transfer
                        </label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Masukkan jumlah transfer"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                            min={1}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Tanggal Transaksi
                        </label>
                        <Input
                            type="date"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Tujuan / Penggunaan
                        </label>
                        <Input
                            type="text"
                            value={sourceOrUsage}
                            onChange={(e) => setSourceOrUsage(e.target.value)}
                            placeholder="Contoh: Pemindahan dana operasional"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/dompet")}
                            className="w-full h-12 rounded-full border-[#FF8A4C] text-[#FF8A4C] font-semibold hover:bg-[#FF8A4C]/10"
                        >
                            Batal
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold"
                        >
                            {loading ? "Memproses..." : "Transfer"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
