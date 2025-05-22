"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarDays, Link, Trash2} from 'lucide-react';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageDropzone from "@/components/imageDropZone";
import React from "react";
import router from "next/router";

const formSchema = z.object({
  title: z.string().min(1, { message: "Judul konten harus di isi" }),
  content_description: z.string().min(1, { message: "Deskripsi konten harus diisi" }),
  image: z.string().optional(),
  published_date: z.string().min(1, { message: "Tanggal rilis konten harus diisi" }),
  contents_type: z.enum(["artikel", "berita"], { required_error: "Jenis konten harus dipilih" }),
})

export function ContentForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content_description: "",
      image: "",
      published_date: "",
      contents_type: "artikel",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values)
    // Lakukan POST ke backend-mu di sini
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Judul Konten
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder={fieldState.error ? fieldState.error.message : "Judul konten di sini"}
                    {...field}
                    className={`
                      bg-white 
                      text-black 
                      ${fieldState.error 
                        ? "border border-red-500 placeholder-red-600" 
                        : "border border-gray-300 placeholder-gray-400"}
                      pr-10
                    `}
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="content_description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Isi Konten
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder={fieldState.error ? fieldState.error.message : "Penjelasan tentang konten di sini"}
                    {...field}
                    className={`
                      bg-white 
                      text-black 
                      ${fieldState.error 
                        ? "border border-red-500 placeholder-red-600" 
                        : "border border-gray-300 placeholder-gray-400"}
                      pr-10
                    `}
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />


        {/* Content Type */}
        <FormField
          control={form.control}
          name="contents_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black ">
                Jenis Konten
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-white text-black">
                    <SelectValue placeholder="Pilih jenis konten" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="artikel" className="hover:bg-gray-100 aria-selected:bg-white  ">Artikel</SelectItem>
                    <SelectItem value="berita" className="hover:bg-gray-100 aria-selected:bg-white ">Berita</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Published Date */}
        <FormField
          control={form.control}
          name="published_date"
          render={({ field }) => {
            // pastikan kalau field.value kosong, set dulu ke default date
            React.useEffect(() => {
              if (!field.value) {
                field.onChange(new Date().toISOString().slice(0, 10));
              }
            }, [field]);

            return (
              <FormItem>
                <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                  Tanggal Rilis
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                      <CalendarDays className="h-5 w-5 text-black" />
                    </span>
                    <Input
                      type="date"
                      {...field}
                      readOnly
                      className="pl-10 placeholder-black text-black bg-white border border-gray-300 w-full font-poppins cursor-not-allowed"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Image (opsional) */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => {
            const [previewUrl, setPreviewUrl] = useState<string | null>(null);
            const [fileName, setFileName] = useState("");

            const handleDropImage = (file: File) => {
              field.onChange(file); // simpan file asli ke form state
              setPreviewUrl(URL.createObjectURL(file)); // buat preview URL di UI saja
              setFileName(file.name);
            };

            const handleDelete = () => {
              field.onChange(null); // reset react-hook-form field
              setPreviewUrl(null);
              setFileName("");
            };

            useEffect(() => {
              return () => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
              };
            }, [previewUrl]);

            return (
              <FormItem>
                <FormLabel className="text-[14px] font-semibold font-poppins text-black">
                  Foto Cover Konten
                </FormLabel>
                <FormControl>
                  {previewUrl ? (
                    <div className="flex flex-col gap-3">
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={typeof fileName === "string" ? fileName : ""}
                          readOnly
                          placeholder="Nama foto"
                          className="w-full border rounded-md py-2 pl-9 pr-9 text-sm bg-gray-100 cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={handleDelete}
                          aria-label="Hapus foto"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <Link className="w-5 h-5" />
                        </div>
                      </div>

                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="rounded-lg border max-h-48 object-contain"
                      />
                    </div>
                  ) : (
                    <ImageDropzone onDropImage={handleDropImage} />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/content")}
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
  )
}
