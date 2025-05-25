"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Content = {
  contents_id: number;
  mosque_id: number;
  title: string;
  content_description: string;
  image?: string;
  published_date: string;
  contents_type: "artikel" | "berita";
  user_id: number;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<Content>[] = [
  {
    accessorKey: "title",
    header: "Judul Konten",
    cell: ({ row }) => (
      <div
        className="truncate overflow-hidden whitespace-nowrap w-[200px] sm:w-[300px] lg:w-[400px]"
        title={row.getValue("title")}
      >
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "contents_type",
    header: ({ column }) => (
      <div className="text-center w-full max-w-[120px] truncate mx-auto">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold mx-auto"
        >
          Jenis Konten
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center w-full">{row.getValue("contents_type")}</div>
    ),
  },
  {
    accessorKey: "published_date",
    header: ({ column }) => (
      <div className="text-center w-full max-w-[120px] truncate mx-auto">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold mx-auto"
        >
          Tanggal Rilis
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const value = row.getValue("published_date") as string;
      const date = new Date(value);
      const formatted = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return <div className="text-center w-full">{formatted}</div>;
    },
  },

  {
    id: "actions",
    header: "Aksi",
    cell: () => null, // Akan dioverride di ContentPage
    enableSorting: false,
  }

];
