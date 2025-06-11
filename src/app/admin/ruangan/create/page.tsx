"use client";

import { FormCreateRoom } from "./formCreateRoom";

export default function AddRoomPage() {
  return (
    <div className="min-h-screen w-full p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[28px] font-bold font-poppins text-black">Tambah Ruangan Masjid</h1>
        </div>
          <FormCreateRoom />
    </div>
  )
}