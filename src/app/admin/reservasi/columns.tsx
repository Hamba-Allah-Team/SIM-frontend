"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Reservation = {
  reservation_id: number;
  name: string;
  phone_number: string;
  room_id: number;
  reservation_date: string;
  description: string;
  start_time: string;
  end_time: string;
  status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
  updated_at: string;
  room: {
    place_name: string;
  };
};

export const columns: ColumnDef<Reservation>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <div className="text-center w-fit truncate mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="font-semibold mx-auto items-center"
                >
                    Nama Pemesan
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            </div>
        ),
        cell: ({ row }) => (
            <div
                className="truncate overflow-hidden whitespace-nowrap text-center w-full"
                title={row.getValue("name")}
            >
                {row.getValue("name")}
            </div>
        ),
    },
    {
        accessorKey: "room.place_name",
        header: ({}) => (
            <div className="text-center w-fit truncate mx-auto">
                <Button
                    variant="ghost"
                    className="font-semibold mx-auto items-center"
                >
                    Nama Ruangan
                </Button>
            </div>
        ),
        cell: ({ row }) => (
            <div
                className="truncate overflow-hidden whitespace-nowrap w-full text-center"
                title={row.original.room?.place_name || " - "}
            >
                {row.original.room?.place_name || " - "}
            </div>
        ),
    },
    {
        accessorKey: "reservation_date",
        header: ({ column }) => (
            <div className="text-center w-fit truncate mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="font-semibold mx-auto items-center"
                >
                    Tanggal Reservasi
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center w-full">
                {new Date(row.getValue("reservation_date")).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: ({}) => (
            <div className="text-center w-fit truncate mx-auto">
                <Button
                    variant="ghost"
                    className="font-semibold mx-auto items-center"
                >
                    Status
                </Button>
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center w-full">
                {row.getValue("status") === "pending" ? (
                    <span className="text-yellow-500">Menunggu</span>
                ) : row.getValue("status") === "approved" ? (
                    <span className="text-green-500">Disetujui</span>
                ) : row.getValue("status") === "rejected" ? (
                    <span className="text-red-500">Ditolak</span>
                ) : (
                    <span className="text-blue-500">Selesai</span>
                )}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-center w-full">Aksi</div>,
        cell: () => null,
        enableSorting: false,
    }
]