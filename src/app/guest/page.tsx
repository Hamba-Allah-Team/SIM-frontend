import HeroSection from "@/components/HeroSection";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react"

const jadwalSholat = [
    { waktu: "04:10", nama: "Subuh", icon: <Sunrise size={32} className="text-orange-500" /> },
    { waktu: "11:45", nama: "Dhuhr", icon: <Sun size={32} className="text-orange-500" /> },
    { waktu: "14:55", nama: "Ashar", icon: <Sun size={32} className="text-orange-500" /> },
    { waktu: "17:47", nama: "Maghrib", icon: <Sunset size={32} className="text-orange-500" /> },
    { waktu: "18:50", nama: "Isya", icon: <Moon size={32} className="text-orange-500" /> },
];


export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <HeroSection />
            <div className="max-w-6xl mx-auto mt-12 px-4 md:px-8">
                <div className="bg-white shadow-xl rounded-3xl p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    {jadwalSholat.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                            {item.icon}
                            <p className="text-lg font-semibold text-[#1C1C4C]">{item.waktu}</p>
                            <span className="text-sm text-[#1C1C4C]">{item.nama}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
