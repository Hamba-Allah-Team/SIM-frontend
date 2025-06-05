"use client"

import { useState, useEffect } from "react"
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
import { mapTransactionTypeToBackend } from "../utils"
import { AxiosError } from "axios"

interface WalletOption {
    wallet_id: number
    wallet_name: string
    wallet_type: "cash" | "bank" | "ewallet" | "other"
}

interface CategoryOption {
    category_id: number
    category_name: string
    category_type: "income" | "expense"
}

export default function CreateTransactionPage() {
    const [wallets, setWallets] = useState<WalletOption[]>([])
    const [categories, setCategories] = useState<CategoryOption[]>([])

    const [walletId, setWalletId] = useState("")
    const [amount, setAmount] = useState("")
    const [transactionType, setTransactionType] = useState<"Pemasukan" | "Pengeluaran" | "">("")
    const [selectedCategoryId, setSelectedCategoryId] = useState("")
    const [description, setDescription] = useState("")
    const [transactionDate, setTransactionDate] = useState("")

    const router = useRouter()
    const { profile } = useUserProfile()

    useEffect(() => {
        if (!profile?.mosque_id) return

        const fetchWalletsAndCategories = async () => {
            try {
                const [walletRes, categoryRes] = await Promise.all([
                    api.get(`/api/wallets/mosque/${profile.mosque_id}`),
                    api.get(`/api/finance/categories/mosque/${profile.mosque_id}`),
                ])
                setWallets(walletRes.data)
                setCategories(categoryRes.data)
            } catch (error) {
                console.error("Gagal mengambil data dompet/kategori:", error)
            }
        }

        fetchWalletsAndCategories()
    }, [profile?.mosque_id])

    const filteredCategories = transactionType
        ? categories.filter(
            (cat) => cat.category_type === mapTransactionTypeToBackend(transactionType)
        )
        : []


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!transactionType || !selectedCategoryId) {
            alert("Jenis transaksi dan kategori harus dipilih")
            return
        }

        try {
            const response = await api.post("/api/finance/transactions", {
                wallet_id: Number(walletId),
                amount,
                transaction_type: mapTransactionTypeToBackend(transactionType),
                category_id: Number(selectedCategoryId),
                source_or_usage: description,
                transaction_date: transactionDate,
            })

            console.log("Transaksi berhasil ditambahkan:", response.data)
            router.push("/admin/keuangan")
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            alert(error.response?.data?.message || "Gagal menambahkan transaksi")
        }
    }

    return (
        <div className="w-full px-4 py-6">
            <div className="w-full mx-auto">
                <h1 className="text-2xl font-bold text-[#1C143D] mb-6">Tambah Transaksi Keuangan</h1>
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    {/* Dompet */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">Pilih Dompet</label>
                        <Select onValueChange={setWalletId}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm">
                                <SelectValue placeholder="Pilih dompet" />
                            </SelectTrigger>
                            <SelectContent>
                                {wallets.map((wallet) => (
                                    <SelectItem key={wallet.wallet_id} value={wallet.wallet_id.toString()}>
                                        {wallet.wallet_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Jenis Transaksi */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">Jenis Keuangan</label>
                        <Select onValueChange={(val) => {
                            setTransactionType(val as "Pemasukan" | "Pengeluaran")
                            setSelectedCategoryId("") // reset kategori saat ganti jenis transaksi
                        }}>
                            <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm">
                                <SelectValue placeholder="Pilih jenis transaksi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                                <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Kategori Transaksi */}
                    {transactionType && (
                        <div>
                            <label className="block text-sm font-semibold text-[#1C143D] mb-1">Kategori Transaksi</label>
                            <Select onValueChange={setSelectedCategoryId}>
                                <SelectTrigger className="w-full rounded-lg border border-gray-300 bg-white h-12 px-4 text-sm">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredCategories.map((cat) => (
                                        <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                                            {cat.category_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Nominal */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">Nominal</label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Masukkan nominal transaksi"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">Deskripsi / Kegunaan</label>
                        <Input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Contoh: Donasi Jumat atau Pembelian Alat"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                        />
                    </div>

                    {/* Tanggal Transaksi */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">Tanggal Transaksi</label>
                        <Input
                            type="date"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm"
                        />
                    </div>

                    {/* Tombol */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/keuangan")}
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
    )
}
