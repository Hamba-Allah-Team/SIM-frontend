"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { apiClient as api } from '@/lib/api-client';
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
import { mapTransactionTypeToBackend, mapFullTransactionTypeToFrontend } from "../../utils"
import { AxiosError } from "axios"
import { toast } from "sonner";
import { ArrowLeft, Wallet } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils";

interface WalletOption {
    wallet_id: number
    wallet_name: string
    wallet_type: "cash" | "bank" | "ewallet" | "other"
    balance: number
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
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id || !profile?.mosque_id) return

            try {
                const [txRes, walletRes, categoryRes] = await Promise.all([
                    api.get(`/api/finance/transactions/${params.id}`),
                    api.get(`/api/wallets/mosque/${profile.mosque_id}`),
                    api.get(`/api/finance/categories/mosque/${profile.mosque_id}`),
                ])

                const tx = txRes.data
                setWalletId(tx.wallet_id.toString())
                setAmount(tx.amount.toString())
                setTransactionType(mapFullTransactionTypeToFrontend(tx.transaction_type) as "Pemasukan" | "Pengeluaran")
                setSelectedCategoryId(tx.category_id ? tx.category_id.toString() : "");
                setDescription(tx.source_or_usage || "")
                setTransactionDate(tx.transaction_date.slice(0, 10))
                setWallets(walletRes.data)
                setCategories(categoryRes.data)
            } catch (err) {
                console.error("Gagal mengambil data:", err)
                toast.error("Gagal mengambil data transaksi.")
                router.push("/admin/keuangan")
            } finally {
                setIsFetching(false)
            }
        }

        fetchData()
    }, [params.id, profile?.mosque_id, router])

    const selectedWallet = useMemo(() => {
        return wallets.find(w => w.wallet_id.toString() === walletId);
    }, [walletId, wallets]);

    const filteredCategories = transactionType
        ? categories.filter(
            (cat) => cat.category_type === mapTransactionTypeToBackend(transactionType)
        )
        : []

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (!transactionType || !selectedCategoryId) {
            toast.error("Jenis transaksi dan kategori harus dipilih")
            setIsLoading(false)
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
            toast.success("Transaksi berhasil diperbarui.");
            router.push("/admin/keuangan");
            router.refresh();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            const message = error.response?.data?.message || "Gagal mengubah transaksi";
            toast.error("Gagal Memperbarui", { description: message });
        } finally {
            setIsLoading(false);
        }
    }

    if (isFetching) return (
        <div className="w-full">
            <Button variant="ghost" className="mb-6 group text-slate-600 px-0">
                <ArrowLeft size={16} className="mr-2" />
                <Skeleton className="h-5 w-40" />
            </Button>
            <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
                <Skeleton className="h-8 w-1/3 mb-1" />
                <Skeleton className="h-6 w-2/3 mb-6" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="mb-1"><Skeleton className="h-4 w-1/4" /></div>
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                ))}
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <Skeleton className="h-12 w-full rounded-full" />
                    <Skeleton className="h-12 w-full rounded-full" />
                </div>
            </div>
        </div>
    );

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
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D] mb-2">Edit Transaksi Keuangan</h1>
                <p className="text-gray-500 mb-6">Perbarui detail transaksi yang sudah ada.</p>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="transactionType" className="block text-sm font-semibold text-[#1C143D] mb-1">Jenis Transaksi</Label>
                            <Select value={transactionType} onValueChange={(val) => {
                                setTransactionType(val as "Pemasukan" | "Pengeluaran")
                                setSelectedCategoryId("")
                            }}>
                                <SelectTrigger className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm text-gray-700 border border-slate-300 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]">
                                    <SelectValue placeholder="Pilih jenis transaksi" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-slate-800 border border-slate-300">
                                    <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                                    <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {transactionType && (
                            <div>
                                <Label htmlFor="category" className="block text-sm font-semibold text-[#1C143D] mb-1">Kategori Transaksi</Label>
                                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                    <SelectTrigger className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm text-gray-700 border border-slate-300 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-slate-800 border border-slate-300">
                                        {filteredCategories.map((cat) => (
                                            <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                                                {cat.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label className="block text-sm font-semibold text-[#1C143D] mb-1">Pilih Dompet</Label>
                            <Select value={walletId} onValueChange={setWalletId}>
                                <SelectTrigger className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-sm text-gray-700 border border-slate-300 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]">
                                    <SelectValue placeholder="Pilih dompet" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-slate-800 border border-slate-300">
                                    {wallets.map((wallet) => (
                                        <SelectItem key={wallet.wallet_id} value={wallet.wallet_id.toString()}>
                                            {wallet.wallet_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedWallet && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-100 p-2 text-slate-600">
                                    <Wallet size={16} />
                                    <p className="text-xs">
                                        Saldo tersedia: <span className="font-semibold text-slate-800">{formatCurrency(selectedWallet.balance)}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            <Label className="block text-sm font-semibold text-[#1C143D] mb-1">Nominal</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-slate-800 border border-slate-300 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="block text-sm font-semibold text-[#1C143D] mb-1">Deskripsi / Kegunaan</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-[#F7F8FA] rounded-lg px-4 py-3 placeholder:text-sm placeholder:text-gray-400 text-slate-800 border border-slate-300 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label className="block text-sm font-semibold text-[#1C143D] mb-1">Tanggal Transaksi</Label>
                        <Input
                            type="date"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-slate-800 border border-slate-300 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            style={{ colorScheme: 'light' }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/keuangan")}
                            className="w-full h-12 bg-white rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}