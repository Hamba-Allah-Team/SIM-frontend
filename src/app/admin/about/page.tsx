"use client"

import { EditAboutForm } from "./edit/formEditAbout"

export default function EditAboutPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[28px] font-bold font-poppins text-black">
            Informasi Masjid
          </h1>
        </div>
        <EditAboutForm />
      </div>
    </div>
  )
}
