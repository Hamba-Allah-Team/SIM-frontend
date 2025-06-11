/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Judul harus diisi"),
  name: z.string().min(1, "Nama harus diisi"),
  phone_number: z.string().min(1, "Nomor telepon harus diisi"),
  reservation_date: z.string().min(1, "Tanggal reservasi harus diisi"),
  start_time: z.string().min(1, "Waktu mulai harus diisi"),
  end_time: z.string().min(1, "Waktu selesai harus diisi"),
  description: z.string().optional(),
});

type CreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room_id: number;
  slug: string;
  onReservationSuccess?: () => void;
};

export default function CreateDialog({
  open,
  onOpenChange,
  slug,
  room_id,
  onReservationSuccess,
}: CreateDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      name: "",
      phone_number: "",
      reservation_date: "",
      start_time: "",
      end_time: "",
      description: "",
    },
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!room_id) {
      toast.error("ID Ruangan tidak ditemukan. Gagal membuat reservasi.");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("name", values.name);
    formData.append("phone_number", values.phone_number);
    formData.append("reservation_date", values.reservation_date);
    formData.append("start_time", values.start_time);
    formData.append("end_time", values.end_time);
    formData.append("description", values.description || "");

    try {
        const payload = {
            ...values,
            room_id: room_id,
            slug: slug,
        };
      const response = await fetch(`${API}/api/reservations/guest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat reservasi");
      }

      toast.success("Reservasi Anda telah berhasil diajukan!");
      onOpenChange(false); // Tutup dialog
      form.reset(); // Reset form setelah berhasil
      if (onReservationSuccess) {
        onReservationSuccess(); // Trigger refresh data di halaman induk
      }
    } catch (error: any) {
      toast.error("Terjadi Kesalahan: " + error.message);
    }
  }

  // Fungsi untuk menutup dialog dan mereset form
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white text-black">
        <DialogHeader>
          <DialogTitle>Reservasi Ruangan</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Silakan isi data di bawah ini untuk mengajukan permohonan reservasi.
          </DialogDescription>
        </DialogHeader>

        {/* 4. Bungkus form dengan komponen <Form> dari shadcn */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Judul Reservasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        fieldState.error
                          ? fieldState.error.message
                          : `cth: Rapat Koordinasi`
                      }
                      {...field}
                      className={`
                        bg-white
                        text-black
                        ${
                          fieldState.error
                            ? "border-red-500 placeholder-red-50"
                            : "border-gray-300 placeholder-gray-400"
                        }
                        `}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nama Pemesan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        fieldState.error
                          ? fieldState.error.message
                          : "Nama lengkap Anda"
                      }
                      {...field}
                      className={`
                        bg-white
                        text-black
                        ${
                          fieldState.error
                            ? "border-red-500 placeholder-red-50"
                            : "border-gray-300 placeholder-gray-400"
                        }
                        `}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        fieldState.error
                          ? fieldState.error.message
                          : "08123456789 atau +628123456789"
                      }
                      {...field}
                      className={`
                        bg-white
                        text-black
                        ${
                          fieldState.error
                            ? "border-red-500 placeholder-red-50"
                            : "border-gray-300 placeholder-gray-400"
                        }
                        `}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="cth: Membutuhkan proyektor dan papan tulis."
                      {...field}
                      className={`
                        bg-white
                        text-black
                        ${
                          fieldState.error
                            ? "border-red-500 placeholder-red-50"
                            : "border-gray-300 placeholder-gray-400"
                        }
                        `}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reservation_date"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Tanggal Reservasi</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...field}
                      className={`
                        bg-white
                        text-black
                        ${
                          fieldState.error
                            ? "border-red-500 placeholder-red-50"
                            : "border-gray-300 placeholder-gray-400"
                        }
                        `}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Waktu Mulai</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className={`
                          bg-white
                          text-black
                          ${
                            fieldState.error
                              ? "border-red-500 placeholder-red-50"
                              : "border-gray-300 placeholder-gray-400"
                          }
                          `}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Waktu Selesai</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        min={form.watch("start_time")}
                        {...field}
                        className={`
                          bg-white
                          text-black
                          ${
                            fieldState.error
                              ? "border-red-500 placeholder-red-50"
                              : "border-gray-300 placeholder-gray-400"
                          }
                          `}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Ajukan Reservasi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
