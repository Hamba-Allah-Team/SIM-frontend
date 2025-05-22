"use client";

import React, { useEffect, useState } from "react";
import { columns, User } from "@/components/columns/userColumns";
import { DataTable } from "@/components/ui/data-table";

export default function UserPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  // Ambil token dari localStorage (jika ada)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUsers = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/users?limit=${limit}&page=${pageNumber}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      // Sesuaikan struktur response dengan backend
      setData(json.users || []);
      setTotal(json.total || 0);
      setPage(json.page || 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Dashboard User</h1>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
