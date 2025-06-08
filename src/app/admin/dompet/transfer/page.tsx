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
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";
import { WalletApiResponse } from "../types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function TransferWalletPage() {
    const [wallets, setWallets] = useState<WalletApiResponse[]>([]);
    const [fromWalletId, setFromWalletId] = useState<string>("");
    const [toWalletId, setToWalletId] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [transactionDate, setTransactionDate] = useState<string>(new Date().toISOString().split("T")[0]);
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
                toast.error("Gagal mengambil daftar dompet.");
            }
        };
        fetchWallets();
    }, [profile?.mosque_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!fromWalletId || !toWalletId || !amount || !transactionDate) {
            toast.error("Semua field wajib diisi.");
            setLoading(false);
            return;
        }

        if (fromWalletId === toWalletId) {
            toast.error("Dompet sumber dan tujuan tidak boleh sama.");
            setLoading(false);
            return;
        }

        try {
            await api.post("/api/wallets/transfer", {
                from_wallet_id: Number(fromWalletId),
                to_wallet_id: Number(toWalletId),
                amount: parseFloat(amount),
                transaction_date: transactionDate,
                source_or_usage: sourceOrUsage.trim(),
            });
            toast.success("Transfer antar dompet berhasil.");
            router.push("/admin/dompet");
            router.refresh();
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            const message = error?.response?.data?.message || "Gagal melakukan transfer";
            toast.error("Gagal Transfer", { description: message });
            console.error("Transfer error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 group text-slate-600 hover:text-slate-900 px-0"
            >
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Kembali
            </Button>
            <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200/80">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D] mb-2">
                    Transfer Antar Dompet
                </h1>
                <p className="text-gray-500 mb-6">Pindahkan saldo dari satu dompet ke dompet lainnya.</p>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="fromWallet" className="block text-sm font-semibold text-[#1C143D] mb-1">
                                Dompet Sumber <span className="text-red-500">*</span>
                            </Label>
                            <Select onValueChange={setFromWalletId} value={fromWalletId}>
                                <SelectTrigger className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]">
                                    <SelectValue placeholder="Pilih dompet sumber" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {wallets.map((wallet) => (
                                        <SelectItem key={wallet.wallet_id} value={wallet.wallet_id.toString()}>
                                            {wallet.wallet_name} (Rp{wallet.balance.toLocaleString('id-ID')})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="toWallet" className="block text-sm font-semibold text-[#1C143D] mb-1">
                                Dompet Tujuan <span className="text-red-500">*</span>
                            </Label>
                            <Select onValueChange={setToWalletId} value={toWalletId}>
                                <SelectTrigger className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]">
                                    <SelectValue placeholder="Pilih dompet tujuan" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {wallets
                                        .filter((wallet) => wallet.wallet_id.toString() !== fromWalletId)
                                        .map((wallet) => (
                                            <SelectItem key={wallet.wallet_id} value={wallet.wallet_id.toString()}>
                                                {wallet.wallet_name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="amount" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nominal Transfer <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Masukkan jumlah transfer"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            min={1}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="transactionDate" className="block text-sm font-semibold text-[#1C143D] mb-1">
                                Tanggal Transaksi <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="transactionDate"
                                type="date"
                                value={transactionDate}
                                onChange={(e) => setTransactionDate(e.target.value)}
                                className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                                required
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="sourceOrUsage" className="block text-sm font-semibold text-[#1C143D] mb-1">
                                Keterangan (Opsional)
                            </Label>
                            <Input
                                id="sourceOrUsage"
                                type="text"
                                value={sourceOrUsage}
                                onChange={(e) => setSourceOrUsage(e.target.value)}
                                placeholder="Contoh: Pemindahan dana operasional"
                                className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/dompet")}
                            className="w-full bg-white h-12 rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10 transition-colors"
                            disabled={loading}
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