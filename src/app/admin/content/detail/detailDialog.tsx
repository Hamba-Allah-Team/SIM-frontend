"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CalendarDays, Link } from "lucide-react"
import { X } from "lucide-react"
import { DialogClose } from "@/components/ui/dialog"


type Content = {
  contents_id: number
  mosque_id: number
  title: string
  content_description: string
  image?: string
  published_date: string
  contents_type: "artikel" | "berita"
  user_id: number
  created_at: string
  updated_at: string
}

type DetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentId: number | null
}

const API = process.env.NEXT_PUBLIC_API_URL

export function DetailDialog({ open, onOpenChange, contentId }: DetailDialogProps) {
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      if (open && contentId !== null) {
        setLoading(true)
        try {
          const token = localStorage.getItem("token")
          const res = await fetch(`${API}/api/content/${contentId}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          })

          if (!res.ok) throw new Error("Gagal mengambil detail konten")

          const json = await res.json()
          setContent(json.data || null)
        } catch (error) {
          console.error("Error saat mengambil konten:", error)
          setContent(null)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchContent()
  }, [open, contentId])

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-white text-black">
        <DialogHeader>
          <DialogTitle>
            <label className="text-[28px] font-bold font-poppins text-black">Detail Konten</label>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-sm">Memuat data...</div>
        ) : content ? (
          <div className="mt-4 space-y-4">
            {/* Judul */}
            <div>
              <label className="text-[16px] font-semibold font-poppins text-black">Judul Konten</label>
              <input
                type="text"
                value={content.title}
                readOnly
                className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="text-[16px] font-semibold font-poppins text-black">Isi Konten</label>
              <textarea
                value={content.content_description}
                readOnly
                rows={4}
                className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2 resize-none"
              />
            </div>

            {/* Jenis Konten */}
            <div>
              <label className="text-[16px] font-semibold font-poppins text-black">Jenis Konten</label>
              <input
                type="text"
                value={content.contents_type}
                readOnly
                className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2 capitalize"
              />
            </div>

            {/* Tanggal Rilis */}
            <div>
              <label className="text-[16px] font-semibold font-poppins text-black">Tanggal Rilis</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  value={new Date(content.published_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  readOnly
                  className="pl-10 w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 cursor-not-allowed py-2"
                />
              </div>
            </div>

            {/* Gambar */}
            {content.image && (
              <div>
                <label className="text-[16px] font-semibold font-poppins text-black">Foto Cover Konten</label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={content.image.split("/").pop() || ""}
                    readOnly
                    className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
                  />
                  <div className="mt-2 flex justify-center">
                    <img
                      src={`${API}/uploads/${content.image}`}
                      alt={content.title}
                      className="max-w-full max-h-48 object-contain rounded border"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) 
        : (
          <div className="py-8 text-center text-sm text-red-600">Konten tidak ditemukan.</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
