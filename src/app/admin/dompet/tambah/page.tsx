"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUserProfile } from "@/hooks/useUserProfile"
import { AxiosError } from "axios"
// import clsx from "clsx"

export default function CreateWalletPage() {
    const [walletType, setWalletType] = useState("")
    const [balance, setBalance] = useState("")
    const router = useRouter()
    const { profile } = useUserProfile()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (!profile?.mosque_id) {
                alert("Gagal mendapatkan ID masjid dari profil.")
                return
            }

            const response = await api.post("/api/wallets", {
                mosque_id: profile.mosque_id,
                wallet_type: walletType,
            })

            console.log("Wallet created:", response.data)
            router.push("/admin/dompet")
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            console.error("Error creating wallet:", error.response?.data || error.message)
            alert(error.response?.data?.message || "Gagal membuat dompet")
        }
    }

    return (
        <div className="min-h-screen bg-[#F7F8FA] px-4 py-6">

            <div className="max-w-md w-full mx-auto">
                <h1 className="text-2xl font-bold text-[#1C143D] mb-6">Tambah Dompet Masjid</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">Jenis Dompet</label>
                        <Select onValueChange={setWalletType}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm">
                                <SelectValue placeholder="Pilih jenis dompet" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank">Bank</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">Masukkan Saldo Awal</label>
                        <Input
                            type="number"
                            value={balance}
                            disabled
                            onChange={(e) => setBalance(e.target.value)}
                            placeholder="Masukkan nominal saldo awal (jika ada saldo)"
                            className="bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/admin/dompet")}
                            className="w-1/2 h-12 rounded-full border-[#FF8A4C] text-[#FF8A4C] font-semibold hover:bg-[#FF8A4C]/10"
                        >
                            Batal
                        </Button>
                        {/* <button
                        type="button"
                        onClick={() => router.push("/admin/dompet")}
                        className="w-1/2 h-12 rounded-full border border-[#FF8A4C] text-[#FF8A4C] font-semibold"
                    >
                        Batal
                    </button> */}
                        <Button
                            type="submit"
                            className="w-1/2 h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold"
                        >
                            Simpan
                        </Button>
                        {/* <button
                        type="submit"
                        className="w-1/2 h-12 rounded-full bg-[#FF8A4C] text-white font-semibold"
                    >
                        Simpan
                    </button> */}
                    </div>
                </form>
            </div>
        </div>
    )
}
