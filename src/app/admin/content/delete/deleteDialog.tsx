"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

type DeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteDialog({ open, onOpenChange, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">
            Apakah Anda Berniat Menghapus Konten Ini?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-700">
            Tindakan ini dapat menyebabkan data yang dihapus tidak dapat dikembalikan kembali. Apakah Anda masih ingin melanjutkan?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="text-[#F97316] border-[#F97316] bg-white hover:bg-orange-50"
          >
            Batal
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-300"
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
