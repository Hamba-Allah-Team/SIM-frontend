import Image from "next/image";

interface MasjidData {
    name: string;
    description: string;
}

export default function HeroSection({ masjid }: { masjid: MasjidData }) {
    return (
        <section className="relative bg-[#EBF1F4] overflow-hidden min-h-[500px] md:min-h-[600px]">
            <div className="container mx-auto px-4 h-full">
                {/* Text Container dengan positioning yang lebih konsisten */}
                <div className="relative z-10 flex items-center h-full min-h-[500px] md:min-h-[600px]">
                    <div className="w-full md:w-3/5 lg:w-1/2 text-center md:text-left">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A1E4A] leading-[1.1] mb-4">
                            Selamat Datang di <br /> 
                            <span className="text-[#FF9357] break-words">{masjid.name}</span>
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Tempat sholat, belajar, dan beribadah bersama.
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Container dengan sizing yang lebih terkontrol */}
            <div className="absolute inset-y-0 right-0 w-full md:w-1/2 h-full">
                <div className="relative w-full h-full opacity-70 md:opacity-100">
                    <Image
                        src="/masjid-home.png"
                        alt={`Ilustrasi ${masjid.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ 
                            objectFit: 'contain', 
                            objectPosition: 'center right'
                        }}
                        priority
                        className="select-none"
                    />
                </div>
            </div>
        </section>
    );
}