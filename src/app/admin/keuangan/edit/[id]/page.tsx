"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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
import { mapTransactionTypeToBackend, mapTransactionTypeToFrontend } from "../../utils"
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

export default function EditTransactionPage() {
    const router = useRouter()
    const params = useParams()
    const { profile } = useUserProfile()

    const [wallets, setWallets] = useState<WalletOption[]>([])
    const [categories, setCategories] = useState<CategoryOption[]>([])

    const [walletId, setWalletId] = useState("")
    const [amount, setAmount] = useState("")
    const [transactionType, setTransactionType] = useState<"Pemasukan" | "Pengeluaran" | "">("")
    const [selectedCategoryId, setSelectedCategoryId] = useState("")
    const [description, setDescription] = useState("")
    const [transactionDate, setTransactionDate] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id || !profile?.mosque_id) return

            try {
                // Fetch transaksi yang ingin diedit
                const txRes = await api.get(`/api/finance/transactions/${params.id}`)
                const tx = txRes.data

                setWalletId(tx.wallet_id.toString())
                setAmount(tx.amount.toString())
                setTransactionType(mapTransactionTypeToFrontend(tx.transaction_type))
                setSelectedCategoryId(tx.category_id.toString())
                setDescription(tx.source_or_usage || "")
                setTransactionDate(tx.transaction_date.slice(0, 10)) // hanya ambil YYYY-MM-DD

                // Fetch dompet dan kategori
                const [walletRes, categoryRes] = await Promise.all([
                    api.get(`/api/wallets/mosque/${profile.mosque_id}`),
                    api.get(`/api/finance/categories/mosque/${profile.mosque_id}`),
                ])
                setWallets(walletRes.data)
                setCategories(categoryRes.data)
            } catch (err) {
                console.error("Gagal mengambil data:", err)
                alert("Gagal mengambil data transaksi.")
                router.push("/admin/keuangan")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [params.id, profile?.mosque_id, router])

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
            await api.put(`/api/finance/transactions/${params.id}`, {
                wallet_id: Number(walletId),
                amount: Number(amount),
                transaction_type: mapTransactionTypeToBackend(transactionType),
                category_id: Number(selectedCategoryId),
                source_or_usage: description,
                transaction_date: transactionDate,
            })

            router.push("/admin/keuangan")
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            alert(error.response?.data?.message || "Gagal mengubah transaksi")
        }
    }

    if (isLoading) return <p className="p-4">Loading...</p>

    return (
        <div className="w-full px-4 py-6">
            <div className="w-full mx-auto">
                <h1 className="text-2xl font-bold text-[#1C143D] mb-6">Edit Transaksi Keuangan</h1>
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    {/* Dompet */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1C143D] mb-1">Pilih Dompet</label>
                        <Select value={walletId} onValueChange={setWalletId}>
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
                        <Select value={transactionType} onValueChange={(val) => {
                            setTransactionType(val as "Pemasukan" | "Pengeluaran")
                            setSelectedCategoryId("")
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
                            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
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
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400"
                        />
                    </div>

                    {/* Tanggal */}
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
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
