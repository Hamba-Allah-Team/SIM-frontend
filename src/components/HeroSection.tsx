import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="w-full bg-[#E3EDF7] pt-20 pb-24">
            <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
                {/* Teks Hero */}
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1C1C4C] leading-snug">
                        Selamat Datang <br />
                        Masjid xxx
                    </h1>
                    <p className="mt-4 text-[#1C1C4C] text-base md:text-lg">
                        Jadwal Ibadah, Kegiatan Islami, dan Laporan Keuangan dalam Satu Tempat.
                    </p>
                </div>

                {/* Gambar Masjid */}
                <div className="relative w-full h-[300px] md:h-[400px]">
                    <Image
                        src="/masjid-home.png"
                        alt="masjid"
                        fill
                        className="object-contain md:object-contain"
                    />
                </div>
            </div>
        </section>
    );
}
