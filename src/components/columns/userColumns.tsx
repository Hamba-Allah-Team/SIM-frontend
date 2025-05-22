import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PenLine, CircleEllipsis } from "lucide-react";

export type Mosque = {
  name: string;
  address?: string;
};

export type User = {
  name: unknown;
  mosque_id: unknown;
  email: string;
  id: string;
  username: string;
  status: "active" | "inactive";
  mosque?: Mosque | null;
};

// Fungsi untuk menghasilkan kolom dengan aksi yang memanggil handler
export const columns = (
  onDetail?: (user: User) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    id: "masjid",
    header: "Masjid",
    accessorFn: (row) => row.mosque?.name || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const displayText = status === "active" ? "Aktif" : "Nonaktif";
      return (
        <span
          className={`${
            status === "active" ? "aktif text-black" : "text-black"
          }`}
        >
          {displayText}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1 p-1"
            onClick={() => onDetail?.(user)}
          >
            <PenLine size={16} />
            <span>Detail</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1 p-1"
            onClick={() => alert(`Ubah user ${user.id}`)}
          >
            <CircleEllipsis size={16} />
            <span>Ubah</span>
          </Button>
        </div>
      );
    },
  },
];
