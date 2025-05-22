// components/EditAboutForm.tsx
"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
  image: z.any().optional(), // bisa berupa string (URL) atau File
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
    defaultValues: {
      name: initialData.name,
      address: initialData.address,
      description: initialData.description,
      email: initialData.email,
      phone_whatsapp: initialData.phone_whatsapp,
    },
  })

  const router = useRouter()

  function onSubmit(values: AboutFormValues) {
    onSubmitForm(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Masjid</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Masukkan nama masjid" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Alamat lengkap" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Deskripsi (opsional)" />
              </FormControl>
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
              <FormControl>
                <Input {...field} placeholder="Email (opsional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. WhatsApp</FormLabel>
              <FormControl>
                <Input {...field} placeholder="08xxxxx (opsional)" />
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
