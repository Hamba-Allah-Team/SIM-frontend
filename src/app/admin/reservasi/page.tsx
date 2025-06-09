"use client";

import { useRouter } from "next/navigation";
import ButtonTambahClient from "@/components/ButtonTambahClient";
import { Reservation, columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState, useMemo } from "react";
import { Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { DeleteDialog } from "./delete/deleteDialog";
import { DetailDialog } from "./detail/detailDialog";
import { ApproveDialog } from "./approve/approveDialog";
import { RejectDialog } from "./reject/rejectDialog";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ReservationPage() {
    const router = useRouter();

    const [data, setData] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDetail, setOpenDetail] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openApprove, setOpenApprove] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
    const [filteredData, setFilteredData] = useState<Reservation[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API}/api/reservations`, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });

                if (!res.ok) throw new Error("Gagal mengambil data");

                const json = await res.json();
                setData(json.data || []);
                setFilteredData(json.data || []);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        const handleGlobalSearch = (e: CustomEvent) => {
            setSearchTerm(e.detail.searchTerm || "");
        };

        window.addEventListener("globalSearch", handleGlobalSearch as EventListener);

        return () => {
            window.removeEventListener("globalSearch", handleGlobalSearch as EventListener);
        };
    }, [searchTerm]);

    useEffect(() => {
        if(!searchTerm) {
            setFilteredData(data);
            return;
        } else {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filtered = data.filter((item) =>
                item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.room.place_name.toLowerCase().includes(lowerCaseSearchTerm)
            );
            setFilteredData(filtered);
        }
    }, [searchTerm, data]);

    const handleDataDeletion = (reservationId: number) => {
        setData((prevData) => prevData.filter((reservation) => reservation.reservation_id !== reservationId));
        setFilteredData((prevData) => prevData.filter((reservation) => reservation.reservation_id !== reservationId));
    }

    const handleShowDetail = (id: number) => {
        setSelectedReservationId(id);
        setOpenDetail(true);
    }

    const handleOpenApprove = (id: number) => {
        setSelectedReservationId(id);
        setOpenApprove(true);
    }

    const handleOpenReject = (id: number) => {
        setSelectedReservationId(id);
        setOpenReject(true);
    }

    const handleOpenDelete = (id: number) => {
        setSelectedReservationId(id);
        setOpenDelete(true);
    }

    const columns = useMemo(() => {
        return baseColumns.map((col) => {
            if (col.id === "actions") {
                return {
                    ...col,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    cell: ({ row }: any) => {
                        const reservation = row.original;

                        return (
                            <div className="flex gap-2 justify-center">
                                {/* Tombol Setujui */}
                                {reservation.status === "pending" && (
                                    <button
                                        className="btn-approve flex items-center gap-1 text-green-600 hover:text-green-800"
                                        onClick={() => handleOpenApprove(reservation.reservation_id)}
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Setujui</span>
                                    </button>
                                )}
                                {/* Tombol Tolak */}
                                {reservation.status === "pending" && (
                                    <button
                                        className="btn-reject flex items-center gap-1 text-red-600 hover:text-red-800"
                                        onClick={() => handleOpenReject(reservation.reservation_id)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        <span>Tolak</span>
                                    </button>
                                )}
                                {/* Tombol Detail, Edit, Hapus */}
                                <button
                                    className="btn-view flex items-center gap-1"
                                    onClick={() => { handleShowDetail(reservation.reservation_id) }}
                                >
                                    <Eye className="h-4 w-4" /> 
                                    <span>Detail</span>
                                </button>
                                {(reservation.status === "pending" || reservation.status === "approved" || reservation.status === "rejected") ? (
                                    <button
                                        className="btn-edit flex items-center gap-1"
                                        onClick={() =>  router.push(`/admin/reservasi/edit/${reservation.reservation_id}`)}
                                    >
                                        <Pencil className="h-4 w-4 text-blue-500" /> 
                                        <span className="text-blue-500">Edit</span>
                                    </button>
                                ) : null}

                                <button
                                    className="btn-view flex items-center gap-1"
                                    onClick={() => handleOpenDelete(reservation.reservation_id)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" /> 
                                    <span className="text-red-500">Hapus</span>
                                </button>
                            </div>
                        );
                    },
                };  
            }
        return col;
        });
    }, [router]);

    return (
        loading ? (
            <div className="w-full max-w-screen-xl min-h-screen px-2 sm:px-4 py-4 mx-auto">
                <div className="flex items-center justify-center h-full">
                    <p className="text-black text-4xl">Loading...</p>
                </div>
            </div>
        ) : (
            <div className="w-full max-w-screen-xl min-h-screen px-2 sm:px-4 py-4 mx-auto">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
                    <h1 className="text-[28px] font-bold font-poppins text-black">Reservasi Masjid</h1>
                    <ButtonTambahClient href="/admin/reservasi/create" label="Tambah" />
              </div>
        
              <div className="p-4 bg-white rounded-xl shadow-sm overflow-x-auto">
                    <DataTable columns={columns} data={filteredData} />
              </div>

                <DetailDialog 
                    open={openDetail} 
                    onOpenChange={setOpenDetail} 
                    reservationId={selectedReservationId}
                />

                <ApproveDialog 
                    open={openApprove} 
                    onOpenChange={setOpenApprove} 
                    reservationId={selectedReservationId ?? 0} 
                    onConfirm={async (reservationId: number) => {
                        try {
                            const token = localStorage.getItem("token");
                            const res = await fetch(`${API}/api/reservations/${reservationId}/approved`, {
                                method: "PUT",
                                headers: {
                                    Authorization: token ? `Bearer ${token}` : "",
                                    "Content-Type": "application/json",
                                },
                            });

                            if (!res.ok) {
                                const errorData = await res.json();
                                throw new Error("Gagal menyetujui data: " + errorData.message);
                            }

                            handleDataDeletion(reservationId);
                            toast.success("Data reservasi berhasil disetujui", {
                                style: {
                                    background: "white",
                                    color: "black",
                                    border: "2px solid #22c55e",
                                },
                            });
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (error: any) {
                            console.error("Approve error:", error);
                            toast.error(error.message || "Gagal menyetujui data reservasi");
                        } finally {
                            setOpenApprove(false);
                        }
                    }}
                />

                <RejectDialog 
                    open={openReject} 
                    onOpenChange={setOpenReject} 
                    reservationId={selectedReservationId ?? 0} 
                    onConfirm={async (reservationId: number) => {
                        try {
                            const token = localStorage.getItem("token");
                            const res = await fetch(`${API}/api/reservations/${reservationId}/rejected`, {
                                method: "PUT",
                                headers: {
                                    Authorization: token ? `Bearer ${token}` : "",
                                    "Content-Type": "application/json",
                                },
                            });

                            if (!res.ok) {
                                const errorData = await res.json();
                                throw new Error("Gagal menolak data: " + errorData.message);
                            }

                            handleDataDeletion(reservationId);
                            toast.success("Data reservasi berhasil ditolak", {
                                style: {
                                    background: "white",
                                    color: "black",
                                    border: "2px solid #22c55e",
                                },
                            });
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (error: any) {
                            console.error("Reject error:", error);
                            toast.error(error.message || "Gagal menolak data reservasi");
                        } finally {
                            setOpenReject(false);
                        }
                    }}
                />

                <DeleteDialog 
                    open={openDelete} 
                    onOpenChange={setOpenDelete} 
                    reservationId={selectedReservationId ?? 0} 
                    onConfirm={async (reservationId: number) => {
                        try {
                            const token = localStorage.getItem("token");
                            const res = await fetch(`${API}/api/reservations/${reservationId}`, {
                                method: "DELETE",
                                headers: {
                                    Authorization: token ? `Bearer ${token}` : "",
                                    "Content-Type": "application/json",
                                },
                            });

                            if (!res.ok) throw new Error("Gagal menghapus data");

                            handleDataDeletion(reservationId);
                        } catch (error) {
                            console.error("Delete error:", error);
                            toast.error("Gagal menghapus data reservasi");
                        }
                    }}
                />
            </div>  
        )
    );
}