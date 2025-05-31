"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Info } from "lucide-react";
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Link, Trash2 } from "lucide-react"
import ImageDropzone from "@/components/imageDropZone"

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama masjid harus diisi" }),
  address: z.string().min(1, { message: "Alamat harus diisi" }),
  description: z.string().optional(),
  image: z.any().optional(),
  phone_whatsapp: z.string().optional(),

  email: z
  .string()
  .optional()
  .refine((val = "") => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Format email tidak valid",
  }),


  facebook: z
  .string()
  .optional()
  .refine((val = "") =>  // default ke "" supaya val pasti string
    val === "" || (val.startsWith("https://www.facebook.com") && z.string().url().safeParse(val).success),
    {
      message: "Link Facebook harus diawali dengan https://www.facebook.com dan format URL valid",
    }
  ),


  instagram: z
  .string()
  .optional()
  .refine((val = "") =>
    val === "" || (val.startsWith("https://www.instagram.com") && z.string().url().safeParse(val).success),
    {
      message: "Link Instagram harus diawali dengan https://www.instagram.com dan format URL valid",
    }
  ),


  latitude: z
    .number()
    .min(-90, { message: "Latitude harus >= -90" })
    .max(90, { message: "Latitude harus <= 90" })
    .optional(),

  longitude: z
    .number()
    .min(-180, { message: "Longitude harus >= -180" })
    .max(180, { message: "Longitude harus <= 180" })
    .optional(),

  })


export type AboutFormValues = z.infer<typeof formSchema>

const API = process.env.NEXT_PUBLIC_API_URL

export function EditAboutForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleteImage, setDeleteImage] = useState(false)
  const router = useRouter()

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      image: "",
      phone_whatsapp: "",
      email: "",
      facebook: "",
      instagram: "",
      latitude: undefined,
      longitude: undefined,
    },
  })

  const [imageDeleted, setImageDeleted] = useState(false)

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

        if (data.image) {
        setPreviewUrl(`${API}/uploads/${data.image}`)
        const urlParts = data.image.split("/")
        setFileName(urlParts[urlParts.length - 1])
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

    // Handle drop image, update form field and preview
    const handleDropImage = (file: File) => {
      form.setValue("image", file)
      setPreviewUrl(URL.createObjectURL(file))
      setFileName(file.name)
    }
  
    // Handle delete image preview dan reset field
    const handleDelete = () => {
      form.setValue("image", null)
      setPreviewUrl(null)
      setFileName("")
      setDeleteImage(true)
    }
  
    // Cleanup preview URL ketika komponen unmount atau previewUrl berubah
    useEffect(() => {
      return () => {
        if (previewUrl && previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
      }
    }, [previewUrl])

  async function onSubmitForm(values: AboutFormValues) {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("address", values.address)
      formData.append("description", values.description || "")
      formData.append("phone_whatsapp", values.phone_whatsapp || "")
      formData.append("email", values.email || "")
      formData.append("facebook", values.facebook || "")
      formData.append("instagram", values.instagram || "")
      formData.append("latitude", values.latitude !== undefined ? values.latitude.toString() : "")
      formData.append("longitude", values.longitude !== undefined ? values.longitude.toString() : "")


      if (deleteImage) {
        formData.append("deleteImage", "true")
      }

      if (values.image && typeof values.image !== "string") {
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
        let errorText = ""
        try {
          // Coba parse response body sebagai JSON dulu
          const errorData = await res.json()
          errorText = JSON.stringify(errorData)
        } catch {
          // Kalau gagal parse JSON, fallback ke text biasa
          errorText = await res.text()
        }
        console.error("Gagal update:", errorText)
        alert(`Gagal memperbarui data masjid. Error: ${errorText}`)
        return
      }

      toast.success("Informasi Masjid berhasil diubah", {
                style: {
                  background: "white",
                  color: "black",
                  border: "2px solid #22c55e", // border hijau
                },
              });
      router.refresh()
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan:", error)
      alert(`Terjadi kesalahan saat menyimpan: ${error}`)
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
              <div className="bg-white text-black mt-1">
                <FormMessage />
              </div>
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
              <div className="bg-white text-black mt-1">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black ">
                Deskripsi
              </FormLabel>
              <FormControl><Textarea 
                placeholder={fieldState.error ? fieldState.error.message : "Deskripsi tentang masjid di sini"}
              {...field} 
                className={`bg-white text-black ${
                    fieldState.error ? "border border-red-500 placeholder-red-600" : "border border-gray-300 placeholder-gray-400"
                  } pr-10`}
                  aria-invalid={fieldState.error ? "true" : "false"}
              /></FormControl>
              <div className="bg-white text-black mt-1">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_whatsapp"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black ">
                Nomor WhatsApp Masjid
              </FormLabel>
              <FormControl><Input 
                placeholder={fieldState.error ? fieldState.error.message : "Nomor handphone di sini"}
              {...field} 
                className={`bg-white text-black ${
                    fieldState.error ? "border border-red-500 placeholder-red-600" : "border border-gray-300 placeholder-gray-400"
                  } pr-10`}
                  aria-invalid={fieldState.error ? "true" : "false"}
              /></FormControl>
              <div className="bg-white text-black mt-1">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black ">
                Email Masjid
              </FormLabel>
              <FormControl><Input 
                placeholder={fieldState.error ? fieldState.error.message : "Email Masjid di sini"}
              {...field} 
                className={`bg-white text-black ${
                    fieldState.error ? "border border-red-500 placeholder-red-600" : "border border-gray-300 placeholder-gray-400"
                  } pr-10`}
                  aria-invalid={fieldState.error ? "true" : "false"}
              /></FormControl>
              <div className="bg-white text-black mt-1">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebook"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Facebook Masjid
              </FormLabel>
              <FormControl>
                <div
                  className={`flex items-center rounded-md bg-white border pr-2 ${
                    fieldState.error
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <span className="px-3 text-gray-500 whitespace-nowrap border-r">
                    https://
                  </span>
                  <Input
                    {...field}
                    placeholder={
                      fieldState.error
                        ? fieldState.error.message
                        : "https://www.facebook.com/masjidcontoh"
                    }
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-black placeholder-gray-400"
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
                </div>
              </FormControl>
              <div className="bg-white text-black mt-1">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                Instagram Masjid
              </FormLabel>
              <FormControl>
                <div
                  className={`flex items-center rounded-md bg-white border pr-2 ${
                    fieldState.error
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <span className="px-3 text-gray-500 whitespace-nowrap border-r">
                    https://
                  </span>
                  <Input
                    {...field}
                    placeholder={
                      fieldState.error
                        ? fieldState.error.message
                        : "contoh : https://www.instagram.com/masjidcontoh"
                    }
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-black placeholder-gray-400"
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
                </div>
              </FormControl>
              <div className="bg-white text-black mt-1">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <TooltipProvider>
          <FormField
            control={form.control}
            name="latitude"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                    Latitude Masjid
                  </FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer text-black" />
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right"
                      sideOffset={8}
                      className="max-w-xs bg-white text-black whitespace-pre-line">
                        <p>
                          Garis Lintang
                          <br />
                          Cara menemukan: Buka <strong>Google Maps</strong>, klik kanan di lokasi masjid,
                          pilih <strong>"What's here?"</strong>.
                          <br />
                          Misalnya muncul koordinat: <span>-7.982085, 112.630348</span> → Maka latitude-nya
                          adalah <strong>-7.982085</strong>.
                        </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    placeholder={
                      fieldState.error
                        ? fieldState.error.message
                        : "Contoh : -7.982085"
                    }
                    {...field}
                    className={`bg-white text-black ${
                      fieldState.error
                        ? "border border-red-500 placeholder-red-600"
                        : "border border-gray-300 placeholder-gray-400"
                    } pr-10`}
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
                </FormControl>
                <div className="bg-white text-black mt-1">
                <FormMessage />
              </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-[16px] font-semibold font-poppins text-black">
                    Longitude Masjid
                  </FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer text-black" />
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right"
                      sideOffset={8}
                      className="max-w-xs bg-white text-black whitespace-pre-line">
                        <p>
                          Garis Bujur
                          <br />
                          Cara menemukan: Buka <strong>Google Maps</strong>, klik kanan di lokasi masjid,
                          pilih <strong>"What's here?"</strong>.
                          <br />
                          Misalnya muncul koordinat: <span>-7.982085, 112.630348</span> → Maka longtitude-nya
                          adalah <strong>112.630348</strong>.
                        </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input
                    placeholder={
                      fieldState.error
                        ? fieldState.error.message
                        : "Contoh : 112.630348"
                    }
                    {...field}
                    className={`bg-white text-black ${
                      fieldState.error
                        ? "border border-red-500 placeholder-red-600"
                        : "border border-gray-300 placeholder-gray-400"
                    } pr-10`}
                    aria-invalid={fieldState.error ? "true" : "false"}
                  />
                </FormControl>
                <div className="bg-white text-black mt-1">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </TooltipProvider>

        
                {/* Image */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[16px] font-semibold font-poppins text-black ">
                        Foto Cover Konten
                      </FormLabel>
                      <FormControl>
                        {previewUrl ? (
                          <div className="flex flex-col gap-3">
                            <div className="relative w-full">
                              <input
                                type="text"
                                value={fileName}
                                readOnly
                                placeholder="Nama foto"
                                className="w-full border rounded-md py-2 pl-9 pr-9 text-sm bg-gray-100 cursor-not-allowed text-gray-600 "
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
