"use client";

import { useState } from "react";
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
import { CreateWalletPayload } from "@/app/admin/dompet/types";
import { AxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CreateWalletPage() {
    const [walletName, setWalletName] = useState("");
    const [walletType, setWalletType] = useState("");
    const [balance, setBalance] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { profile } = useUserProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!walletType || !walletName.trim()) {
            toast.error("Jenis dompet dan nama dompet wajib diisi.");
            setIsLoading(false);
            return;
        }

        if (!profile?.mosque_id) {
            toast.error("Gagal mendapatkan ID masjid dari profil.");
            setIsLoading(false);
            return;
        }

        const payload: CreateWalletPayload = {
            mosque_id: profile.mosque_id,
            wallet_name: walletName.trim(),
            wallet_type: walletType,
        };

        const parsedBalance = parseFloat(balance);
        if (!isNaN(parsedBalance) && parsedBalance >= 0) {
            payload.initial_balance = parsedBalance;
        }

        try {
            await api.post("/api/wallets", payload);
            toast.success("Dompet baru berhasil ditambahkan.");
            router.push("/admin/dompet");
            router.refresh();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            const message = error.response?.data?.message || "Gagal membuat dompet";
            console.error("Error creating wallet:", error.response?.data || error.message);
            toast.error("Gagal Menambah Dompet", { description: message });
        } finally {
            setIsLoading(false);
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
                    Tambah Dompet Masjid
                </h1>
                <p className="text-gray-500 mb-6">Buat dompet baru untuk pencatatan keuangan.</p>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                        <Label htmlFor="walletName" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nama Dompet <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="walletName"
                            type="text"
                            value={walletName}
                            onChange={(e) => setWalletName(e.target.value)}
                            placeholder="Contoh: Kas Operasional Masjid"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="walletType" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Jenis Dompet <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={setWalletType} value={walletType}>
                            <SelectTrigger className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]">
                                <SelectValue placeholder="Pilih jenis dompet" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="cash">Uang Tunai (Cash)</SelectItem>
                                <SelectItem value="bank">Rekening Bank</SelectItem>
                                <SelectItem value="ewallet">E-Wallet</SelectItem>
                                <SelectItem value="other">Lainnya</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="initialBalance" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Saldo Awal (Opsional)
                        </Label>
                        <Input
                            id="initialBalance"
                            type="number"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            placeholder="Masukkan nominal, cth: 500000"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            min={0}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/dompet")}
                            className="w-full bg-white h-12 rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10 transition-colors"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan Dompet"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}