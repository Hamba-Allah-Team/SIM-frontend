"use client"

import React from "react"
import { Button } from "@/components/ui/button"

type DeleteDialogProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export function DeleteDialog({ isOpen, onClose, onConfirm, title }: DeleteDialogProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
        <p className="mb-6">Apakah Anda yakin ingin menghapus konten &quot;{title}&quot;?</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onClose() }}>
            Hapus
          </Button>
        </div>
      </div>
    </div>
  )
}
