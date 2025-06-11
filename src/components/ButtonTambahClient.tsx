"use client"

import { ListPlus } from "lucide-react"
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
      className="flex items-center gap-2 bg-[#FF8A4C] hover:bg-[#ff7a38] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-70"
      // style={{
      //   backgroundColor: "rgba(255, 147, 87, 0.25)",
      //   color: "var(--color-custom-orange)",
      // }}
    >
      <ListPlus size={18} />
      {label}
    </button>
  )
}
