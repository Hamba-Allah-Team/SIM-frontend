"use client";

import ButtonTambahClient from "@/components/ButtonTambahClient"
import { Content, columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL; // gunakan dari .env

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

  return (
    <div className="w-full max-w-screen-xl min-h-screen px-2 sm:px-4 py-4 mx-auto">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <h1 className="text-[28px] font-bold font-poppins text-black">Konten Masjid</h1>
        <ButtonTambahClient href="/admin/content/create" label="Tambah" />
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm overflow-x-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}