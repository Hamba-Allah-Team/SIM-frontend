"use client";

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, UploadCloud, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // 👈 Mengimpor Label dari shadcn/ui
import { toast as sonnerToast } from "sonner";
import { getActivityById, updateActivity, getFullImageUrl } from "../../utils";
// import { Activity } from "../../types"; // Dihapus karena tidak digunakan secara langsung
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

export default function EditKegiatanPage() {
    const router = useRouter();
    const params = useParams();
    const activityId = Number(params.id);

    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [activityImageFile, setActivityImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (activityId) {
            const fetchActivityData = async () => {
                setIsFetching(true);
                try {
                    const activityData = await getActivityById(activityId);
                    if (activityData) {
                        setEventName(activityData.event_name);
                        setEventDescription(activityData.event_description || "");
                        setStartDate(activityData.start_date ? new Date(activityData.start_date).toISOString().split('T')[0] : "");
                        setEndDate(activityData.end_date ? new Date(activityData.end_date).toISOString().split('T')[0] : "");
                        setStartTime(activityData.start_time ? activityData.start_time.substring(0, 5) : "");
                        setEndTime(activityData.end_time ? activityData.end_time.substring(0, 5) : "");

                        const fullImageUrl = getFullImageUrl(activityData.image);
                        setCurrentImage(fullImageUrl);
                        setImagePreview(fullImageUrl);
                    } else {
                        sonnerToast.error("Kegiatan tidak ditemukan.");
                        router.push("/admin/kegiatan");
                    }
                } catch (error) {
                    console.error("Gagal mengambil data kegiatan:", error);
                    sonnerToast.error("Gagal mengambil data kegiatan.");
                } finally {
                    setIsFetching(false);
                }
            };
            fetchActivityData();
        }
    }, [activityId, router]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                sonnerToast.error("Ukuran Gambar Terlalu Besar", { description: "Maksimal 5MB." });
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                sonnerToast.error("Format Gambar Tidak Valid", { description: "Hanya JPEG, JPG, PNG." });
                return;
            }
            setActivityImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImagePreview = () => {
        setActivityImageFile(null);
        setImagePreview(currentImage);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const clearCurrentImageAndSelection = () => {
        setActivityImageFile(null);
        setImagePreview(null);
        setCurrentImage(null);
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

        const formData = new FormData();
        formData.append("event_name", eventName.trim());
        if (eventDescription.trim()) formData.append("event_description", eventDescription.trim());
        formData.append("start_date", startDate);
        formData.append("start_time", startTime);
        if (endDate) formData.append("end_date", endDate);
        if (endTime) formData.append("end_time", endTime);

        if (activityImageFile) {
            formData.append("activityImage", activityImageFile);
        } else if (!imagePreview && currentImage) {
            // Backend perlu di-handle untuk menghapus gambar jika field 'activityImage' tidak ada
        }


        try {
            await updateActivity(activityId, formData);
            sonnerToast.success("Kegiatan berhasil diperbarui.");
            router.push("/admin/kegiatan");
            router.refresh();
        } catch (error: unknown) {
            console.error("Gagal memperbarui kegiatan:", error);
            let errorMessage = "Terjadi kesalahan saat memperbarui kegiatan.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            sonnerToast.error("Gagal Memperbarui Kegiatan", { description: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="w-full px-4 py-6 min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
                    <Skeleton className="h-8 w-1/3 mb-1" />
                    <Skeleton className="h-6 w-2/3 mb-6" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="mb-1"><Skeleton className="h-4 w-1/4" /></div> {/* Placeholder untuk Label */}
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                    ))}
                    <div className="h-40 w-full"><Skeleton className="h-full w-full rounded-lg" /></div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Skeleton className="h-12 w-full rounded-full" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-6 min-h-screen bg-slate-50">
            <Button variant="outline" onClick={() => router.back()} className="mb-6 group text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-300">
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Kembali
            </Button>
            <div className="w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1C143D] mb-2">
                    Ubah Kegiatan
                </h1>
                <p className="text-gray-500 mb-6">Perbarui detail kegiatan yang sudah ada.</p>

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <div>
                        <Label htmlFor="eventName" className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Nama Kegiatan <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="eventName"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                            className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                        />
                    </div>

                    <div>
                        <Label htmlFor="eventDescription" className="block text-sm font-semibold text-[#1C143D] mb-1">Deskripsi Kegiatan</Label>
                        <Textarea
                            id="eventDescription"
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            rows={4}
                            placeholder="Jelaskan detail kegiatan di sini..."
                            className="w-full bg-[#F7F8FA] rounded-lg px-4 py-3 placeholder:text-sm placeholder:text-gray-400 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="startDate" className="block text-sm font-semibold text-[#1C143D] mb-1">Tanggal Mulai <span className="text-red-500">*</span></Label>
                            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]" />
                        </div>
                        <div>
                            <Label htmlFor="startTime" className="block text-sm font-semibold text-[#1C143D] mb-1">Jam Mulai <span className="text-red-500">*</span></Label>
                            <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="endDate" className="block text-sm font-semibold text-[#1C143D] mb-1">Tanggal Selesai (Opsional)</Label>
                            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || undefined} className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]" />
                        </div>
                        <div>
                            <Label htmlFor="endTime" className="block text-sm font-semibold text-[#1C143D] mb-1">Jam Selesai (Opsional)</Label>
                            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full bg-[#F7F8FA] h-12 rounded-lg px-4 text-gray-700 focus:border-[#FF8A4C] focus:ring-[#FF8A4C]" />
                        </div>
                    </div>

                    <div>
                        <Label className="block text-sm font-semibold text-[#1C143D] mb-1">
                            Gambar Kegiatan
                        </Label>
                        <div // Mengubah label menjadi div untuk dropzone, dan menggunakan Label shadcn di dalamnya
                            className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-[#FF8A4C] transition-colors bg-[#F7F8FA]/50 min-h-[150px]"
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                            role="button"
                            tabIndex={0}
                            aria-labelledby="file-upload-text-edit"
                        >
                            <div className="space-y-1 text-center py-4">
                                {imagePreview ? (
                                    <div className="relative group w-full max-w-sm mx-auto">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview Gambar Kegiatan"
                                            width={300}
                                            height={168}
                                            className="rounded-md object-contain max-h-[200px]"
                                            unoptimized={activityImageFile ? false : (currentImage ? true : false)}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://placehold.co/300x168/E2E8F0/94A3B8?text=Error";
                                                (e.target as HTMLImageElement).alt = "Gagal memuat gambar";
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (activityImageFile) removeImagePreview();
                                                else clearCurrentImageAndSelection();
                                            }}
                                            aria-label="Hapus gambar terpilih atau gambar saat ini"
                                        >
                                            <XCircle size={16} />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                                        <div id="file-upload-text-edit" className="flex text-sm text-gray-600 items-center justify-center">
                                            <Label // Menggunakan Label shadcn untuk teks "Unggah file baru"
                                                htmlFor="activityImage-input-edit"
                                                className="relative rounded-md font-medium text-[#FF8A4C] hover:text-[#ff7a38] focus-within:outline-none cursor-pointer"
                                            >
                                                Unggah file baru
                                            </Label>
                                            <p className="pl-1 text-gray-500">atau tarik dan lepas</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG hingga 5MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <input
                            id="activityImage-input-edit"
                            name="activityImage-input-edit"
                            type="file"
                            className="sr-only"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg, image/jpg"
                            aria-hidden="true" // Karena dikontrol oleh div di atas
                        />
                        {currentImage && !activityImageFile && imagePreview && (
                            <p className="text-xs text-gray-500 mt-1 text-center">Gambar saat ini akan tetap digunakan jika tidak ada file baru yang diunggah.</p>
                        )}
                        {currentImage && imagePreview === null && (
                            <p className="text-xs text-red-500 mt-1 text-center">Gambar saat ini akan dihapus jika disimpan.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/kegiatan")}
                            className="w-full h-12 rounded-full border-[#FF8A4C] text-[#FF8A4C] font-semibold hover:bg-[#FF8A4C]/10 transition-colors"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full bg-[#FF8A4C] hover:bg-[#ff7a38] text-white font-semibold transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}