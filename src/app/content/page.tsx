import ButtonTambahClient from "@/components/ButtonTambahClient"
import { Content, columns } from "./columns"
import { DataTable } from "./data-table"


async function getData(): Promise<Content[]> {
  // Contoh data dummy yang sesuai dengan tipe Content
  return [
    {
      contents_id: 1,
      mosque_id: 10,
      title: "Sejarah Masjid Agung ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,",
      content_description: "Artikel tentang sejarah Masjid Agung...",
      image: "https://example.com/image1.jpg",
      published_date: "2024-05-01",
      contents_type: "artikel",
      user_id: 5,
      created_at: "2024-04-25T08:00:00Z",
      updated_at: "2024-04-26T10:00:00Z",
    },
    {
      contents_id: 2,
      mosque_id: 10,
      title: "Kegiatan Ramadhan 2024",
      content_description: "Berita kegiatan Ramadhan di masjid...",
      image: undefined,
      published_date: "2024-04-15",
      contents_type: "berita",
      user_id: 6,
      created_at: "2024-04-10T09:00:00Z",
      updated_at: "2024-04-12T11:00:00Z",
    },
    {
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
    },
    {
      contents_id: 2,
      mosque_id: 10,
      title: "Kegiatan Ramadhan 2024",
      content_description: "Berita kegiatan Ramadhan di masjid...",
      image: undefined,
      published_date: "2024-04-15",
      contents_type: "berita",
      user_id: 6,
      created_at: "2024-04-10T09:00:00Z",
      updated_at: "2024-04-12T11:00:00Z",
    },
    {
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
    },
    {
      contents_id: 2,
      mosque_id: 10,
      title: "Kegiatan Ramadhan 2024",
      content_description: "Berita kegiatan Ramadhan di masjid...",
      image: undefined,
      published_date: "2024-04-15",
      contents_type: "berita",
      user_id: 6,
      created_at: "2024-04-10T09:00:00Z",
      updated_at: "2024-04-12T11:00:00Z",
    },
    {
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
    },
    {
      contents_id: 2,
      mosque_id: 10,
      title: "Kegiatan Ramadhan 2024",
      content_description: "Berita kegiatan Ramadhan di masjid...",
      image: undefined,
      published_date: "2024-04-15",
      contents_type: "berita",
      user_id: 6,
      created_at: "2024-04-10T09:00:00Z",
      updated_at: "2024-04-12T11:00:00Z",
    },
    {
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
    },
    {
      contents_id: 2,
      mosque_id: 10,
      title: "Kegiatan Ramadhan 2024",
      content_description: "Berita kegiatan Ramadhan di masjid...",
      image: undefined,
      published_date: "2024-04-15",
      contents_type: "berita",
      user_id: 6,
      created_at: "2024-04-10T09:00:00Z",
      updated_at: "2024-04-12T11:00:00Z",
    },
    {
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
    },
    {
      contents_id: 2,
      mosque_id: 10,
      title: "Kegiatan Ramadhan 2024",
      content_description: "Berita kegiatan Ramadhan di masjid...",
      image: undefined,
      published_date: "2024-04-15",
      contents_type: "berita",
      user_id: 6,
      created_at: "2024-04-10T09:00:00Z",
      updated_at: "2024-04-12T11:00:00Z",
    },
    {
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
    },
    {
      contents_id: 2,
      mosque_id: 10,
      title: "Kegiatan Ramadhan 2024",
      content_description: "Berita kegiatan Ramadhan di masjid...",
      image: undefined,
      published_date: "2024-04-15",
      contents_type: "berita",
      user_id: 6,
      created_at: "2024-04-10T09:00:00Z",
      updated_at: "2024-04-12T11:00:00Z",
    },
    {
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
    },
    {
      contents_id: 2,
      mosque_id: 10,
      title: "Kegiatan Ramadhan 2024",
      content_description: "Berita kegiatan Ramadhan di masjid...",
      image: undefined,
      published_date: "2024-04-15",
      contents_type: "berita",
      user_id: 6,
      created_at: "2024-04-10T09:00:00Z",
      updated_at: "2024-04-12T11:00:00Z",
    },
    // Tambahkan data lainnya sesuai kebutuhan
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="w-screen h-screen p-8 bg-[#F5F6F8] rounded-none">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[28px] font-bold font-poppins">Konten Masjid</h1>
        <ButtonTambahClient />
      </div>

      <div className="p-8 bg-white rounded-xl shadow-sm">
        <DataTable columns={columns} data={data} />
      </div>
    </div>



    // <div className="container mx-auto py-10">
    //   <div className="flex items-center justify-between mb-6">
    //     <h1 className="text-2xl font-bold text-[#1A1A3D]">Konten Masjid</h1>
    //     <ButtonTambahClient />
    //   </div>
    //   <DataTable columns={columns} data={data} />
    // </div>
  )
}

