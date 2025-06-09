"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
    name: z.string().min(1, { message: "Nama harus diisi" }),
    phone_number: z.string().min(1, { message: "Nomor telepon harus diisi" }),
    room_id: z.coerce.number().min(1, { message: "Ruangan harus diisi" }),
    description: z.string().min(1, { message: "Deskripsi harus diisi" }),
    reservation_date: z.string().min(1, { message: "Tanggal harus diisi" }),
    start_time: z.string().min(1, { message: "Waktu mulai harus diisi" }),
    end_time: z.string().min(1, { message: "Waktu selesai harus diisi" }),
    status: z.enum(["pending", "approved", "rejected", "completed"], { required_error: "Status harus diisi" }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RoomField = ({ field } : any) => {
    const [dataRooms, setDataRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API}/api/rooms`, {
                    headers: {
                        Authorization: `Bearer ${token || ""}`,
                    },
                });

                if (!res.ok) throw new Error("Gagal mengambil data ruangan");

                const json = await res.json();
                setDataRooms(json.data || []);
            
            } catch (error) {
                console.error("Error fetching rooms:", error);
                toast.error("Gagal mengambil data ruangan: " + (error as Error).message, {
                    style: {
                        background: "white",
                        color: "black",
                        border: "2px solid #ef4444",
                    },
                });
            }
        };
        fetchRooms();
    }, []);

    return (
        <FormItem>
            <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Pilih Ruangan
            </FormLabel>
            <FormControl>
                <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                    <SelectTrigger className="w-full bg-white text-black">
                        <SelectValue placeholder="Pilih Ruangan" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {dataRooms.map((room: any) => (
                            <SelectItem key={room.room_id} value={room.room_id.toString()} className="hover:bg-gray-100 aria-selected:bg-white">
                                {room.place_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormControl>
            <FormMessage />
        </FormItem>
    );
}

export function FormCreateReservation() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone_number: "",
      room_id: undefined,
      description: "",
      reservation_date: "",
      start_time: "",
      end_time: "",
      status: "pending",
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone_number", values.phone_number);
      formData.append("room_id", values.room_id.toString());
      formData.append("description", values.description);
      formData.append("reservation_date", values.reservation_date);
      formData.append("start_time", values.start_time);
      formData.append("end_time", values.end_time);
      formData.append("status", values.status);

      const token = localStorage.getItem("token");

      fetch(`${API}/api/reservations`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`, // pakai token jika ada
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
          toast.success("Reservasi berhasil ditambah", {
            style: {
              background: "white",
              color: "black",
              border: "2px solid #22c55e",
            },
          });
          router.push("/admin/reservasi");
        })
        .catch((err) => {
          console.error("Error submit:", err);
          toast.error("Gagal menyimpan reservasi: " + err.message, {
            style: {
              background: "#white", 
              color: "black",
              border: "2px solid #ef4444"
            },
          });
        });
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Reservator Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Nama Pemesan
              </FormLabel>
              <FormControl>
                  <Input
                    placeholder={fieldState.error ? fieldState.error.message : "Isi Nama Pemesan"}
                    {...field}
                    className={`
                      bg-white
                      text-black
                      ${ fieldState.error 
                        ? "border-red-500 placeholder-red-50" 
                        : "border-gray-300 placeholder-gray-400" 
                      }
                      pr-10
                    `}
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Nomor Telepon
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={fieldState.error ? fieldState.error.message : "Isi Nomor Telepon"}
                  {...field}
                  className={`
                    bg-white
                    text-black
                    ${ fieldState.error 
                      ? "border-red-500 placeholder-red-50" 
                      : "border-gray-300 placeholder-gray-400" 
                    }
                  `}
                  aria-invalid={fieldState.error ? "true" : "false"}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Room Selection */}
        <FormField
          control={form.control}
          name="room_id"
          render={({ field }) => (
            <RoomField field={field} />
          )}
        />

        { /* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Deskripsi Reservasi
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={fieldState.error ? fieldState.error.message : "Isi Deskripsi Reservasi"}
                  {...field}
                  className={`
                    bg-white
                    text-black
                    ${ fieldState.error 
                      ? "border-red-500 placeholder-red-50" 
                      : "border-gray-300 placeholder-gray-400" 
                    }
                  `}
                  aria-invalid={fieldState.error ? "true" : "false"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reservation Date */}
        <FormField
          control={form.control}
          name="reservation_date"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Tanggal Reservasi
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  placeholder={fieldState.error ? fieldState.error.message : "Pilih Tanggal Reservasi"}
                  {...field}
                  className={`
                    bg-white
                    text-black
                    ${ fieldState.error 
                      ? "border-red-500 placeholder-red-50" 
                      : "border-gray-300 placeholder-gray-400" 
                    }
                  `}
                  aria-invalid={fieldState.error ? "true" : "false"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          { /* Start Time */}
          <FormField
            control={form.control}
            name="start_time"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                  Waktu Mulai
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    placeholder={fieldState.error ? fieldState.error.message : "Pilih Waktu Mulai"}
                    {...field}
                    className={`
                      bg-white
                      text-black
                      ${ fieldState.error 
                        ? "border-red-500 placeholder-red-50" 
                        : "border-gray-300 placeholder-gray-400" 
                      }
                    `}
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            { /* End Time */}
            <FormField
                control={form.control}
                name="end_time"
                render={({ field, fieldState }) => (
                    <FormItem>
                    <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                        Waktu Selesai
                    </FormLabel>
                    <FormControl>
                        <Input
                        type="time"
                        min={form.getValues("start_time")}
                        placeholder={fieldState.error ? fieldState.error.message : "Pilih Waktu Selesai"}
                        {...field}
                        className={`
                            bg-white
                            text-black
                            ${ fieldState.error 
                            ? "border-red-500 placeholder-red-50" 
                            : "border-gray-300 placeholder-gray-400" 
                            }
                        `}
                        aria-invalid={fieldState.error ? "true" : "false"}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/reservasi")}
            className="flex-1 h-9 justify-center items-center px-4 py-2 border rounded-md text-[16px] font-bold text-[#F97316] border-[#F97316] bg-white hover:bg-orange-50"
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