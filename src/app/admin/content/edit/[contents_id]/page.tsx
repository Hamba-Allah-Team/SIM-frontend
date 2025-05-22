// app/content/[id]/edit/page.tsx
import { EditContentForm } from "./formEditContent"
import { Content } from "@/app/admin/content/columns"

export default function EditContentPage() {
  const dummyContent: Content = {
    contents_id: 1,
      mosque_id: 10,
      title: "Sejarah Masjid Agung",
      content_description: "Artikel tentang sejarah Masjid Agung...",
      image: "https://example.com/image1.jpg",
      published_date: "2024-05-01",
      contents_type: "artikel",
      user_id: 5,
      created_at: "2024-04-25T08:00:00Z",
      updated_at: "2024-04-26T10:00:00Z",
  }

  return (
    <div className="min-h-screen w-full p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[28px] font-bold font-poppins text-black">Ubah Konten Masjid</h1>
        </div>
          <EditContentForm initialData={dummyContent} />
    </div>

  )
}
