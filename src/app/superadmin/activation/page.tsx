"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, AlertTriangle, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-700">{label}</label>
      <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 select-none cursor-not-allowed">
        {value ?? "-"}
      </div>
    </div>
  );
}

type AlertType = "success" | "error" | "info";

function AlertModal({
  open,
  onClose,
  title = "Pemberitahuan",
  message,
  type = "info",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: AlertType;
}) {
  let color = "";
  let Icon: React.ElementType = FileText;

  switch (type) {
    case "success":
      color = "text-green-600";
      Icon = CheckCircle;
      break;
    case "error":
      color = "text-red-600";
      Icon = XCircle;
      break;
    default:
      color = "text-orange-600";
      Icon = AlertTriangle;
      break;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white text-black [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center flex flex-col items-center gap-3">
          <Icon className={`w-12 h-12 ${color}`} />
          <p className={`text-lg font-medium ${color}`}>{message}</p>
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-custom-orange text-white hover:bg-orange-600"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type ActivationData = {
  email: string | number | null | undefined;
  activation_id: number;
  username: string | null;
  proof_number: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  mosque_name?: string | null;
  mosque_address?: string | null;
  proof_image?: string | null;
};

const columns = (
  onDetail: (req: ActivationData) => void,
  onApprove: (req: ActivationData) => void,
  onReject: (req: ActivationData) => void
): ColumnDef<ActivationData>[] => [
  {
    accessorKey: "proof_number",
    header: "Nomor Transaksi",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.proof_number}</span>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => row.original.username ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      let statusClasses = "";

      switch (status) {
        case "approved": // Diubah dari 'accepted' menjadi 'approved'
          statusClasses = "bg-green-100 text-green-800";
          break;
        case "pending":
          statusClasses = "bg-yellow-100 text-yellow-800";
          break;
        case "rejected":
          statusClasses = "bg-red-100 text-red-800";
          break;
        default:
          statusClasses = "bg-gray-100 text-gray-800";
          break;
      }

      return (
        <div className="flex justify-start">
          <span
            className={`px-3 py-1 font-medium rounded-full text-xs capitalize ${statusClasses}`}
          >
            {row.original.status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("id-ID"),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div
        onClick={() => onDetail(row.original)}
        className="flex items-center gap-1 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onDetail(row.original);
        }}
      >
        <FileText size={16} />
        <span>Tinjau</span>
      </div>
    ),
  },
];

type FilterStatus = "pending" | "history";

export default function ActivationPage() {
  const [requests, setRequests] = useState<ActivationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ActivationData | null>(
    null
  );
  const [confirmActionOpen, setConfirmActionOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    type: "info" as AlertType,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [proofImageError, setProofImageError] = useState(false);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("pending");

  const API = process.env.NEXT_PUBLIC_API_URL ?? "";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      setSearchTerm(event.detail.searchTerm);
    };
    window.addEventListener("globalSearch", handleSearch as EventListener);
    return () => {
      window.removeEventListener("globalSearch", handleSearch as EventListener);
    };
  }, []);

  const fetchData = useCallback(
    async (status: FilterStatus) => {
      setLoading(true);
      const statusQuery =
        status === "pending" ? "status=pending" : "status=approved,rejected";

      try {
        const res = await fetch(
          `${API}/api/activations?${statusQuery}&limit=100`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        if (!res.ok) throw new Error("Gagal memuat data");
        const json = await res.json();
        setRequests(json.activations || []);
      } catch {
        setAlert({
          open: true,
          title: "Error",
          message: "Gagal memuat data aktivasi.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [API, token]
  );

  useEffect(() => {
    if (API) {
      fetchData(filterStatus);
    }
  }, [API, filterStatus, fetchData]);

  useEffect(() => {
    if (selectedRequest) {
      setProofImageError(false);
    }
  }, [selectedRequest]);

  const filtered = requests.filter((req) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      (req.username?.toLowerCase().includes(s) ?? false) ||
      req.proof_number.toLowerCase().includes(s)
    );
  });

  const handleShowDetail = (req: ActivationData) => {
    setSelectedRequest(req);
  };
  const handleCloseDetail = () => setSelectedRequest(null);

  const handleActionClick = (
    req: ActivationData,
    type: "approve" | "reject"
  ) => {
    setSelectedRequest(req);
    setActionType(type);
    setConfirmActionOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return;
    setActionLoading(true);

    try {
      const res = await fetch(
        `${API}/api/activations/process/${selectedRequest.activation_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ action: actionType }),
        }
      );
      if (!res.ok) throw new Error("Gagal memperbarui status.");

      setAlert({
        open: true,
        title: "Sukses",
        message: `Request berhasil ${
          actionType === "approve" ? "disetujui" : "ditolak"
        }.`,
        type: "success",
      });

      setConfirmActionOpen(false);
      setSelectedRequest(null);
      await fetchData(filterStatus);
    } catch {
      setAlert({
        open: true,
        title: "Error",
        message: `Gagal ${
          actionType === "approve" ? "menyetujui" : "menolak"
        } request.`,
        type: "error",
      });
      setConfirmActionOpen(false);
    } finally {
      setActionLoading(false);
    }
  };

  const actionColumns = columns(
    handleShowDetail,
    (req) => handleActionClick(req, "approve"),
    (req) => handleActionClick(req, "reject")
  );

  const baseURL = API;

  return (
    <div className="p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">
          Permintaan Aktivasi
        </h1>

        <div className="flex gap-2">
          <Button
            onClick={() => setFilterStatus("pending")}
            variant={filterStatus === "pending" ? "default" : "outline"}
            className={
              filterStatus === "pending"
                ? "bg-custom-orange text-white hover:bg-orange-600"
                : "bg-white text-gray-800"
            }
          >
            Pending
          </Button>
          <Button
            onClick={() => setFilterStatus("history")}
            variant={filterStatus === "history" ? "default" : "outline"}
            className={
              filterStatus === "history"
                ? "bg-custom-orange text-white hover:bg-orange-600"
                : "bg-white text-gray-800"
            }
          >
            Riwayat
          </Button>
        </div>
      </div>

      <DataTable columns={actionColumns} data={filtered} loading={loading} />

      <Dialog
        open={!!selectedRequest && !confirmActionOpen}
        onOpenChange={handleCloseDetail}
      >
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-4xl bg-white text-black rounded shadow-lg p-6">
          <DialogHeader>
            <DialogTitle>Detail Permintaan Aktivasi</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="mt-4 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4 text-sm max-w-lg">
                <InfoRow
                  label="Nomor Transaksi"
                  value={selectedRequest.proof_number}
                />
                <InfoRow label="Username" value={selectedRequest.username} />
                <InfoRow label="Email" value={selectedRequest.email} />
                <InfoRow
                  label="Tanggal Permintaan"
                  value={new Date(selectedRequest.createdAt).toLocaleString(
                    "id-ID"
                  )}
                />
                <InfoRow
                  label="Nama Masjid"
                  value={selectedRequest.mosque_name}
                />
                <InfoRow
                  label="Alamat Masjid"
                  value={selectedRequest.mosque_address}
                />
              </div>

              <div className="flex-1 max-w-md flex flex-col items-center justify-start pt-2 md:pt-0">
                <label className="block font-semibold mb-2 text-gray-700 text-center md:text-left w-full">
                  Bukti Transfer
                </label>
                <div className="w-full h-96 flex items-center justify-center border border-gray-200 rounded bg-gray-50 p-2">
                  {selectedRequest.proof_image ? (
                    proofImageError ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center">
                        <XCircle
                          className="w-20 h-20 text-red-500"
                          strokeWidth={1.5}
                        />
                        <p className="text-sm text-red-600 mt-2 font-medium">
                          Gambar tidak dapat dimuat.
                        </p>
                      </div>
                    ) : (
                      <img
                        key={selectedRequest.proof_image}
                        src={`${baseURL}/uploads/${selectedRequest.proof_image}`}
                        alt="Bukti Transfer"
                        className="max-w-full max-h-full rounded object-contain"
                        onError={() => {
                          setProofImageError(true);
                        }}
                      />
                    )
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Bukti transfer tidak tersedia.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center mt-6">
            {selectedRequest?.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (selectedRequest)
                      handleActionClick(selectedRequest, "reject");
                  }}
                  className="bg-red-500 text-white hover:bg-red-600"
                  disabled={actionLoading}
                >
                  Tolak
                </Button>
                <Button
                  onClick={() => {
                    if (selectedRequest)
                      handleActionClick(selectedRequest, "approve");
                  }}
                  className="bg-custom-orange text-white hover:bg-orange-600"
                  disabled={actionLoading}
                >
                  Setujui
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmActionOpen}
        onOpenChange={(isOpen) => {
          if (actionLoading) return;
          setConfirmActionOpen(isOpen);
          if (!isOpen) {
            setActionType(null);
          }
        }}
      >
        <DialogContent className="max-w-md bg-white text-black [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center">
              {actionType === "approve"
                ? "Konfirmasi Persetujuan"
                : "Konfirmasi Penolakan"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 text-center">
            <p className="text-lg">
              Apakah Anda yakin ingin{" "}
              {actionType === "approve" ? "menyetujui" : "menolak"} permintaan
              ini?
            </p>
            {selectedRequest && (
              <p className="text-sm text-gray-600 mt-2">
                No. Transaksi: {selectedRequest.proof_number} <br />
                Username: {selectedRequest.username ?? "-"}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              className="bg-white text-black hover:text-black hover:bg-gray-100"
              onClick={() => {
                setConfirmActionOpen(false);
                setActionType(null);
              }}
              variant="outline"
              disabled={actionLoading}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={`${
                actionType === "approve"
                  ? "bg-custom-orange hover:bg-orange-600 "
                  : "bg-red-600 hover:bg-red-700 "
              } text-white`}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Memproses..."
                : actionType === "approve"
                ? "Ya, Setujui"
                : "Ya, Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertModal
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  );
}