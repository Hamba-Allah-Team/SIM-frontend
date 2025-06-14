"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, UploadCloud, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // Menggunakan Label dari shadcn/ui
import { toast as sonnerToast } from "sonner";
import { createActivity } from "../utils";
import axios from "axios";

export default function TambahKegiatanPage() {
    const router = useRouter();
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [activityImage, setActivityImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                sonnerToast.error("Ukuran Gambar Terlalu Besar", { description: "Ukuran gambar maksimal adalah 5MB." });
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                sonnerToast.error("Format Gambar Tidak Valid", { description: "Hanya format JPEG, JPG, PNG yang diizinkan." });
                return;
            }
            setActivityImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setActivityImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (!eventName || !startDate || !startTime) {
            sonnerToast.error("Input Tidak Lengkap", { description: "Nama kegiatan, tanggal mulai, dan waktu mulai wajib diisi." });
            setIsLoading(false);
            return;
        }

        if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
            sonnerToast.error("Tanggal Tidak Valid", { description: "Tanggal selesai tidak boleh sebelum tanggal mulai." });
            setIsLoading(false);
            return;
        }

        if (endDate === startDate && endTime && startTime && endTime <= startTime) {
            sonnerToast.error("Waktu Tidak Valid", { description: "Jam selesai harus setelah jam mulai pada hari yang sama." });
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("event_name", eventName.trim());
        if (eventDescription.trim()) formData.append("event_description", eventDescription.trim());
        formData.append("start_date", startDate);
        formData.append("start_time", startTime);
        if (endDate) formData.append("end_date", endDate);
        if (endTime) formData.append("end_time", endTime);
        if (activityImage) {
            formData.append("activityImage", activityImage);
        }

        try {
            await createActivity(formData);
            sonnerToast.success("Kegiatan baru berhasil ditambahkan.");
            router.push("/admin/kegiatan");
            router.refresh();
        } catch (error: unknown) {
            console.error("Gagal menambah kegiatan:", error);
            let errorMessage = "Terjadi kesalahan saat menambah kegiatan.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            sonnerToast.error("Gagal Menambah Kegiatan", { description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full px-4 py-6 min-h-screen bg-slate-50">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 group text-slate-600 hover:text-slate-900 px-0"
            >
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Kembali
            </Button>
            <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D] mb-2">
                    Tambah Kegiatan Baru
                </h1>
                <p className="text-gray-500 mb-6">Isi detail kegiatan yang akan dilaksanakan.</p>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                        <Label htmlFor="eventName" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nama Kegiatan <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="eventName"
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Contoh: Kajian Subuh Akbar Mingguan"
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="eventDescription" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Deskripsi Kegiatan (Opsional)
                        </Label>
                        <Textarea
                            id="eventDescription"
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            placeholder="Jelaskan detail kegiatan di sini, seperti tema, penceramah, dll."
                            className="w-full bg-[#F7F8FA] rounded-lg px-4 py-3 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="startDate" className="block text-sm font-semibold text-[#1C143D] mb-1">
                                Tanggal Mulai <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                                required
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="startTime" className="block text-sm font-semibold text-[#1C143D] mb-1">
                                Jam Mulai <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                                required
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="endDate" className="block text-sm font-semibold text-[#1C143D] mb-1">
                                Tanggal Selesai (Opsional)
                            </Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || undefined}
                                className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="endTime" className="block text-sm font-semibold text-[#1C143D] mb-1">
                                Jam Selesai (Opsional)
                            </Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                                style={{ colorScheme: 'light' }}
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Gambar Kegiatan (Opsional)
                        </Label>
                        <div
                            // Mengganti div menjadi label dan menghubungkannya ke input file
                            // onClick dan role="button" tidak lagi diperlukan pada elemen ini
                            // karena label secara default akan memicu input yang terhubung
                            className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-[#FF8A4C] transition-colors bg-[#F7F8FA]/50 min-h-[150px]"
                            onClick={() => fileInputRef.current?.click()} // Tetap biarkan onClick untuk memicu input file
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                            role="button" // Tetap biarkan role untuk semantik
                            tabIndex={0}
                            aria-labelledby="file-upload-text-tambah" // Memberi label pada div yang bisa diklik
                        >
                            {imagePreview ? (
                                <div className="relative group w-full max-w-sm mx-auto">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview Gambar Kegiatan"
                                        width={300}
                                        height={168}
                                        className="rounded-md object-contain max-h-[200px]"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                        aria-label="Hapus gambar terpilih"
                                    >
                                        <XCircle size={16} />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-1 text-center py-4">
                                    <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                                    <div id="file-upload-text-tambah" className="flex text-sm text-gray-600 items-center justify-center">
                                        <span
                                            className="relative rounded-md font-medium text-[#FF8A4C] hover:text-[#ff7a38] focus-within:outline-none"
                                        >
                                            Unggah file
                                        </span>
                                        <p className="pl-1 text-gray-500">atau tarik dan lepas</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG hingga 5MB</p>
                                </div>
                            )}
                        </div>
                        <input
                            id="activityImage-input-tambah" // ID ini untuk referensi internal jika diperlukan, tapi label luar tidak pakai htmlFor
                            name="activityImage-input-tambah"
                            type="file"
                            className="sr-only"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg, image/jpg"
                            aria-hidden="true" // Karena dikontrol oleh div di atas
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/kegiatan")}
                            className="w-full h-12 rounded-full bg-white border-[#FF9357] text-[#FF9357] font-semibold hover:bg-[#FF9357]/10 transition-colors"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full bg-[#FF9357] hover:bg-[#ff7a38] text-white font-semibold transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan Kegiatan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}