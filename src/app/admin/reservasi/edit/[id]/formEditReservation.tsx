"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
    title: z.string().min(1, { message: "Judul harus diisi" }),
    name: z.string().min(1, { message: "Nama harus diisi" }),  
    phone_number: z.string().min(1, { message: "Nomor telepon harus diisi" }),
    room_id: z.coerce.number().min(1, { message: "Pilih ruangan" }),
    description: z.string().optional(),
    reservation_date: z.string().min(1, { message: "Tanggal reservasi harus diisi" }),
    start_time: z.string().min(1, { message: "Waktu mulai harus diisi" }),
    end_time: z.string().min(1, { message: "Waktu selesai harus diisi" }),
    status: z.enum(["pending", "approved", "rejected", "completed"]),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RoomField = ({ field }: any) => {
    const [dataRooms, setDataRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API}/api/rooms`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });

                if (!res.ok) throw new Error("Gagal mengambil data ruangan");

                const json = await res.json();
                setDataRooms(json.data || []);
            } catch (error) {
                console.error("Error fetching rooms:", error);
                toast.error("Gagal mengambil data ruangan", {
                    style: {
                        background: "#white",
                        color: "black",
                        border: "2px solid #ef4444",
                    },
                });
            }
        };

        fetchRooms();
    }, []);

    return (
        <FormField
            control={field.control}
            name="room_id"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-[16px] font-semibold font-poppins text-black">Ruangan</FormLabel>
                    <FormControl>
                        <Select onValueChange={field.onChange} defaultValue="" {...field}>
                            <SelectTrigger className="w-full bg-white text-black">
                                <SelectValue placeholder="Pilih Ruangan" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-black">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {dataRooms.map((room: any) => (
                                    <SelectItem key={room.room_id} value={room.room_id.toString()}>
                                        {room.place_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default function FormEditReservation() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            name: "",
            phone_number: "",
            room_id: undefined,
            description: "",
            reservation_date: "",
            start_time: "",
            end_time: "",
            status: "pending",
        },
    });

    const fetchReservationData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/api/reservations/${id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (!res.ok) throw new Error("Gagal mengambil data reservasi");

            const json = await res.json();
            form.reset({
                title: json.data.title,
                name: json.data.name,
                phone_number: json.data.phone_number,
                room_id: json.data.room_id,
                description: json.data.description,
                reservation_date: json.data.reservation_date,
                start_time: json.data.start_time,
                end_time: json.data.end_time,
                status: json.data.status,
            })
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error fetching reservation data:", error.message);
                toast.error("Terjadi kesalahan: " + error.message, {
                    style: {
                        background: "#white",
                        color: "black",
                        border: "2px solid #ef4444",
                    },
                });
            } else {
                console.error("Unexpected error:", error);
                toast.error("Gagal mengambil data reservasi", {
                    style: {
                        background: "#white",
                        color: "black",
                        border: "2px solid #ef4444",
                    },
                });
            }
        } finally {
            setLoading(false);
        }
    }, [id, form]);

    useEffect(() => {
        if (id) {
            fetchReservationData();
        }
    }, [id, fetchReservationData]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!id) return alert("ID reservasi tidak ditemukan");

        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("name", values.name);
        formData.append("phone_number", values.phone_number);
        formData.append("room_id", values.room_id.toString());
        formData.append("description", values.description || "");
        formData.append("reservation_date", values.reservation_date);
        formData.append("start_time", values.start_time);
        formData.append("end_time", values.end_time);
        formData.append("status", values.status);

        setLoading(true);
        const token = localStorage.getItem("token");
        await fetch(`${API}/api/reservations/${id}`, {
            method: "PUT",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        })
        .then(async (res) => {
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Gagal mengirim data");
            }
            return res.json();
        })
        .then(() => {
            toast.success("Berhasil memperbarui data reservasi", {
                style: {
                    background: "#white",
                    color: "black",
                    border: "2px solid #22c55e",
                },
            });
            router.push("/admin/reservasi");
        })
        .catch((error) => {
            console.error("Error updating reservation:", error);
            toast.error("Terjadi kesalahan: " + error.message, {
                style: {
                    background: "#white",
                    color: "black",
                    border: "2px solid #ef4444",
                },
            });
        })
        .finally(() => {
            setLoading(false);
        });
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
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-[16px] font-semibold font-poppins text-black">Judul Reservasi</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder={fieldState.error ? fieldState.error.message : "Judul Reservasi"} 
                                    {...field} 
                                    className={`bg-white text-black ${fieldState.error ? "border-red-500 placeholder-red-50" : "border-gray-300 placeholder-gray-400"} pr-10`}
                                    aria-invalid={fieldState.error ? "true" : "false"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                >
                </FormField>
                { /* Nama Pemesan */ }
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-[16px] font-semibold font-poppins text-black">Nama Pemesan</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder={fieldState.error ? fieldState.error.message : "Nama Pemesan"} 
                                    {...field} 
                                    className={`bg-white text-black ${fieldState.error ? "border-red-500 placeholder-red-50" : "border-gray-300 placeholder-gray-400"} pr-10`}
                                    aria-invalid={fieldState.error ? "true" : "false"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                { /* Nomor Telepon */ }
                <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-[16px] font-semibold font-poppins text-black">Nomor Telepon</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder={fieldState.error ? fieldState.error.message : "Nomor Telepon"} 
                                    {...field} 
                                    className={`bg-white text-black ${fieldState.error ? "border-red-500 placeholder-red-50" : "border-gray-300 placeholder-gray-400"} pr-10`}
                                    aria-invalid={fieldState.error ? "true" : "false"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                { /* Ruangan */ }
                <FormField 
                    control={form.control}
                    name="room_id"
                    render={({ field }) => (
                        <RoomField field={field} />
                    )}
                />

                { /* Deskripsi */ }
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-[16px] font-semibold font-poppins text-black">Deskripsi</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder={fieldState.error ? fieldState.error.message : "Deskripsi Reservasi"} 
                                    {...field} 
                                    className={`bg-white text-black ${fieldState.error ? "border-red-500 placeholder-red-50" : "border-gray-300 placeholder-gray-400"}`}
                                    aria-invalid={fieldState.error ? "true" : "false"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                { /* Tanggal Reservasi */ }
                <FormField
                    control={form.control}
                    name="reservation_date"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="text-[16px] font-semibold font-poppins text-black">Tanggal Reservasi</FormLabel>
                            <FormControl>
                                <Input 
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    placeholder={fieldState.error ? fieldState.error.message : "Tanggal Reservasi"} 
                                    {...field} 
                                    className={`bg-white text-black ${fieldState.error ? "border-red-500 placeholder-red-50" : "border-gray-300 placeholder-gray-400"} pr-10`}
                                    aria-invalid={fieldState.error ? "true" : "false"}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    { /* Waktu Mulai */ }
                    <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="text-[16px] font-semibold font-poppins text-black">Waktu Mulai</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="time"
                                        placeholder={fieldState.error ? fieldState.error.message : "Waktu Mulai"} 
                                        {...field} 
                                        className={`bg-white text-black ${fieldState.error ? "border-red-500 placeholder-red-50" : "border-gray-300 placeholder-gray-400"} pr-10`}
                                        aria-invalid={fieldState.error ? "true" : "false"}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    { /* Waktu Selesai */ }
                    <FormField
                        control={form.control}
                        name="end_time"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="text-[16px] font-semibold font-poppins text-black">Waktu Selesai</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="time"
                                        min={form.getValues("start_time")}
                                        placeholder={fieldState.error ? fieldState.error.message : "Waktu Selesai"} 
                                        {...field} 
                                        className={`bg-white text-black ${fieldState.error ? "border-red-500 placeholder-red-50" : "border-gray-300 placeholder-gray-400"} pr-10`}
                                        aria-invalid={fieldState.error ? "true" : "false"}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                { /* Status */ }
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[16px] font-semibold font-poppins text-black">Status</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                                    <SelectTrigger className="w-full bg-white text-black">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white text-black">
                                        <SelectItem value="pending">Menunggu</SelectItem>
                                        <SelectItem value="approved">Disetujui</SelectItem>
                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                        <SelectItem value="completed">Selesai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 mt-6">
                    <Button 
                        type="button" 
                        onClick={() => router.push("/admin/reservasi")} 
                        className="flex-1 h-9 px-4 py-2 justify-center items-center border rounded-md text-[16px] font-bold text-[#F97316] border-[#F97316] bg-white hover:bg-orange-50"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit" 
                        className="flex-1 h-9 px-4 py-2 text-[16px] font-bold bg-orange-500 text-white shadow-xs hover:bg-orange-600 focus-visible:ring-orange-300"
                    >
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        </Form>
    )
}