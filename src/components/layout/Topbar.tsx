"use client";

import * as React from "react";
import { Search, LogOut, ChevronDown, User } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import ProfilePage from "@/components/profile/ProfilePage";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default function AdminTopbar() {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = React.useState(false);
  const { profile } = useUserProfile();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const searchEvent = new CustomEvent("globalSearch", {
      detail: { searchTerm: value },
    });
    window.dispatchEvent(searchEvent);
  };

  return (
    // 1. Mengubah latar belakang menjadi bg-white secara eksplisit
    <header className="w-full bg-white rounded-xl p-4 mb-4 shadow-sm flex items-center justify-between gap-4 border border-slate-200/80">
      {/* Search Input */}
      <div className="relative w-full max-w-md text-black">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <Input
          type="text"
          placeholder="Pencarian..."
          value={searchTerm}
          onChange={handleSearchChange}
          // 2. Memberi warna latar yang konsisten pada input
          className="pl-10 pr-4 py-2 h-10 bg-slate-100 border-transparent rounded-full text-sm focus:ring-2 focus:ring-orange-400 focus:bg-white text-slate-600"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* User Greeting & Dropdown */}
        {/* DropdownMenu yang sudah dimodifikasi */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100">
              <div className="text-sm text-right">
                <div className="text-slate-500 text-xs">Halo</div>
                <div className="font-semibold text-slate-800">
                  {profile?.name || "Pengguna"}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500 transition-transform duration-200 group-data-[state=open]:-rotate-180" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 mt-2 bg-white border-slate-200/80 shadow-lg"
          >
            {profile?.role === 'admin' && (
              <>
                <DropdownMenuItem className="cursor-pointer text-slate-800 focus:text-slate-800 focus:bg-slate-800/10 flex items-center gap-2" onClick={() => setIsProfileDialogOpen(true)}>
                    <User size={14} />
                    <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10 flex items-center gap-2">
              <LogOut size={14} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Dialog
          open={isProfileDialogOpen}
          onOpenChange={setIsProfileDialogOpen}
        > 
          <DialogTitle></DialogTitle>
          <DialogContent className="sm:max-w-2xl bg-white text-black">
            <div className="mt-4">
              <ProfilePage />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
