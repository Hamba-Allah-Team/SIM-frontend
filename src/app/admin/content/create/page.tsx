import { ContentForm } from "./formCreateContent"

export default function TambahContentPage() {
  return (
    <div className="min-h-screen w-full p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[28px] font-bold font-poppins text-black">Tambah Konten Masjid</h1>
        </div>
          <ContentForm />
    </div>
  )
}
