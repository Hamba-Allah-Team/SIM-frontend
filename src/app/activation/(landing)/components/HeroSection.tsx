import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
    return (
        <section className="relative bg-[#EBF1F4] overflow-hidden pt-32 md:pt-40">
            <div className="container mx-auto px-4">
                <div className="relative z-10 w-full md:w-3/5 lg:w-1/2 text-center md:text-left py-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A1E4A] leading-tight">
                        Semua yang Kamu Butuhkan, Dalam Satu Platform
                    </h1>
                    <p className="mt-4 text-slate-600 max-w-lg mx-auto md:mx-0">
                        Manajemen masjid modern untuk transparansi, efisiensi, dan kemudahan bagi jamaah.
                    </p>
                    <div className="mt-8">
                        <Button asChild className="bg-[#FF9357] hover:bg-[#FF9357]/90 text-white font-semibold px-8 py-6 text-lg rounded-full">
                            <Link href="/activation/register">Coba Sekarang</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2 h-full opacity-70 md:opacity-100 pointer-events-none">
                <Image
                    src="/masjid-home.png"
                    alt="Ilustrasi Masjid"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'bottom right' }}
                    priority
                />
            </div>
        </section>
    );
}