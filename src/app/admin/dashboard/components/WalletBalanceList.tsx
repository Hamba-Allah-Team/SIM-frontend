// app/admin/dashboard/components/WalletBalanceList.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface Props {
    wallets: {
        wallet_id: number
        wallet_name: string
        balance: number
    }[]
}

export default function WalletBalanceList({ wallets }: Props) {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Saldo Tiap Dompet</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wallets.map((wallet) => (
                    <Card key={wallet.wallet_id}>
                        <CardHeader>
                            <CardTitle>{wallet.wallet_name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium text-foreground">
                                {formatCurrency(wallet.balance)}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
