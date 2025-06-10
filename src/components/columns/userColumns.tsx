import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PenLine, CircleEllipsis, Trash2, Eye } from "lucide-react";

export type Mosque = {
  name: string;
  address?: string;
};

export type User = {
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
    const status = row.original.status;
    const isActive = status === "active";

    // Tentukan kelas CSS berdasarkan status
    const statusClasses = isActive
      ? "bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800" 
      : "bg-red-100 text-red-800 dark:bg-red-100 dark:text-red-800"; 

    return (
      <span
        className={`px-3 py-1 font-medium rounded-full text-xs capitalize ${statusClasses}`}
      >
        {isActive ? "Aktif" : "Nonaktif"}
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
            <Eye size={16} />
            <span>Detail</span>
          </Button>
          {/* <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1 p-1"
            onClick={() => handleShowEdit?.(user)}
          >
            <CircleEllipsis size={16} />
            <span>Ubah</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-1 p-1"
            onClick={() => handleConfirmDelete?.(user)}
          >
            <Trash2 size={16} />
            <span>Hapus</span>
          </Button> */}
        </div>
      );
    },
  },
];
