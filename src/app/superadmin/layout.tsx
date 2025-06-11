"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ReactNode } from "react";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-h-screen flex flex-col overflow-x-hidden overflow-y-auto">
        <Topbar />
        <div className="p-4 flex-1">{children}</div>
      </main>
    </div>
  );
}