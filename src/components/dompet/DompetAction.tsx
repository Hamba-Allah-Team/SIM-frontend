"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog"
import { Dompet } from "@/app/admin/dompet/types"
import api from "@/lib/api"
import { toast } from "sonner"
import axios from "axios"

export default function DompetAction({ wallet, onDeleted }: { wallet: Dompet, onDeleted: () => void }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true);
        try {
            await api.delete(`/api/wallets/${wallet.id}`)
            toast.success("Dompet berhasil dihapus")
            onDeleted();
        } catch (error: unknown) {
            console.error("Gagal hapus dompet:", error)
            let errorMessage = "Gagal menghapus dompet.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                    Hapus
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-900">Yakin ingin menghapus dompet?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600">
                        Tindakan ini tidak bisa dibatalkan. Dompet <strong>{wallet.name}</strong> akan dihapus dari sistem.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-end gap-2">
                    {/* 👈 Tombol batal sekarang tidak lagi disabled */}
                    <AlertDialogCancel asChild>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto rounded-full border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10"
                        >
                            Batal
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            onClick={handleDelete}
                            disabled={loading}
                            className="w-full sm:w-auto rounded-full bg-red-600 text-white hover:bg-red-700"
                        >
                            {loading ? "Menghapus..." : "Ya, Hapus"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}