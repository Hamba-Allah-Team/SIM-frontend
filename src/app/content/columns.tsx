"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil,  CircleEllipsis, ArrowUpDown} from 'lucide-react';

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
    cell: ({ row }) => (
      <div
        className="truncate overflow-hidden whitespace-nowrap max-w-[120px] sm:max-w-[200px] lg:max-w-[300px]"
        title={row.getValue("title")}
      >
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "contents_type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Jenis Konten
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "published_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Tanggal Rilis
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
            <CircleEllipsis className="w-4 h-4" />
            View
          </button>
          <button
            className="btn-edit flex items-center gap-1"
            onClick={() => alert(`Edit konten ID: ${content.contents_id}`)}
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            className="btn-delete flex items-center gap-1"
            onClick={() => alert(`Hapus konten ID: ${content.contents_id}`)}
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      )
    },
  },
]
