"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarDays, Link, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageDropzone from "@/components/imageDropZone"

import { Content } from "../../columns" // pastikan kamu punya tipe ini atau import dari file sesuai

const formSchema = z.object({
  title: z.string().min(1, { message: "Judul konten harus di isi" }),
  content_description: z.string().min(1, { message: "Deskripsi konten harus diisi" }),
  image: z.any().optional(), // bisa berupa string (URL) atau File
  published_date: z.string().min(1, { message: "Tanggal rilis konten harus diisi" }),
  contents_type: z.enum(["artikel", "berita"], { required_error: "Jenis konten harus dipilih" }),
})

type EditContentFormProps = {
  initialData: Content
}

export function EditContentForm({ initialData }: EditContentFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      content_description: initialData.content_description,
      image: initialData.image || "",
      published_date: initialData.published_date,
      contents_type: initialData.contents_type,
    },
  })

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    typeof initialData.image === "string" ? initialData.image : null
  )
  const [fileName, setFileName] = useState<string>(
    initialData.image ? initialData.image.split("/").pop() || "" : ""
  )

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Update submitted:", values)
    // Kirim PATCH ke API di sini
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
              </FormControl>
              <FormMessage />
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content Type */}
        <FormField
          control={form.control}
          name="contents_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Jenis Konten
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="bg-white w-full">
                    <SelectValue placeholder="Pilih jenis konten" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-10">
                    <SelectItem value="artikel" className="hover:bg-gray-100 aria-selected:bg-white">Artikel</SelectItem>
                    <SelectItem value="berita" className="hover:bg-gray-100 aria-selected:bg-white">Berita</SelectItem>
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
          render={({ field }) => (
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
                      className="pl-10 placeholder-black-400 text-black-700 bg-white border border-gray-300 w-full font-poppins cursor-not-allowed"
                    />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => {
            const handleDropImage = (file: File) => {
              field.onChange(file)
              setPreviewUrl(URL.createObjectURL(file))
              setFileName(file.name)
            }

            const handleDelete = () => {
              field.onChange(null)
              setPreviewUrl(null)
              setFileName("")
            }

            useEffect(() => {
              return () => {
                if (previewUrl?.startsWith("blob:")) {
                  URL.revokeObjectURL(previewUrl)
                }
              }
            }, [previewUrl])

            return (
              <FormItem>
                <FormLabel className="text-[14px] font-semibold font-poppins text-black">
                  Foto Cover Konten
                </FormLabel>
                <FormControl>
                  {previewUrl ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <Input value={fileName} readOnly className="cursor-not-allowed bg-gray-100" />
                        <button type="button" onClick={handleDelete} className="absolute right-2 top-2">
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                      <img src={previewUrl} alt="Preview" className="rounded-lg border max-h-48" />
                    </div>
                  ) : (
                    <ImageDropzone onDropImage={handleDropImage} />
                  )}
                </FormControl>
              </FormItem>
            )
          }}
        />

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/content")}
            className="flex-1 h-9 border rounded-md text-orange-500 border-orange-500 hover:bg-orange-50"
          >
            Batal
          </button>
          <Button type="submit" className="flex-1 h-9 bg-orange-500 text-white hover:bg-orange-600">
            Perbarui
          </Button>
        </div>
      </form>
    </Form>
  )
}
