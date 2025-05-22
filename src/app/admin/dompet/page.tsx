"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ListPlus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { WalletApiResponse, Dompet } from "./types"
import { mapWalletApiToDompet } from "./utils"
import { useUserProfile } from "@/hooks/useUserProfile"

export default function DompetPage() {
    const { profile } = useUserProfile()
    const router = useRouter()
    const [data, setData] = useState<Dompet[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchWallets = async () => {
            if (!profile?.mosque_id) return
            setIsLoading(true)

            try {
                const res = await api.get<WalletApiResponse[]>(`/api/wallets/mosque/${profile.mosque_id}`)
                const mapped = mapWalletApiToDompet(res.data)
                setData(mapped)
            } catch (error) {
                console.error("Gagal fetch dompet:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchWallets()
    }, [profile?.mosque_id])

    const handleAddDompet = () => {
        router.push("/admin/dompet/tambah")
    }

    const walletTypes = data.map((wallet) => wallet.name.toLowerCase())
    const hasCash = walletTypes.includes("cash")
    const hasBank = walletTypes.includes("bank")
    const disableAddButton = hasCash && hasBank

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Data Dompet</h1>
                <Button
                    onClick={handleAddDompet}
                    disabled={disableAddButton}
                    className="flex items-center gap-2 bg-[#FF9357]/20 text-[#FF9357] px-4 py-2 rounded-md hover:bg-[#FF9357]/30 transition disabled:opacity-50"
                >
                    <ListPlus size={16} />
                    Tambah
                </Button>
            </div>

            <DataTable columns={columns} data={data} isLoading={isLoading} />
        </div>
    )
}
