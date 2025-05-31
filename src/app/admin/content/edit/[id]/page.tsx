import ContentEditForm from "./formEditContent"

type Props = {
  params: { id: string }
}

export default async function EditContentPage() {
  // const id  = params.id

  return (
    <div className="min-h-screen w-full p-8 bg-white text black">
      <div className="flex items-center justify-between mb-4 text black">
        <h1 className="text-[28px] font-bold font-poppins text-black">Ubah Konten Masjid</h1>
      </div>
      <ContentEditForm />
    </div>
  )
}
