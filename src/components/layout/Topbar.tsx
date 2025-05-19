// components/layout/AdminTopbar.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function AdminTopbar() {
    return (
        <header className="w-full bg-white rounded-xl p-4 mb-4 shadow-sm flex items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <Input
                    type="text"
                    placeholder="Pencarian"
                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm border-none focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
            </div>

            {/* User Greeting */}
            <div className="text-sm text-right">
                <div className="text-gray-400">Howdy</div>
                <div className="font-semibold text-[#1B1B3A]">Ariana Xian</div>
            </div>
        </header>
    )
}
