"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserProfile } from "@/hooks/useUserProfile"
import { AxiosError } from "axios"


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
                // balance tidak dikirim karena belum dibutuhkan backend
            })

            console.log("Wallet created:", response.data)
            router.push("/admin/dompet")
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error("Error creating wallet:", error.response?.data || error.message)
            alert(error.response?.data?.message || "Gagal membuat dompet")
        }

    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Tambah Dompet</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">Jenis Dompet</label>
                    <Select onValueChange={(value) => setWalletType(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis dompet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bank">Bank</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-400">Saldo Awal (disabled)</label>
                    <Input
                        type="number"
                        value={balance}
                        disabled
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="Input ini dinonaktifkan"
                        className="bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.push("/admin/dompet")}>
                        Batal
                    </Button>
                    <Button type="submit">Simpan</Button>
                </div>
            </form>
        </div>
    )
}
