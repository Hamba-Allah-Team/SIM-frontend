"use client"

import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import Link from "next/link"

interface MenuItem {
    label: string;
    href: string;
}

export default function MobileMenu({ menu }: { menu: MenuItem[] }) {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <button aria-label="Open menu">
                        <Menu className="w-6 h-6 text-[#1A1B4B]" />
                    </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-white text-[#1A1B4B] w-[260px] px-6 py-6">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-bold text-[#1A1B4B]">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-6">
                        {menu.map((item) => (
                            <SheetClose asChild key={item.href}>
                                <Link
                                    href={item.href}
                                    className="text-base font-medium text-[#1A1B4B] px-2 py-2 rounded hover:bg-gray-100"
                                >
                                    {item.label}
                                </Link>
                            </SheetClose>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}