"use client"

import { Grid2x2Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"

interface ButtonTambahProps {
  href: string
  label?: string
}

export default function ButtonTambah({ href, label = "Tambah" }: ButtonTambahProps) {
  const router = useRouter()

  const handleTambah = () => {
    router.push(href)
  }

  return (
    <button
      onClick={handleTambah}
      className="flex items-center gap-2 px-4 py-2 rounded-xl transition"
      style={{
        backgroundColor: "rgba(255, 147, 87, 0.25)",
        color: "var(--color-custom-orange)",
      }}
    >
      <Grid2x2Plus size={18} />
      {label}
    </button>
  )
}
