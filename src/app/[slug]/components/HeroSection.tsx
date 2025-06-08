import Image from "next/image"; // 👈 Impor Image sekarang akan terpakai

// 👈 1. Menambahkan interface untuk tipe data prop
interface MasjidData {
    name: string;
    description: string;
    // image: string | null;
}

export default function HeroSection({ masjid }: { masjid: MasjidData }) { // 👈 2. Menggunakan tipe yang sudah didefinisikan
    return (
        <section className="relative bg-[#EBF1F4] overflow-hidden pt-12">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 text-center md:text-left z-10">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1E4A] leading-tight">
                            Selamat Datang di <br /> Masjid <span className="text-[#FF9357]">{masjid.name}</span>
                        </h1>
                        <p className="mt-4 text-slate-600 max-w-lg mx-auto md:mx-0">
                            {masjid.description}
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
                        {/* 👈 Diperbarui: Menggunakan gambar statis dari folder public */}
                        <Image
                            src="/masjid-home.png"
                            alt={`Ilustrasi Masjid ${masjid.name}`}
                            width={512}
                            height={512}
                            className="w-full max-w-sm md:max-w-md lg:max-w-lg drop-shadow-2xl h-auto"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}