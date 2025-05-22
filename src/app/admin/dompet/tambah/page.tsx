"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TambahDompetPage() {
    const [jenis, setJenis] = useState("")
    const [balance, setBalance] = useState("")
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Kirim ke backend
        console.log({ jenis, balance })

        // Selesai, arahkan kembali ke halaman dompet
        router.push("/admin/dompet")
    }

    return (
        <div className="p-6 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Tambah Dompet</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label>Jenis Dompet</Label>
                    <Select onValueChange={setJenis}>
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Pilih jenis dompet" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Bank">Bank</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Saldo Awal</Label>
                    <Input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="Masukkan saldo awal"
                        className="mt-2"
                        required
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Batal
                    </Button>
                    <Button type="submit">Simpan</Button>
                </div>
            </form>
        </div>
    )
}
