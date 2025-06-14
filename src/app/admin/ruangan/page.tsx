"use client";

import { useRouter } from "next/navigation";
import ButtonTambahClient from "@/components/ButtonTambahClient";
import { Room, columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState, useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DeleteDialog } from "./delete/deleteDialog";
import { DetailDialog } from "./detail/detailDialog";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function RoomPage() {
  const router = useRouter();

  const [data, setData] = useState<Room[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/rooms`, {
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

    window.addEventListener(
      "globalSearch",
      handleGlobalSearch as EventListener
    );

    return () => {
      window.removeEventListener(
        "globalSearch",
        handleGlobalSearch as EventListener
      );
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = data.filter((item) =>
        item.place_name.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const handleDataDeletion = (roomId: number) => {
    setData((prevData) => prevData.filter((room) => room.room_id !== roomId));
    setFilteredData((prevData) =>
      prevData.filter((room) => room.room_id !== roomId)
    );
  };

  const handleShowDetail = (id: number) => {
    setSelectedRoomId(id);
    setOpenDetail(true);
  };

  const handleOpenDelete = (id: number) => {
    setSelectedRoomId(id);
    setOpenDelete(true);
  };

  const columns = useMemo(() => {
    return baseColumns.map((col) => {
      if (col.id === "actions") {
        return {
          ...col,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cell: ({ row }: any) => {
            const room = row.original;

            return (
              <div className="flex gap-4 justify-center">
                <button
                  className="btn-view flex items-center gap-1"
                  onClick={() => {
                    handleShowDetail(room.room_id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>Detail</span>
                </button>

                <button
                  className="btn-edit flex items-center gap-1"
                  onClick={() =>
                    router.push(`/admin/ruangan/edit/${room.room_id}`)
                  }
                >
                  <Pencil className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-500">Edit</span>
                </button>

                <button
                  className="btn-view flex items-center gap-1"
                  onClick={() => handleOpenDelete(room.room_id)}
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
    <div className="px-2 sm:px-4 py-4 mx-auto">
      <div className="p-6 rounded-xl">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h1 className="text-[28px] font-bold font-poppins text-black">
            Ruangan Masjid
          </h1>
          <ButtonTambahClient href="/admin/ruangan/create" label="Tambah" />
        </div>

        <div className="p-4 bg-white rounded-xl shadow-sm overflow-x-auto">
          <DataTable columns={columns} data={filteredData} />
        </div>

        <DetailDialog
          open={openDetail}
          onOpenChange={setOpenDetail}
          roomId={selectedRoomId}
        />

        <DeleteDialog
          open={openDelete}
          onOpenChange={setOpenDelete}
          roomId={selectedRoomId ?? 0}
          onConfirm={async (roomId: number) => {
            try {
              const token = localStorage.getItem("token");
              const res = await fetch(`${API}/api/rooms/${roomId}`, {
                method: "DELETE",
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                  "Content-Type": "application/json",
                },
              });

              if (!res.ok) throw new Error("Gagal menghapus data");

              handleDataDeletion(roomId);
            } catch (error) {
              console.error("Delete error:", error);
              toast.error("Gagal menghapus data ruangan");
            }
          }}
        />
      </div>
    </div>
  );
}
