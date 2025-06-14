"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { apiClient as api } from '@/lib/api-client';
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ExportReportModalProps {
    open: boolean;
    onClose: () => void;
}

export function ExportReportModal({ open, onClose }: ExportReportModalProps) {
    const [period, setPeriod] = useState<"monthly" | "yearly" | "">("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        setIsLoading(true);
        if (!period || !year || (period === "monthly" && !month)) {
            toast.error("Lengkapi semua pilihan terlebih dahulu.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get("/api/finance/report/export", {
                params: {
                    period,
                    year,
                    ...(period === "monthly" ? { month } : {}),
                    format: "pdf",
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `laporan_keuangan_${period}_${year}${period === "monthly" ? `_${month}` : ""}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            onClose();
        } catch (error) {
            toast.error("Gagal mengunduh laporan. Silakan coba lagi.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePeriodChange = (value: string) => {
        setPeriod(value as "monthly" | "yearly" | "");
    };


    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
    const months = [
        { value: "01", label: "Januari" }, { value: "02", label: "Februari" },
        { value: "03", label: "Maret" }, { value: "04", label: "April" },
        { value: "05", label: "Mei" }, { value: "06", label: "Juni" },
        { value: "07", label: "Juli" }, { value: "08", label: "Agustus" },
        { value: "09", label: "September" }, { value: "10", label: "Oktober" },
        { value: "11", label: "November" }, { value: "12", label: "Desember" },
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-md w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-slate-900">Cetak Laporan Keuangan</DialogTitle>
                    <DialogDescription className="text-slate-500">Pilih periode laporan yang ingin dicetak.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <Label className="block mb-1 text-sm font-semibold text-[#1C143D]">Periode</Label>
                        <Select value={period} onValueChange={handlePeriodChange}>
                            <SelectTrigger className="w-full h-12 rounded-lg bg-[#F7F8FA] placeholder:text-slate-600/80 text-slate-800 border border-slate-300">
                                <SelectValue placeholder="Pilih Periode" />
                            </SelectTrigger>
                            <SelectContent className="bg-white placeholder:text-slate-600/80 text-slate-800 border border-slate-300">
                                <SelectItem value="monthly">Bulanan</SelectItem>
                                <SelectItem value="yearly">Tahunan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="block mb-1 text-sm font-semibold text-[#1C143D]">Tahun</Label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-full h-12 rounded-lg bg-[#F7F8FA] placeholder:text-slate-600/80 text-slate-800 border border-slate-300">
                                <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent className="bg-white placeholder:text-slate-600/80 text-slate-800 border border-slate-300">
                                {years.map((y) => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {period === "monthly" && (
                        <div>
                            <Label className="block mb-1 text-sm font-semibold text-[#1C143D]">Bulan</Label>
                            <Select value={month} onValueChange={setMonth}>
                                <SelectTrigger className="w-full h-12 rounded-lg bg-[#F7F8FA] placeholder:text-slate-600/80 text-slate-800 border border-slate-300">
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent className="bg-white placeholder:text-slate-600/80 text-slate-800 border border-slate-300">
                                    {months.map((m) => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-8">
                    <Button
                        className="w-full h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold"
                        onClick={handleExport}
                        disabled={isLoading}
                    >
                        {isLoading ? "Mengekspor..." : "Export PDF"}
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
}