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
              <FormLabel>Judul Konten</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Judul konten"
                  className={fieldState.error ? "border-red-500" : ""}
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
              <FormLabel>Isi Konten</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Penjelasan tentang konten"
                  className={fieldState.error ? "border-red-500" : ""}
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
              <FormLabel>Jenis Konten</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis konten" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="artikel">Artikel</SelectItem>
                    <SelectItem value="berita">Berita</SelectItem>
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
              <FormLabel>Tanggal Rilis</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  readOnly
                  className="cursor-not-allowed"
                />
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
                <FormLabel>Foto Cover Konten</FormLabel>
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
