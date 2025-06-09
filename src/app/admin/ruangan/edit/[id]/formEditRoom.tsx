"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageDropzone from "@/components/imageDropZone";
import { Button } from "@/components/ui/button";
import { Link, Trash2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
    place_name: z.string().min(1, "Nama ruangan tidak boleh kosong"),
    description: z.string().optional(),
    image: z.union([z.instanceof(File), z.string(), z.undefined()]).optional(),
    created_at: z.string().optional(),
});

export default function FormEditRoom() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [deleteImage, setDeleteImage] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            place_name: "",
            description: "",
            image: undefined,
            created_at: new Date().toISOString().split("T")[0],
        },
    });

    const fetchRoomData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/rooms/${id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (!res.ok) throw new Error("Gagal mengambil data ruangan");

            const json = await res.json();
            const data = json.data;

            form.reset({
                place_name: data.place_name,
                description: data.description,
                image: data.image, // Set image to the existing URL string
                created_at: data.created_at.split("T")[0],
            });

            if (data.image) {
                setPreviewUrl(data.image);
                const urlParts = data.image.split("/");
                setFileName(urlParts[urlParts.length - 1]);
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Terjadi kesalahan: " + error.message, {
                    style: { backgroundColor: "white", color: "black", border: "2px solid #ef4444" },
                });
            } else {
                toast.error("Terjadi kesalahan saat mengambil data ruangan", {
                    style: { backgroundColor: "white", color: "black", border: "2px solid #ef4444" },
                });
            }
        } finally {
            setLoading(false);
        }
    }, [id, form]); // Added form to dependencies

    useEffect(() => {
        if (id) {
            fetchRoomData();
        }
    }, [id, fetchRoomData]);

    const handleDropImage = (file: File) => {
        setSelectedFile(file); // Store the actual File object
        setFileName(file.name);
        setPreviewUrl(URL.createObjectURL(file));
        setDeleteImage(false); // Reset deleteImage when a new image is dropped
        form.setValue("image", file, { shouldValidate: true }); // Update form value with the File object
    };

    const handleDeleteImage = () => {
        setSelectedFile(null); // Clear the selected file
        form.setValue("image", "", { shouldValidate: true }); // Clear the image field in the form
        setFileName(null);
        setPreviewUrl(null);
        setDeleteImage(true); // Indicate that the image should be deleted on submit
    };

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:"))
                URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    async function onSubmit(data: z.infer<typeof formSchema>) {
        if (!id) return alert("ID ruangan tidak ditemukan");

        const formData = new FormData();
        formData.append("place_name", data.place_name);
        formData.append("description", data.description || "");

        if (deleteImage) {
            formData.append("delete_image", "true");
        } else if (selectedFile) { // Append the actual file object if a new one is selected
            formData.append("image", selectedFile);
        } else if (data.image && typeof data.image === "string") {
            // If the image is a string (existing URL), append it as a string
            formData.append("image", data.image);
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API}/api/rooms/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Gagal memperbarui data ruangan");
            }
            toast.success("Berhasil memperbarui data ruangan", {
                style: {
                    backgroundColor: "white",
                    color: "black",
                    border: "2px solid #22c55e",
                },
            });
            router.push("/admin/ruangan");
        } catch (error) {
            toast.error("Gagal memperbarui data ruangan: " + (error instanceof Error ? error.message : "Terjadi kesalahan"), {
                style: {
                    backgroundColor: "white",
                    color: "black",
                    border: "2px solid #ef4444",
                },
            });
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Nama Ruangan */}
                <FormField
                    control={form.control}
                    name="place_name"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                                Nama Ruangan
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Masukkan nama ruangan"
                                    className={`bg-white text-black ${
                                        fieldState.error ? "border border-red-500 placeholder-red-600" : "border border-gray-300 placeholder-gray-400"
                                    } pr-10`}
                                    aria-invalid={fieldState.error ? "true" : "false"}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {/* Deskripsi Ruangan */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                                Deskripsi Ruangan
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Masukkan deskripsi ruangan"
                                    className={`bg-white text-black ${
                                        fieldState.error ? "border border-red-500 placeholder-red-600" : "border border-gray-300 placeholder-gray-400"
                                    } pr-10`}
                                    rows={4}
                                    aria-invalid={fieldState.error ? "true" : "false"}
                                />
                            </FormControl>
                            {/* <FormMessage /> */}
                        </FormItem>
                    )}
                />
                {/* Gambar Ruangan */}
                <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                        <FormItem>
                            <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                                Gambar Ruangan
                            </FormLabel>
                            <FormControl>
                                {previewUrl ? (
                                    <div className="relative mb-4">
                                        <div className="relative w-full">
                                            <input
                                                type="text"
                                                value={typeof fileName === "string" ? fileName : ""}
                                                readOnly
                                                placeholder="Nama file"
                                                className="w-full bg-white text-black border border-gray-300 placeholder-gray-400 py-2 rounded-md pl-9 pr-9 cursor-not-allowed"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleDeleteImage}
                                                aria-label="Hapus gambar"
                                                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <Link className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <img
                                            src={
                                                previewUrl
                                                    ? previewUrl.startsWith("blob:")
                                                        ? previewUrl
                                                        : `${API}/uploads/${previewUrl}`
                                                    : ""
                                            }
                                            alt="Preview Gambar"
                                            className="w-full h-auto rounded-md mt-2 object-cover max-h-60"
                                            onError={(e) => {
                                                const img = e.target as HTMLImageElement;
                                                img.onerror = null;
                                                img.src = `https://placehold.co/400x300/E0E0E0/333333?text=No+Image`;
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <ImageDropzone onDropImage={handleDropImage} />
                                )}
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 mt-6">
                    <button
                        type="button"
                        onClick={() => router.push("/admin/ruangan")}
                        className="flex-1 h-9 justify-center items-center px-4 py-2 border rounded-md text-[#F97316] border-[#F97316] bg-white hover:bg-orange-50 font-bold text-[16px]"
                    >
                        Batal
                    </button>
                    <Button
                        type="submit"
                        className="flex-1 h-9 px-4 py-2 text-[16px] font-bold bg-orange-500 text-white shadow-xs hover:bg-orange-600 focus-visible:ring-orange-300"
                    >
                        Simpan
                    </Button>
                </div>
            </form>
        </Form>
    );
}