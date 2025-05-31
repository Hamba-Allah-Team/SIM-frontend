"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ListPlus, HandCoins } from "lucide-react"
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

    const handleTransferDompet = () => {
        router.push("/admin/dompet/transfer")
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Data Dompet</h1>
                <div className="flex gap-2">
                    <Button
                        onClick={handleTransferDompet}
                        className="flex items-center gap-2 bg-[#4F46E5]/20 text-[#4F46E5] px-4 py-2 rounded-md hover:bg-[#4F46E5]/30 transition disabled:opacity-50"
                    >
                        <HandCoins size={16} />
                        Transfer
                    </Button>
                    <Button
                        onClick={handleAddDompet}
                        className="flex items-center gap-2 bg-[#FF9357]/20 text-[#FF9357] px-4 py-2 rounded-md hover:bg-[#FF9357]/30 transition disabled:opacity-50"
                    >
                        <ListPlus size={16} />
                        Tambah
                    </Button>
                </div>
            </div>

            <DataTable columns={columns} data={data} isLoading={isLoading} />
        </div>
    )
}
