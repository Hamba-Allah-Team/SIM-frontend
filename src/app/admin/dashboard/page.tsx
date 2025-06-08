// app/admin/dashboard/page.tsx

'use client'

import { useEffect, useState, useCallback } from 'react'
import { fetchSummary, fetchRecentTransactions, fetchTopCategories } from './utils'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { SummaryData, Transaction, TopCategory } from './types'
import { useLineStats } from '@/hooks/useLineStats';
import AreaIncomeExpenseChart from './components/AreaIncomeExpenseChart';
import { Skeleton } from '@/components/ui/skeleton';

import SummaryCard from './components/SummaryCard'
import WalletBalanceList from './components/WalletBalanceList'
import RecentTransactions from './components/RecentTransactions'
import TopCategoriesChart from './components/TopCategoriesChart'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { profile, loading: loadingProfile } = useUserProfile()

  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [recentTx, setRecentTx] = useState<Transaction[]>([])
  const [topIncome, setTopIncome] = useState<TopCategory[]>([])
  const [topExpense, setTopExpense] = useState<TopCategory[]>([])
  const [loading, setLoading] = useState(true)

  const [range, setRange] = useState<'7d' | '1m' | '1y'>('1m')
  const { data: lineStats, loading: loadingChart } = useLineStats(profile?.mosque_id?.toString() || '', range)

  const fetchData = useCallback(async (isRefreshing = false) => {
    if (!profile?.mosque_id) return;

    if (!isRefreshing) {
      setLoading(true);
    }

    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    // Ambil data 30 hari terakhir untuk top categories
    const startDate = new Date(new Date().setDate(now.getDate() - 30)).toISOString().split('T')[0];

    try {
      const mosqueId = profile.mosque_id.toString();

      const [summaryData, recent, incomeCats, expenseCats] = await Promise.all([
        fetchSummary(mosqueId),
        fetchRecentTransactions(mosqueId),
        fetchTopCategories(mosqueId, 'income', startDate, endDate),
        fetchTopCategories(mosqueId, 'expense', startDate, endDate),
      ]);

      setSummary(summaryData);
      setRecentTx(recent);
      setTopIncome(incomeCats);
      setTopExpense(expenseCats);
    } catch (error: unknown) {
      console.error("Gagal memuat data dasbor:", error);
      let errorMessage = "Tidak dapat mengambil data dasbor.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }
      toast.error("Gagal Memuat Data", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [profile?.mosque_id]);

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile, fetchData]);

  if (loadingProfile || !summary) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-lg lg:col-span-2" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D]">Dashboard</h1>
        <Button
          onClick={() => fetchData(true)}
          variant="outline"
          className="flex items-center gap-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Baris 1: Kartu Ringkasan Utama */}
      <SummaryCard summary={summary} />

      {/* Baris 2: Grafik Utama dan Transaksi Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white p-6 rounded-xl shadow-lg border border-slate-200/80 h-full">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between">
                <div className='space-y-1'>
                  <CardTitle className="text-xl font-bold text-[#1C143D]">Grafik Keuangan</CardTitle>
                  <CardDescription className='text-slate-500'>Pemasukan vs Pengeluaran</CardDescription>
                </div>
                <Select value={range} onValueChange={(val) => setRange(val as '7d' | '1m' | '1y')}>
                  <SelectTrigger className="w-[120px] h-9 bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100">
                    <SelectValue placeholder="Pilih range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-slate-600 border border-slate-200">
                    <SelectItem value="7d">7 Hari</SelectItem>
                    <SelectItem value="1m">1 Bulan</SelectItem>
                    <SelectItem value="1y">1 Tahun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingChart ? (
                <div className="h-[350px] flex items-center justify-center">
                  <p>Memuat grafik...</p>
                </div>
              ) : (
                <AreaIncomeExpenseChart data={lineStats} range={range} />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <RecentTransactions transactions={recentTx} />
        </div>
      </div>

      {/* Baris 3: Saldo Dompet */}
      <WalletBalanceList wallets={summary.wallet_balances} />

      {/* Baris 4: Grafik kategori tertinggi */}
      <div className="grid md:grid-cols-2 gap-6">
        <TopCategoriesChart data={topIncome} title="Kategori Pemasukan Teratas" />
        <TopCategoriesChart data={topExpense} title="Kategori Pengeluaran Teratas" />
      </div>
    </div>
  )
}
