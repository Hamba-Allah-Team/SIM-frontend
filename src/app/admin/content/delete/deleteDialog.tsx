"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type DeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>; // ubah jadi async agar bisa await
  contents_id: string;
};

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  contents_id,
}: DeleteDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm(contents_id);
      toast.success("Konten berhasil dihapus", {
        style: {
            background: "white",
            color: "black",
            border: "2px solid #22c55e"
        },
      });
    } catch (error: any) {
      toast.error("Gagal menghapus konten: " + error.message, {
        style: {
            background: "#white", 
            color: "black",
            border: "2px solid #ef4444"
        },
      });
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">
            Apakah Anda Berniat Menghapus Konten Ini?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-700">
            Tindakan ini dapat menyebabkan data yang dihapus tidak dapat
            dikembalikan kembali. Apakah Anda masih ingin melanjutkan?
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
            onClick={handleConfirm}
            className="bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-300"
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
