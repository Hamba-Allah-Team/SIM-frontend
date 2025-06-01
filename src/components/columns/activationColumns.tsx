import { ColumnDef } from "@tanstack/react-table";
import { ActivationData } from "@/app/superadmin/activation/page";
import { Button } from "@/components/ui/button";

export const columns = (
  onDetail: (req: ActivationData) => void,
): ColumnDef<ActivationData>[] => [
  {
    accessorKey: "proof_number",
    header: "Nomor Transaksi",
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => row.original.username ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDetail(row.original)}
        >
          Detail
        </Button>
      </div>
    ),
  },
];