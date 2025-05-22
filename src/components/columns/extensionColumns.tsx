import { ColumnDef } from "@tanstack/react-table";
import { ExtensionData } from "@/app/superadmin/extension/page";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export const columns = (
  onDetail: (req: ExtensionData) => void,
  onApprove: (req: ExtensionData) => void,
  onReject: (req: ExtensionData) => void
): ColumnDef<ExtensionData>[] => [
{
    accessorKey: "transaction_number",
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