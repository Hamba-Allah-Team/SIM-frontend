"use client";

import { FormCreateReservation } from "./formCreateReservation";

export default function CreateReservationPage() {
  return (
    <div className="min-h-screen w-full p-8">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-[28px] font-bold font-poppins text-black">Buat Reservasi</h1>
        </div>
            <FormCreateReservation />
    </div>
  );
}