// app/admin/dashboard/components/WalletBalanceList.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Wallet as WalletIcon, Landmark, Smartphone, CircleDollarSign } from 'lucide-react'
import { ReactNode } from 'react'

// Tipe data dompet
interface Wallet {
    wallet_id: number
    wallet_name: string
    wallet_type: string // "cash", "bank", "ewallet", "other"
    balance: number
}

interface Props {
    wallets: Wallet[]
}

// Helper untuk memilih ikon dan warna berdasarkan jenis dompet
const getWalletVisuals = (type: string): { icon: ReactNode, colorClasses: string } => {
    // 👈 Perbaikan: Tambahkan pemeriksaan untuk menangani type yang mungkin undefined/null
    const safeType = type || 'other';

    switch (safeType.toLowerCase()) {
        case 'cash':
            return {
                icon: <WalletIcon className="h-6 w-6 text-emerald-600" />,
                colorClasses: "border-emerald-500 bg-emerald-50"
            };
        case 'bank':
            return {
                icon: <Landmark className="h-6 w-6 text-sky-600" />,
                colorClasses: "border-sky-500 bg-sky-50"
            };
        case 'ewallet':
            return {
                icon: <Smartphone className="h-6 w-6 text-violet-600" />,
                colorClasses: "border-violet-500 bg-violet-50"
            };
        default:
            return {
                icon: <CircleDollarSign className="h-6 w-6 text-slate-600" />,
                colorClasses: "border-slate-500 bg-slate-50"
            };
    }
};

export default function WalletBalanceList({ wallets }: Props) {
    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold text-[#1C143D] mb-4">Saldo Tiap Dompet</h2>
            {wallets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wallets.map((wallet) => {
                        const { icon, colorClasses } = getWalletVisuals(wallet.wallet_type);
                        return (
                            <Card key={wallet.wallet_id} className={`bg-white shadow-lg border-l-4 ${colorClasses}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-slate-800">{wallet.wallet_name}</CardTitle>
                                            <CardDescription className="text-sm text-slate-400">
                                                {wallet.wallet_type ? wallet.wallet_type.charAt(0).toUpperCase() + wallet.wallet_type.slice(1) : 'Lainnya'}
                                            </CardDescription>
                                        </div>
                                        <div className={`p-2 ${colorClasses} rounded-lg`}>
                                            {icon}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {formatCurrency(wallet.balance)}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <p className="text-slate-500">Belum ada dompet yang dibuat.</p>
                </div>
            )}
        </div>
    )
}
