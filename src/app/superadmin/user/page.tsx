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
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Modal alert custom
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
  let messageColor = "";
  let IconComponent: React.ElementType = Info;

  switch (type) {
    case "success":
      messageColor = "text-green-600";
      IconComponent = CheckCircle;
      break;
    case "error":
      messageColor = "text-red-600";
      IconComponent = XCircle;
      break;
    case "info":
    default:
      messageColor = "text-orange-600";
      IconComponent = AlertTriangle;
      break;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white text-black [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg text-center">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 text-center flex flex-col items-center gap-3">
          <IconComponent className={`w-12 h-12 ${messageColor}`} />
          <p className={`text-lg font-medium ${messageColor}`}>{message}</p>
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

export default function UserPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // State untuk modal alert custom
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [alertTitle, setAlertTitle] = useState("Pemberitahuan");

  // State konfirmasi update
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      const adminUsers = (json.users || []).filter(
        (user: User) => user.role === "admin"
      );
      setData(adminUsers);
      setTotal(adminUsers.length);
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

  const handleShowEdit = (user: User) => setEditUser(user);
  const handleCloseEditModal = () => setEditUser(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (editUser) {
      setForm({
        name: editUser.name || "",
        email: editUser.email,
        username: editUser.username,
        status: editUser.status,
      });
    }
  }, [editUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    if (!editUser) {
      setAlertTitle("Error");
      setAlertMessage("User ID tidak ditemukan, tidak dapat update.");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }

    setUpdateLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${editUser.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.message || "Update gagal");
      }

      setAlertTitle("Sukses");
      setAlertMessage("User berhasil diperbarui");
      setAlertType("success");
      setAlertOpen(true);

      handleCloseEditModal();
      fetchUsers(page);
    } catch (error: any) {
      setAlertTitle("Error");
      setAlertMessage("Gagal update user: " + error.message);
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">User Admin</h1>
      <DataTable
        columns={columns(handleShowDetail, handleShowEdit)}
        data={data}
        loading={loading}
      />

      {/* Modal Detail */}
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
                  <InfoRow label="Alamat" value={selectedUser.mosque.address} />
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Update */}
      <Dialog open={!!editUser} onOpenChange={handleCloseEditModal}>
        <DialogContent className="bg-white text-black max-w-xl overflow-auto max-h-[80vh] [&>button]:hidden">
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
          </DialogHeader>

          {editUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmOpen(true); // buka konfirmasi
              }}
              className="space-y-4 mt-4"
            >
              <div>
                <label className="block mb-1 font-semibold">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>

              <DialogFooter className="mt-4 flex justify-between">
                <Button
                  className="text-custom-orange border-custom-orange bg-white"
                  variant="outline"
                  onClick={handleCloseEditModal}
                  disabled={updateLoading}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={updateLoading}>
                  {updateLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="bg-white text-black max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Update</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-700">
              Apakah Anda yakin ingin menyimpan perubahan pada user ini?
            </p>
          </div>
          <DialogFooter className="mt-4 flex justify-between">
            <Button
              variant="outline"
              className="text-custom-orange border-custom-orange bg-white"
              onClick={() => setConfirmOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                handleUpdateUser();
              }}
              disabled={updateLoading}
            >
              {updateLoading ? "Menyimpan..." : "Konfirmasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Alert */}
      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
}
