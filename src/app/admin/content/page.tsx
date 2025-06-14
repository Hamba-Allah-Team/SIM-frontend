"use client";

import { useRouter } from "next/navigation";
import ButtonTambahClient from "@/components/ButtonTambahClient";
import { Content, columns as baseColumns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState, useMemo } from "react";
import { CircleEllipsis, Pencil, Trash2, Eye, Edit } from "lucide-react";
import { DeleteDialog } from "./delete/deleteDialog";
import { DetailDialog } from "./detail/detailDialog";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ContentPage() {
  const router = useRouter(); // <-- Panggil di sini, bukan di dalam useMemo

  const [data, setData] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [filteredData, setFilteredData] = useState<Content[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
        setFilteredData(json.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Listener event globalSearch untuk update searchTerm
  useEffect(() => {
    const handleGlobalSearch = (e: CustomEvent) => {
      setSearchTerm(e.detail.searchTerm || "");
    };

    window.addEventListener("globalSearch", handleGlobalSearch as EventListener);

    return () => {
      window.removeEventListener("globalSearch", handleGlobalSearch as EventListener);
    };
  }, []);

  // Filter data ketika searchTerm berubah
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const lowerSearch = searchTerm.toLowerCase();

      // Contoh filter berdasarkan properti tertentu,
      // misalnya filter berdasarkan title atau name konten
      const filtered = data.filter(item =>
        item.title?.toLowerCase().includes(lowerSearch) 
      );

      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.contents_id !== id));
  };

  const handleShowDetail = (id: number) => {
    setSelectedContentId(id);
    setOpenDetail(true);
  };

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
                  <Eye className="w-4 h-4" />
                  Detail
                </button>

                <DetailDialog
                  open={openDetail}
                  onOpenChange={setOpenDetail}
                  contentId={selectedContentId}
                />

                <button
                  className="btn-edit flex items-center gap-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => router.push(`/admin/content/edit/${content.contents_id}`)} // <-- pakai router dari level atas komponen
                >
                  <Edit className="w-4 h-4 " />
                  Ubah
                </button>

                <button
                  className="btn-delete flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
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
  }, [handleDelete, openDetail, selectedContentId, router]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200/80">
      <div className="bg-white p-4 rounded-xl">
        {/* Bagian atas: judul dan tombol tambah */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h1 className="text-[28px] font-bold font-poppins text-black">Kelola Konten Masjid</h1>
          <ButtonTambahClient href="/admin/content/create" label="Tambah Konten" />
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <DataTable columns={columns} data={filteredData} />
        </div>
      </div>
    </div>
  );

}
