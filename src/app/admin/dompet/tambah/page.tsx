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
import { useUserProfile } from "@/hooks/useUserProfile";
import { CreateWalletPayload } from "@/app/admin/dompet/types";
import { AxiosError } from "axios";

export default function CreateWalletPage() {
    const [walletName, setWalletName] = useState("");
    const [walletType, setWalletType] = useState("");
    const [balance, setBalance] = useState("");
    const router = useRouter();
    const { profile } = useUserProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!walletType || !walletName.trim()) {
            alert("Jenis dompet dan nama dompet wajib diisi.");
            return;
        }

        if (!profile?.mosque_id) {
            alert("Gagal mendapatkan ID masjid dari profil.");
            return;
        }

        const payload: CreateWalletPayload = {
            mosque_id: profile.mosque_id,
            wallet_name: walletName.trim(),
            wallet_type: walletType,
        };

        const parsedBalance = parseFloat(balance);
        if (!isNaN(parsedBalance) && parsedBalance > 0) {
            payload.initial_balance = parsedBalance;
        }

        try {
            const response = await api.post("/api/wallets", payload);
            console.log("Wallet created:", response.data);
            router.push("/admin/dompet");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error("Error creating wallet:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Gagal membuat dompet");
        }
    };


    return (
        <div className="w-full px-4 py-6">
            <div className="w-full mx-auto">
                <h1 className="text-2xl font-bold text-[#1C143D] mb-6">
                    Tambah Dompet Masjid
                </h1>
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nama Dompet
                        </label>
                        <Input
                            type="text"
                            value={walletName}
                            onChange={(e) => setWalletName(e.target.value)}
                            placeholder="Contoh: Dompet Operasional"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Jenis Dompet
                        </label>
                        <Select onValueChange={setWalletType}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm">
                                <SelectValue placeholder="Pilih jenis dompet" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank">Bank</SelectItem>
                                <SelectItem value="ewallet">E-wallet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Masukkan Saldo Awal
                        </label>
                        <Input
                            type="number"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            placeholder="Masukkan nominal saldo awal (boleh kosong)"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                            min={0}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/dompet")}
                            className="w-full h-12 rounded-full border-[#FF8A4C] text-[#FF8A4C] font-semibold hover:bg-[#FF8A4C]/10"
                        >
                            Batal
                        </Button>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold"
                        >
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
