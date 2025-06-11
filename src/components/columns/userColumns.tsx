import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PenLine, CircleEllipsis, Trash2, Eye } from "lucide-react";

export type Mosque = {
  name: string;
  address?: string;
};

export type User = {
  created_at: string | null;
  expired_at: string | null;
  user_id: any;
  role: "admin" | "superadmin";
  name: string;
  mosque_id?: string | null;
  email: string;
  id: string;
  username: string;
  status: "active" | "inactive";
  mosque?: Mosque | null;
};

export const columns = (
  onDetail?: (user: User) => void,
  handleShowEdit?: (user: User) => void,
  handleConfirmDelete?: (user: User) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "username",
    header: "Username",
    meta: {
      className: "w-1/4 font-medium",
    },
    cell: ({ row }) => {
      return <div className="truncate">{row.original.username}</div>;
    },
  },
  {
    id: "masjid",
    header: "Masjid",
    accessorFn: (row) => row.mosque?.name || "-",
    meta: {
      className: "w-1/4",
    },
    cell: ({ row }) => {
      return <div className="truncate">{row.original.mosque?.name || "-"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: {
      className: "w-1/4 text-left justify-start",
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const isActive = status === "active";
      const statusClasses = isActive
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

      return (
        <div className="flex justify-start">
          <span
            className={`px-3 py-1 font-medium rounded-full text-xs capitalize ${statusClasses}`}
          >
            {isActive ? "Aktif" : "Nonaktif"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    meta: {
      className: "w-1/4 text-left justify-start",
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex justify-start gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1 p-1"
            onClick={() => onDetail?.(user)}
          >
            <Eye size={16} />
            <span>Detail</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1 p-1 text-yellow-500"
            onClick={() => handleShowEdit?.(user)}
          >
            <CircleEllipsis size={16} />
            <span>Ubah</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1 p-1 text-red-500"
            onClick={() => handleConfirmDelete?.(user)}
          >
            <Trash2 size={16} />
            <span>Hapus</span>
          </Button>
        </div>
      );
    },
  },
];
