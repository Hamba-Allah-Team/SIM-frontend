"use client";

import React, { useEffect, useState } from "react";
import { columns, User } from "@/components/columns/userColumns";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Komponen kecil untuk label + value, supaya rapi dan reuseable
function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 select-none cursor-not-allowed">
        {value ?? "-"}
      </div>
    </div>
  );
}

export default function UserPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

  const handleShowDetail = (user: User) => setSelectedUser(user);
  const handleCloseModal = () => setSelectedUser(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Dashboard User</h1>
      <DataTable
        columns={columns(handleShowDetail)}
        data={data}
        loading={loading}
      />

      {/* Modal */}
      <Dialog open={!!selectedUser} onOpenChange={handleCloseModal}>
        <DialogContent className="bg-white text-black max-w-xl overflow-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Detail User Admin</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 mt-4 text-sm">
              <InfoRow label="Nama" value={selectedUser.name} />
              <InfoRow label="Username" value={selectedUser.username} />
              <InfoRow label="Email" value={selectedUser.email} />
              {selectedUser.mosque && (
                <>
                  <InfoRow label="Nama Masjid" value={selectedUser.mosque.name} />
                  <InfoRow label="Alamat" value={selectedUser.mosque.address} />                </>
              )}
            </div>
          )}

          <DialogFooter className="mt-4">
            <button
              onClick={handleCloseModal}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Tutup
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
