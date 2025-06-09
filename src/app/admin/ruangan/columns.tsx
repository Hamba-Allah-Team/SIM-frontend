"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Room = {
  room_id: number;
  place_name: string;
  image?: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "place_name",
    header: "Nama Ruangan",
    cell: ({ row }) => (
      <div
        className="truncate overflow-hidden whitespace-nowrap w-[200px] sm:w-[300px] lg:w-[400px]"
        title={row.getValue("place_name")}
      >
        {row.getValue("place_name")}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
        <div className="text-center w-full max-w-[120px] truncate mx-auto">
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-semibold mx-auto"
            >
                Tanggal Dibuat
                <ArrowUpDown className="ml-1 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => (
      <div className="text-center w-full">
        {new Date(row.getValue("created_at")).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center w-full">Aksi</div>,
    cell: () => null,
    enableSorting: false,
  },

];
