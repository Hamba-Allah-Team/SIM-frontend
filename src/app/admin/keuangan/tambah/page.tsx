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
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


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
    const [transactionDate, setTransactionDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter()
    const { profile } = useUserProfile()

    // 👈 Hook untuk mereset state saat komponen tidak lagi ditampilkan
    useEffect(() => {
        const resetForm = () => {
            setWalletId("");
            setAmount("");
            setTransactionType("");
            setSelectedCategoryId("");
            setDescription("");
            setTransactionDate(new Date().toISOString().split("T")[0]);
        };

        // Saat komponen dihancurkan (unmount), panggil fungsi reset
        return () => {
            resetForm();
        };
    }, []);

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
        setIsLoading(true);

        if (!walletId || !amount || !transactionType || !selectedCategoryId || !transactionDate) {
            toast.error("Semua field wajib diisi kecuali deskripsi.")
            setIsLoading(false);
            return
        }

        try {
            await api.post("/api/finance/transactions", {
                wallet_id: Number(walletId),
                amount: parseFloat(amount),
                transaction_type: mapTransactionTypeToBackend(transactionType),
                category_id: Number(selectedCategoryId),
                source_or_usage: description.trim(),
                transaction_date: transactionDate,
            })
            toast.success("Transaksi berhasil ditambahkan.");
            router.push("/admin/keuangan");
            router.refresh();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            const message = error.response?.data?.message || "Gagal menambahkan transaksi";
            toast.error("Gagal Menambah Transaksi", { description: message });
        } finally {
            setIsLoading(false);
        }
    }

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
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D] mb-2">Tambah Transaksi Keuangan</h1>
                <p className="text-gray-500 mb-6">Catat pemasukan atau pengeluaran baru.</p>
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="transactionType" className="block text-sm font-semibold text-[#1C143D] mb-1">Jenis Transaksi <span className="text-red-500">*</span></Label>
                            <Select onValueChange={(val) => {
                                setTransactionType(val as "Pemasukan" | "Pengeluaran")
                                setSelectedCategoryId("")
                            }} value={transactionType}>
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
                                <Label htmlFor="category" className="block text-sm font-semibold text-[#1C143D] mb-1">Kategori Transaksi <span className="text-red-500">*</span></Label>
                                <Select onValueChange={setSelectedCategoryId} value={selectedCategoryId}>
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
                            <Label htmlFor="wallet" className="block text-sm font-semibold text-[#1C143D] mb-1">Pilih Dompet <span className="text-red-500">*</span></Label>
                            <Select onValueChange={setWalletId} value={walletId}>
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
                        </div>
                        <div>
                            <Label htmlFor="amount" className="block text-sm font-semibold text-[#1C143D] mb-1">Nominal <span className="text-red-500">*</span></Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Masukkan nominal transaksi"
                                className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-slate-600/80 text-slate-800 border border-slate-300 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" className="block text-sm font-semibold text-[#1C143D] mb-1">Deskripsi / Keterangan</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Contoh: Donasi Jumat atau Pembelian Alat"
                            className="w-full bg-[#F7F8FA] rounded-lg px-4 py-3 placeholder:text-sm placeholder:text-slate-600/80 text-slate-800 border border-slate-300 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="transactionDate" className="block text-sm font-semibold text-[#1C143D] mb-1">Tanggal Transaksi <span className="text-red-500">*</span></Label>
                        <Input
                            id="transactionDate"
                            type="date"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-slate-600/80 text-slate-800 border border-slate-300 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            required
                            style={{ colorScheme: 'light' }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/keuangan")}
                            className="w-full bg-white h-12 rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}