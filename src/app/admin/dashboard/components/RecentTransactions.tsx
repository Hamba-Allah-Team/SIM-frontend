// app/admin/dashboard/components/RecentTransactions.tsx

'use client'

import { Transaction } from '../types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

interface Props {
    transactions: Transaction[]
}

export default function RecentTransactions({ transactions }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>5 Transaksi Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[250px] pr-4">
                    <ul className="space-y-3">
                        {transactions.map((tx) => (
                            <li key={tx.transaction_id} className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{tx.description || '-'}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(tx.date).toLocaleDateString()} · {tx.wallet}
                                    </p>
                                    <Badge variant="outline" className="text-xs mt-1">
                                        {tx.category}
                                    </Badge>
                                </div>
                                <div
                                    className={`text-sm font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}
                                >
                                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
