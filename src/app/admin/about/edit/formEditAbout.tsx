"use client"

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
  image: z.any().optional(), // bisa File atau URL
  phone_whatsapp: z.string().optional(),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  facebook: z.string().url("Link Facebook tidak valid").optional().or(z.literal("")),
  instagram: z.string().url("Link Instagram tidak valid").optional().or(z.literal("")),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

export type AboutFormValues = z.infer<typeof formSchema>

type EditAboutFormProps = {
  initialData: AboutFormValues & { mosque_id: number }
  onSubmitForm: (values: AboutFormValues) => void
}

export function EditAboutForm({ initialData, onSubmitForm }: EditAboutFormProps) {
  const form = useForm<AboutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const router = useRouter()

  function onSubmit(values: AboutFormValues) {
    onSubmitForm(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Nama Masjid */}
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Nama Masjid</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={fieldState.error?.message || "Masukkan nama masjid"}
                  className={fieldState.error ? "border border-red-500 placeholder-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alamat */}
        <FormField
          control={form.control}
          name="address"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={fieldState.error?.message || "Masukkan alamat lengkap"}
                  className={fieldState.error ? "border border-red-500 placeholder-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Deskripsi */}
        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={fieldState.error?.message || "Deskripsi (opsional)"}
                  className={fieldState.error ? "border border-red-500 placeholder-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={fieldState.error?.message || "Email (opsional)"}
                  className={fieldState.error ? "border border-red-500 placeholder-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* No WhatsApp */}
        <FormField
          control={form.control}
          name="phone_whatsapp"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>No. WhatsApp</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={fieldState.error?.message || "08xxxxx (opsional)"}
                  className={fieldState.error ? "border border-red-500 placeholder-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Facebook */}
        <FormField
          control={form.control}
          name="facebook"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={fieldState.error?.message || "Link Facebook (opsional)"}
                  className={fieldState.error ? "border border-red-500 placeholder-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instagram */}
        <FormField
          control={form.control}
          name="instagram"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={fieldState.error?.message || "Link Instagram (opsional)"}
                  className={fieldState.error ? "border border-red-500 placeholder-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Latitude */}
        <FormField
          control={form.control}
          name="latitude"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Latitude</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={fieldState.error?.message || "Latitude (opsional)"}
                  className={fieldState.error ? "border border-red-500 placeholder-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Longitude */}
        <FormField
          control={form.control}
          name="longitude"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Longitude</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={fieldState.error?.message || "Longitude (opsional)"}
                  className={fieldState.error ? "border border-red-500 placeholder-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gambar (File) */}
        <FormField
          control={form.control}
          name="image"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Gambar</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                  className={fieldState.error ? "border border-red-500" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tombol Aksi */}
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
