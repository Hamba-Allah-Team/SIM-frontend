"use client"

import React, { useEffect, useState } from "react"
import { CalendarDays } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
    let isMounted = true

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
          if (isMounted) {
            setContent(json.data || null)
          }
        } catch (error) {
          console.error("Error saat mengambil konten:", error)
          if (isMounted) {
            setContent(null)
          }
        } finally {
          if (isMounted) setLoading(false)
        }
      }
    }

    fetchContent()

    return () => {
      isMounted = false
    }
  }, [open, contentId])

  useEffect(() => {
    if (!open) {
      setContent(null)
      setLoading(false)
    }
  }, [open])

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
          <p className="text-gray-500 font-poppins">Memuat data...</p>
        ) : content ? (
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-[16px] font-semibold font-poppins text-black">Judul Konten</label>
              <input
                type="text"
                value={content.title}
                readOnly
                className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[16px] font-semibold font-poppins text-black">Isi Konten</label>
              <textarea
                value={content.content_description}
                readOnly
                rows={4}
                className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2 resize-none"
              />
            </div>

            <div>
              <label className="text-[16px] font-semibold font-poppins text-black">Jenis Konten</label>
              <input
                type="text"
                value={content.contents_type}
                readOnly
                className="w-full bg-gray-100 text-gray-700 rounded-md border border-gray-300 px-3 py-2 capitalize"
              />
            </div>

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
        ) : (
          <p className="text-gray-500 font-poppins">Data tidak ditemukan.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
