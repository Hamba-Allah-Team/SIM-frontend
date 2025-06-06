"use client"

import * as React from "react"
import { Moon, Sun, Search, LogOut, ChevronDown } from "lucide-react" // 👈 1. Tambahkan ChevronDown
import { useTheme } from "next-themes"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default function AdminTopbar() {
  const { theme, setTheme } = useTheme()
  const { profile } = useUserProfile()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.replace("/login")
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    const searchEvent = new CustomEvent("globalSearch", {
      detail: { searchTerm: value }
    })
    window.dispatchEvent(searchEvent)
  }

  return (
    // 2. Mengubah bg-card menjadi warna eksplisit untuk light & dark mode agar tidak "transparan"
    <header className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 mb-4 shadow-sm flex items-center justify-between gap-4 border dark:border-slate-700/80">
      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          type="text"
          placeholder="Pencarian..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-4 py-2 h-10 bg-background rounded-full text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Tombol Ganti Tema */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User Greeting & Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* 3. Menambahkan ikon dropdown */}
            <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-accent">
              <div className="text-sm text-right">
                <div className="text-muted-foreground text-xs">Halo</div>
                <div className="font-semibold text-foreground">{profile?.name || "Pengguna"}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:-rotate-180" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mt-2">
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10 flex items-center gap-2">
              <LogOut size={14} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
