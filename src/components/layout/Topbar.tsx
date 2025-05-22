"use client"

import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search } from "lucide-react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminTopbar() {
    const { profile } = useUserProfile()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    console.log("Ini Data Profile:", profile)

    const handleLogout = () => {
        localStorage.removeItem("token")
        router.push("/login") // arahkan ke halaman login
    }

    return (
        <header className="w-full bg-white rounded-xl p-4 mb-4 shadow-sm flex items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <Input
                    type="text"
                    placeholder="Pencarian"
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm text-gray-500 border-none focus:outline-none focus:ring-2 focus:ring-orange-200 placeholder:text-gray-500"
                />
            </div>

            {/* User Greeting & Dropdown */}
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <div className="text-sm text-right cursor-pointer">
                        <div className="text-gray-500">Halo</div>
                        <div className="font-semibold text-[#1B1B3A]">{profile?.name || "Pengguna"}</div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 mt-2">
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-gray-500">
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
