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

type ApproveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reservationId: number) => Promise<void>; // ubah jadi async agar bisa await
  reservationId: number;
};

export function ApproveDialog({
  open,
  onOpenChange,
  onConfirm,
  reservationId,
}: ApproveDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm(reservationId);
      toast.success("Reservasi berhasil disetujui", {
        style: {
          background: "white",
          color: "black",
          border: "2px solid #22c55e",
        },
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Gagal menyetujui reservasi: " + error.message, {
        style: {
          background: "white",
          color: "black",
          border: "2px solid #ef4444",
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
            Apakah Anda Berniat Menyetujui Reservasi Ini?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-700">
            Tindakan ini akan menyetujui reservasi dan mengubah statusnya. Apakah Anda masih ingin melanjutkan?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-[#F97316] border-[#F97316] bg-white hover:bg-orange-50">
            Batal
          </Button>
          <Button className="bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-300" onClick={handleConfirm}>
            Setujui
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}