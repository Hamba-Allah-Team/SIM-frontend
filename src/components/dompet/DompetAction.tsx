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
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import { Dompet } from "@/app/admin/dompet/types"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function WalletAction({ wallet }: { wallet: Dompet }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        try {
            setLoading(true)
            await api.delete(`/api/wallets/${wallet.id}`)
            toast.success("Dompet berhasil dihapus")
            router.refresh()
        } catch (error: unknown) {
            console.error("Gagal hapus dompet:", error)
            toast.error("Gagal menghapus dompet")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                    Hapus
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Yakin ingin menghapus dompet?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak bisa dibatalkan. Dompet akan dihapus dari sistem.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={loading}>
                        {loading ? "Menghapus..." : "Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
