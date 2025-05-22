"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  content: Content | null
}

export function DetailDialog({ open, onOpenChange, content }: DetailDialogProps) {
  if (!content) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detail Konten</DialogTitle>
          <DialogDescription>
            Informasi lengkap dari konten yang dipilih
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 text-sm text-black">
          <div>
            <strong>Judul:</strong> {content.title}
          </div>
          <div>
            <strong>Jenis Konten:</strong> {content.contents_type}
          </div>
          <div>
            <strong>Tanggal Rilis:</strong> {content.published_date}
          </div>
          <div>
            <strong>Deskripsi:</strong>
            <p className="whitespace-pre-wrap mt-1">{content.content_description}</p>
          </div>
          {content.image && (
            <div>
              <strong>Gambar:</strong>
              <img src={content.image} alt={content.title} className="mt-2 max-w-full rounded" />
            </div>
          )}
          <div>
            <strong>Dibuat Pada:</strong> {content.created_at}
          </div>
          <div>
            <strong>Diperbarui Pada:</strong> {content.updated_at}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
