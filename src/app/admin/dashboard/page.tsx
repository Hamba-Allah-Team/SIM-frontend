// app/admin/dashboard/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { fetchSummary, fetchRecentTransactions, fetchTopCategories } from './utils'
import { SummaryData, Transaction, TopCategory } from './types'

import SummaryCard from './components/SummaryCard'
import WalletBalanceList from './components/WalletBalanceList'
import RecentTransactions from './components/RecentTransactions'
import TopCategoriesChart from './components/TopCategoriesChart'
import { useUserProfile } from '@/hooks/useUserProfile'

export default function DashboardPage() {
  const { profile, loading: loadingProfile } = useUserProfile()

  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [recentTx, setRecentTx] = useState<Transaction[]>([])
  const [topIncome, setTopIncome] = useState<TopCategory[]>([])
  const [topExpense, setTopExpense] = useState<TopCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.mosque_id) return

    const loadDashboard = async () => {
      setLoading(true)
      const now = new Date()
      const endDate = now.toISOString().split('T')[0]
      const startDate = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0]

      try {
        const mosqueId = profile.mosque_id.toString()

        const [summaryData, recent, incomeCats, expenseCats] = await Promise.all([
          fetchSummary(mosqueId),
          fetchRecentTransactions(mosqueId),
          fetchTopCategories(mosqueId, 'income', startDate, endDate),
          fetchTopCategories(mosqueId, 'expense', startDate, endDate),
        ])

        setSummary(summaryData)
        setRecentTx(recent)
        setTopIncome(incomeCats)
        setTopExpense(expenseCats)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [profile?.mosque_id])

  if (loadingProfile || loading || !summary) {
    return <p className="p-4">Memuat dashboard...</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <SummaryCard summary={summary} />
      <WalletBalanceList wallets={summary.wallet_balances} />
      <RecentTransactions transactions={recentTx} />
      <div className="grid md:grid-cols-2 gap-4">
        <TopCategoriesChart data={topIncome} title="Kategori Pemasukan Tertinggi" />
        <TopCategoriesChart data={topExpense} title="Kategori Pengeluaran Tertinggi" />
      </div>
    </div>
  )
}
