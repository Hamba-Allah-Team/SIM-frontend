"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ListPlus } from "lucide-react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { TransactionCategory } from "./types"
import { getTransactionCategories } from "./utils"
import { useUserProfile } from "@/hooks/useUserProfile"

export default function TransactionCategoryPage() {
    const { profile } = useUserProfile()
    const router = useRouter()
    const [data, setData] = useState<TransactionCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!profile?.mosque_id) return
            setIsLoading(true)

            try {
                const categories = await getTransactionCategories(profile.mosque_id)
                setData(categories)
            } catch (error) {
                console.error("Gagal fetch kategori transaksi:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [profile?.mosque_id])

    const handleAddCategory = () => {
        router.push("/admin/kategori-transaksi/tambah")
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Kategori Transaksi</h1>
                <Button
                    onClick={handleAddCategory}
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
