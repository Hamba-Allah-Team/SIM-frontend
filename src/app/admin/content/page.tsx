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
      contents_id: 3,
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
      contents_id: 4,
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
      contents_id: 5,
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
      contents_id: 6,
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
      contents_id: 7,
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
      contents_id: 8,
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
      contents_id: 9,
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
      contents_id: 10,
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
      contents_id: 11,
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
      contents_id: 12,
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
      contents_id: 13,
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
      contents_id:14,
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
      <div className="w-full max-w-screen-xl min-h-screen px-4 sm:px-8 py-8 mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h1 className="text-[28px] font-bold font-poppins text-black">Konten Masjid</h1>
          {/* // className="text-[16px] font-semibold font-poppins text-black */}
          <ButtonTambahClient href="/admin/content/create" label="Tambah" />
        </div>

        <div className="p-4 bg-white rounded-xl shadow-sm overflow-x-auto">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    )
}


