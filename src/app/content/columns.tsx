"use client"

import { ColumnDef } from "@tanstack/react-table"

// Define the shape of the data
export type Content = {
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

// Define the table columns
export const columns: ColumnDef<Content>[] = [
  {
    accessorKey: "title",
    header: "Judul Konten",
  },
  {
    accessorKey: "contents_type",
    header: "Jenis Konten",
  },
  {
    accessorKey: "published_date",
    header: "Tanggal Rilis",
  },
  {
    id: "actions",  // kolom custom harus punya id unik
    header: "Aksi",
    cell: ({ row }) => {
      const content = row.original

      return (
        <div className="flex gap-2">
          <button
            className="btn-view flex items-center gap-1"
            onClick={() => alert(`View konten ID: ${content.contents_id}`)}
          >
            <img src="/icon/more-circle.png" alt="view Icon" className="w-4 h-4" />
            View
          </button>
          <button
            className="btn-edit flex items-center gap-1"
            onClick={() => alert(`Edit konten ID: ${content.contents_id}`)}
          >
            <img src="/icon/edit-2.png" alt="Edit Icon" className="w-4 h-4" />
            Edit
          </button>
          <button
            className="btn-delete flex items-center gap-1"
            onClick={() => alert(`Hapus konten ID: ${content.contents_id}`)}
          >
            <img src="/icon/trash.png" alt="delete Icon" className="w-4 h-4" />
            Hapus
          </button>
        </div>
      )
    },
  },
]
