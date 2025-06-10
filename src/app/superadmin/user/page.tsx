"use client";

import React, { useEffect, useState } from "react";
import {
  columns as createColumns,
  User,
} from "@/components/columns/userColumns";
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
import { Input } from "@/components/ui/input";

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
  let Icon: React.ElementType = Info;

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

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    status: "active" as "active" | "inactive",
  });

  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    type: "info" as AlertType,
  });

  // Modal konfirmasi hapus
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<User | null>(null);

  // Modal konfirmasi edit
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Listen untuk search dari topbar
  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      setSearchTerm(event.detail.searchTerm);
    };

    window.addEventListener('globalSearch', handleSearch as EventListener);
    
    return () => {
      window.removeEventListener('globalSearch', handleSearch as EventListener);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users?limit=100`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const json = await res.json();
      const admins = json.users.filter((u: User) => u.role === "admin");
      setUsers(admins);
    } catch (err) {
      setAlert({
        open: true,
        title: "Error",
        message: "Gagal memuat data admin.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter users berdasarkan search term
  const filtered = users.filter((user) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const handleShowDetail = (user: User) => setSelectedUser(user);
  const handleCloseDetail = () => setSelectedUser(null);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setForm({
      name: user.name || "",
      username: user.username,
      email: user.email,
      status: user.status,
    });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fungsi untuk update user yang dipanggil saat konfirmasi edit YA
  const handleUpdate = async () => {
    if (!editUser) return;

    try {
      const res = await fetch(
        `${API}/api/users/${editUser.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Gagal update data.");

      setAlert({
        open: true,
        title: "Sukses",
        message: "Data admin berhasil diperbarui.",
        type: "success",
      });

      setConfirmEditOpen(false);
      setEditUser(null);
      fetchData();
    } catch (err) {
      setAlert({
        open: true,
        title: "Error",
        message: "Terjadi kesalahan saat update.",
        type: "error",
      });
      setConfirmEditOpen(false);
    }
  };

  // Saat klik tombol Update di modal edit: buka modal konfirmasi edit
  const handleClickUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmEditOpen(true);
  };

  // Handle konfirmasi hapus user
  const handleConfirmDelete = (user: User) => {
    setConfirmDeleteUser(user);
  };

  const handleDelete = async () => {
    if (!confirmDeleteUser) return;

    try {
      const res = await fetch(
        `${API}/api/users/${confirmDeleteUser.user_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) throw new Error();

      setAlert({
        open: true,
        title: "Sukses",
        message: `User ${confirmDeleteUser.username} telah dihapus.`,
        type: "success",
      });

      setConfirmDeleteUser(null);
      fetchData();
    } catch {
      setAlert({
        open: true,
        title: "Error",
        message: "Gagal menghapus user.",
        type: "error",
      });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteUser(null);
  };

  // Batalkan modal konfirmasi edit
  const handleCancelEditConfirm = () => {
    setConfirmEditOpen(false);
  };

  const columns = createColumns(
    handleShowDetail,
    handleEdit,
    handleConfirmDelete
  );

  return (
    <div className="p-6 rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4 text-black">User Admin</h1>

      <DataTable columns={columns} data={filtered} loading={loading} />

      {/* Modal Detail */}
        <Dialog open={!!selectedUser} onOpenChange={handleCloseDetail}>
          <DialogContent className="bg-white text-black max-w-xl">
            <DialogHeader>
              <DialogTitle>Detail User</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 mt-4 text-sm">
                <InfoRow label="Username" value={selectedUser.username} />
                <InfoRow label="Nama" value={selectedUser.name} />
                <InfoRow label="Email" value={selectedUser.email} />

                <InfoRow
                  label="Waktu Aktivasi"
                    value={
                      selectedUser.created_at
                        ? new Intl.DateTimeFormat('sv-SE', { 
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Jakarta',
                          })
                          .format(new Date(selectedUser.created_at))
                          .replace(' ', ' ') 
                        : '-'
                    }
                />
                <InfoRow
                  label="Aktif Hingga"
                    value={
                      selectedUser.expired_at
                        ? new Intl.DateTimeFormat('sv-SE', { 
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Asia/Jakarta',
                          })
                          .format(new Date(selectedUser.expired_at))
                          .replace(' ', ' ') 
                        : '-'
                    }
                />            
                {selectedUser.mosque && (
                  <>
                    <InfoRow
                      label="Nama Masjid"
                      value={selectedUser.mosque.name}
                    />
                    <InfoRow label="Alamat" value={selectedUser.mosque.address} />
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

      {/* Modal Edit */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="bg-white text-black max-w-xl [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleClickUpdate} className="space-y-4 mt-4">
            <div>
              <label>Nama</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>Username</label>
              <Input
                name="username"
                value={form.username}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <Input
                name="email"
                value={form.email}
                onChange={handleFormChange}
                required
              />
            </div>
            <div>
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full rounded border border-gray-300 px-3 py-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditUser(null)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-custom-orange text-white hover:bg-orange-600"
              >
                Ubah
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={!!confirmDeleteUser} onOpenChange={handleCancelDelete}>
        <DialogContent className="max-w-md bg-white text-black [&>button:last-child]:hidden">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">Konfirmasi Hapus User</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center flex flex-col items-center gap-3">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <p>
              Apakah Anda yakin ingin menghapus user{" "}
              <strong>{confirmDeleteUser?.username}</strong>?
            </p>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="secondary" onClick={handleCancelDelete}>
              Batal
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi Edit */}
      <Dialog open={confirmEditOpen} onOpenChange={handleCancelEditConfirm}>
        <DialogContent className="max-w-md bg-white text-black [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center">Konfirmasi Perubahan</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center flex flex-col items-center gap-3">
            <AlertTriangle className="w-12 h-12 text-custom-orange" />
            <p>Apakah Anda yakin ingin menyimpan perubahan ini?</p>
          </div>
          <DialogFooter className="flex justify-between">
            <Button className="border-gray-200" variant="secondary" onClick={handleCancelEditConfirm}>
              Batal
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-custom-orange text-white hover:bg-orange-600"
            >
              Ya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Alert */}
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
