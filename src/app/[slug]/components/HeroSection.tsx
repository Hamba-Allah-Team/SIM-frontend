import Image from "next/image"; // 👈 Impor Image sekarang akan terpakai

// 👈 1. Menambahkan interface untuk tipe data prop
interface MasjidData {
    name: string;
    description: string;
    // image: string | null;
}

export default function HeroSection({ masjid }: { masjid: MasjidData }) { // 👈 2. Menggunakan tipe yang sudah didefinisikan
    return (
        <section className="relative bg-[#EBF1F4] overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Kontainer untuk teks, padding vertikalnya menentukan tinggi section */}
                <div className="relative z-10 w-full md:w-3/5 lg:w-1/2 py-24 md:py-32 lg:py-40 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A1E4A] leading-tight">
                        Selamat Datang di <br /> Masjid <span className="text-[#FF9357]">{masjid.name}</span>
                    </h1>
                    <p className="mt-4 text-slate-600 max-w-lg mx-auto md:mx-0">
                        Tempat sholat, belajar, dan beribadah bersama.
                    </p>
                </div>
            </div>

            {/* Kontainer untuk gambar yang diposisikan absolut */}
            <div className="absolute inset-y-0 right-0 w-1/2 h-full opacity-70 md:opacity-100 pointer-events-none">
                <Image
                    src="/masjid-home.png"
                    alt={`Ilustrasi ${masjid.name}`}
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'bottom right' }}
                    priority
                />
            </div>
        </section>
    );
}