'use client'

import { Transaction } from '../types'
import { formatCurrency } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowDownLeft, ArrowUpRight, ReceiptText } from 'lucide-react'

interface Props {
    transactions: Transaction[] // Hanya akan berisi tipe 'income' atau 'expense'
}

export default function RecentTransactions({ transactions }: Props) {
    return (
        // 1. Mengubah Card menjadi flex-col untuk kontrol layout yang lebih baik
        <Card className="bg-white shadow-lg border border-slate-200/80 h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
                <CardTitle className="text-xl font-bold text-[#1C143D]">Transaksi Terbaru</CardTitle>
                <CardDescription className='text-slate-500'>5 transaksi terakhir yang tercatat.</CardDescription>
            </CardHeader>
            {/* 2. Menghapus padding default dan membiarkan ScrollArea mengontrolnya */}
            <CardContent className="flex-grow p-0 overflow-hidden">
                {/* 3. Menghapus tinggi tetap (h-[300px]) dari ScrollArea */}
                <ScrollArea className="h-full">
                    <div className="px-6 pb-6">
                        {transactions.length > 0 ? (
                            <ul className="space-y-2">
                                {transactions.map((tx, index) => {
                                    const isIncome = tx.type === 'income';
                                    return (
                                        <li
                                            key={tx.transaction_id}
                                            // 4. Menambahkan garis pemisah antar item
                                            className={`pt-4 ${index > 0 ? 'border-t' : ''}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex-shrink-0 p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    {isIncome ? (
                                                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <ArrowDownLeft className="h-5 w-5 text-red-600" />
                                                    )}
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    {/* 5. Memperbaiki tampilan teks agar tidak terpotong (truncate) */}
                                                    <p className="font-semibold text-slate-800 truncate" title={tx.description || tx.category || 'Transaksi'}>
                                                        {tx.description || tx.category || 'Transaksi'}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className={`font-bold text-base ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                                                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                                                    </div>
                                                    <p className="text-xs text-slate-400">{tx.wallet}</p>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <ReceiptText className="w-16 h-16 text-slate-300 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-600">Belum Ada Transaksi</h3>
                                <p className="text-sm text-slate-400">Data transaksi terbaru akan muncul di sini.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}