'use client'

import { Grid2x2Plus } from 'lucide-react' 
import React from 'react'

export default function ButtonTambahClient() {
  const handleTambah = () => {
    alert('Tambah konten masjid')
  }

  return (
    <button
      onClick={handleTambah}
      className="flex items-center gap-2 px-4 py-2 rounded-xl transition"
      style={{
        backgroundColor: 'rgba(255, 147, 87, 0.25)', 
        color: 'var(--color-custom-orange)',
      }}
    >
      <Grid2x2Plus size={18} />
      Tambah
    </button>
  )
}
