// app/admin/about/edit/page.tsx
"use client"

import { EditAboutForm } from "./edit/formEditAbout"

const fakeInitialData = {
  mosque_id: 1,
  name: "Masjid Nurul Iman",
  address: "Jl. Merpati No. 10",
  description: "Masjid utama di kawasan ini",
  email: "nuruliman@example.com",
  phone_whatsapp: "081234567890",
}

export default function EditAboutPage() {
  const handleUpdate = async (values: any) => {
    console.log("Data akan dikirim ke backend:", values)
    // Lakukan fetch/axios PATCH ke API di sini jika sudah ada
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-xl font-semibold mb-6">Edit Profil Masjid</h1>
      <EditAboutForm initialData={fakeInitialData} onSubmitForm={handleUpdate} />
    </div>
  )
}
