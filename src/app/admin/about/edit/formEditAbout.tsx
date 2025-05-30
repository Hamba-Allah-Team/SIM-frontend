"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama masjid harus diisi" }),
  address: z.string().min(1, { message: "Alamat harus diisi" }),
  description: z.string().optional(),
  image: z.any().optional(),
  phone_whatsapp: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  facebook: z.string().url("Link Facebook tidak valid").optional().or(z.literal("")),
  instagram: z.string().url("Link Instagram tidak valid").optional().or(z.literal("")),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

export type AboutFormValues = z.infer<typeof formSchema>

const API = process.env.NEXT_PUBLIC_API_URL

export function EditAboutForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      image: undefined,
      phone_whatsapp: "",
      email: "",
      facebook: "",
      instagram: "",
      latitude: "",
      longitude: "",
    },
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const res = await fetch(`${API}/api/about`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        })

        if (!res.ok) throw new Error("Gagal memuat data")

        const result = await res.json()
        const data = result.data

        form.reset({
          name: data.name || "",
          address: data.address || "",
          description: data.description || "",
          phone_whatsapp: data.phone_whatsapp || "",
          email: data.email || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
        })

        if (data.image_url) {
          setPreviewUrl(data.image_url) // gambar dari server
        }
      } catch (error) {
        console.error("Gagal mengambil data masjid:", error)
        alert("Gagal mengambil data masjid.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [form])

  async function onSubmitForm(values: AboutFormValues) {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("address", values.address)
      if (values.description) formData.append("description", values.description)
      if (values.phone_whatsapp) formData.append("phone_whatsapp", values.phone_whatsapp)
      if (values.email) formData.append("email", values.email)
      if (values.facebook) formData.append("facebook", values.facebook)
      if (values.instagram) formData.append("instagram", values.instagram)
      if (values.latitude) formData.append("latitude", values.latitude)
      if (values.longitude) formData.append("longitude", values.longitude)
      if (values.image && values.image instanceof File) {
        formData.append("image", values.image)
      }

      const token = localStorage.getItem("token")

      const res = await fetch(`${API}/api/about`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Gagal update:", errorData)
        alert("Gagal memperbarui data masjid.")
        return
      }

      alert("Data berhasil diperbarui!")
      router.refresh()
    } catch (error) {
      console.error("Terjadi kesalahan:", error)
      alert("Terjadi kesalahan saat menyimpan.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Memuat data masjid...</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">

        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black ">
                Nama Masjid
              </FormLabel>
              <FormControl><Input 
              placeholder={fieldState.error ? fieldState.error.message : "Nama masjid di sini"}
              {...field} 
              className={`bg-white text-black ${
                    fieldState.error ? "border border-red-500 placeholder-red-600" : "border border-gray-300 placeholder-gray-400"
                  } pr-10`}
                  aria-invalid={fieldState.error ? "true" : "false"}
              /></FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black ">
                Alamat Masjid
              </FormLabel>
              <FormControl><Textarea 
                placeholder={fieldState.error ? fieldState.error.message : "Alamat masjid di sini"}
              {...field} 
                className={`bg-white text-black ${
                    fieldState.error ? "border border-red-500 placeholder-red-600" : "border border-gray-300 placeholder-gray-400"
                  } pr-10`}
                  aria-invalid={fieldState.error ? "true" : "false"}
              /></FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Gambar Masjid</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  form.setValue("image", file)
                  const reader = new FileReader()
                  reader.onloadend = () => {
                    setPreviewUrl(reader.result as string)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
          </FormControl>
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 max-h-40 rounded" />
          )}
        </FormItem>

        <FormField
          control={form.control}
          name="phone_whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor WhatsApp</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Facebook</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Instagram</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 h-9 border rounded-md text-orange-500 border-orange-500 hover:bg-orange-50"
          >
            Batal
          </button>
          <Button type="submit" className="flex-1 h-9 bg-orange-500 text-white hover:bg-orange-600">
            Simpan
          </Button>
        </div>
      </form>
    </Form>
  )
}
