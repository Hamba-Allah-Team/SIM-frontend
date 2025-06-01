"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import api from "@/lib/api";

interface ExportReportModalProps {
    open: boolean;
    onClose: () => void;
}

export function ExportReportModal({ open, onClose }: ExportReportModalProps) {
    const [period, setPeriod] = useState<"monthly" | "yearly" | "">("");
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");

    const handleExport = async () => {
        if (!period || !year || (period === "monthly" && !month)) {
            alert("Lengkapi semua pilihan terlebih dahulu.");
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
                responseType: "blob", // Penting supaya dapat file binary
            });

            // Buat URL object untuk download
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `laporan_keuangan_${period}_${year}${period === "monthly" ? `_${month}` : ""}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            onClose();
        } catch (error) {
            alert("Gagal mengunduh laporan. Silakan coba lagi.");
            console.error(error);
        }
    };

    const handlePeriodChange = (value: string) => {
        setPeriod(value as "monthly" | "yearly" | "");
    };


    const years = Array.from({ length: 5 }, (_, i) => (2021 + i).toString());
    const months = [
        { value: "01", label: "Januari" },
        { value: "02", label: "Februari" },
        { value: "03", label: "Maret" },
        { value: "04", label: "April" },
        { value: "05", label: "Mei" },
        { value: "06", label: "Juni" },
        { value: "07", label: "Juli" },
        { value: "08", label: "Agustus" },
        { value: "09", label: "September" },
        { value: "10", label: "Oktober" },
        { value: "11", label: "November" },
        { value: "12", label: "Desember" },
    ];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-md w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Cetak Laporan Keuangan</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Periode</label>
                        <Select value={period} onValueChange={handlePeriodChange}>
                            <SelectTrigger className="w-full" >
                                <SelectValue placeholder="Pilih Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Bulanan</SelectItem>
                                <SelectItem value="yearly">Tahunan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Tahun</label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {period === "monthly" && (
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Bulan</label>
                            <Select value={month} onValueChange={setMonth}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((m) => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6">
                    <Button className="bg-[#FF9357] hover:bg-[#FF9357]/50 text-white font-semibold transition px-6 py-2 rounded-md" onClick={handleExport}>
                        Export PDF
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
}
