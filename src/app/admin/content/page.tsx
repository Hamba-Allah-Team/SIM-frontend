"use client";

import ButtonTambahClient from "@/components/ButtonTambahClient";
import { Content, columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState, useMemo } from "react";
import { CircleEllipsis, Pencil, Trash2 } from "lucide-react";
import { DeleteDialog } from "./delete/deleteDialog";
import { DetailDialog } from "./detail/detailDialog";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ContentPage() {
  const [data, setData] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/content`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data");

        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Fungsi hapus data di state berdasarkan contents_id
  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.contents_id !== id));
  };

  // Fungsi Detail
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);

  const handleShowDetail = (id: number) => {
    setSelectedContentId(id);
    setOpenDetail(true);
  };


  // Buat columns dengan modifikasi kolom aksi agar bisa panggil handleDelete
  const columns = useMemo(() => {
    return baseColumns.map((col) => {
      if (col.id === "actions") {
        return {
          ...col,
          cell: ({ row }: any) => {
            const content = row.original;
            const [openDialog, setOpenDialog] = useState(false);

            return (
              <div className="flex gap-2 justify-center">
                <button
                  className="btn-view flex items-center gap-1"
                  onClick={() => handleShowDetail(content.contents_id)}
                >
                  <CircleEllipsis className="w-4 h-4" />
                  Detail
                </button>

                <DetailDialog
                  open={openDetail}
                  onOpenChange={setOpenDetail}
                  contentId={selectedContentId}
                />

                <button
                  className="btn-edit flex items-center gap-1"
                  onClick={() => alert(`Edit konten ID: ${content.contents_id}`)}
                >
                  <Pencil className="w-4 h-4" />
                  Ubah
                </button>
                <button
                  className="btn-delete flex items-center gap-1"
                  onClick={() => setOpenDialog(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>

                <DeleteDialog
                  open={openDialog}
                  onOpenChange={setOpenDialog}
                  contents_id={content.contents_id.toString()}
                  onConfirm={async (idStr) => {
                    const id = parseInt(idStr);
                    try {
                      const res = await fetch(`${API}/api/content/${id}`, {
                        method: "DELETE",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                        },
                      });

                      if (!res.ok) {
                        const errMsg = await res.text();
                        throw new Error(errMsg || "Gagal menghapus konten");
                      }

                      // Update data langsung setelah delete berhasil
                      handleDelete(id);
                      console.log("Konten berhasil dihapus!");
                    } catch (error: any) {
                      console.error("Error deleting content:", error.message);
                      alert("Gagal menghapus konten: " + error.message);
                    }
                  }}
                />
              </div>
            );
          },
        };
      }
      return col;
    });
  }, [handleDelete]);

  return (
    <div className="w-full max-w-screen-xl min-h-screen px-2 sm:px-4 py-4 mx-auto">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <h1 className="text-[28px] font-bold font-poppins text-black">Konten Masjid</h1>
        <ButtonTambahClient href="/admin/content/create" label="Tambah" />
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm overflow-x-auto">
        <DataTable columns={columns} data={data}  />
      </div>
    </div>
  );
}
