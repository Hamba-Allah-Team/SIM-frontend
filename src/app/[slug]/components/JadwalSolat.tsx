import { Moon, Sun, Sunrise, Sunset } from "lucide-react";

interface JadwalSholatData {
    tanggalHijriyah: string;
    subuh: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
}

export function JadwalSolat({ jadwal }: { jadwal: JadwalSholatData }) {
    const iconWrapperClass = "flex items-center justify-center h-12 w-12 rounded-full bg-orange-400";
    const iconClass = "text-neutral-50";

    const waktuSholat = [
        { nama: "Subuh", waktu: jadwal.subuh, icon: <div className={iconWrapperClass}><Sunrise size={24} className={iconClass} /></div> },
        { nama: "Dzuhur", waktu: jadwal.dzuhur, icon: <div className={iconWrapperClass}><Sun size={24} className={iconClass} /></div> },
        { nama: "Ashar", waktu: jadwal.ashar, icon: <div className={iconWrapperClass}><Sun size={24} className={iconClass} /></div> },
        { nama: "Maghrib", waktu: jadwal.maghrib, icon: <div className={iconWrapperClass}><Sunset size={24} className={iconClass} /></div> },
        { nama: "Isya", waktu: jadwal.isya, icon: <div className={iconWrapperClass}><Moon size={24} className={iconClass} /></div> },
    ];
    return (
        <section className="relative -mt-16 z-10">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl px-6 py-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center">
                        {/* Tanggal */}
                        <div className="col-span-2 md:col-span-3 lg:col-span-1 flex items-center justify-center p-2 text-center">
                            <div>
                                <span className="text-sm text-slate-500">Jadwal Sholat</span>
                                <p className="font-bold text-[#0A1E4A]">{jadwal.tanggalHijriyah}</p>
                            </div>
                        </div>

                        {/* Waktu Sholat */}
                        {waktuSholat.map((item, index) => (
                            <div key={item.nama} className={`flex items-center justify-center gap-3 p-3 ${index > 0 ? 'lg:border-l border-slate-300' : 'lg:pl-6'}`}>
                                {item.icon}
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-[#FF9357]">{item.nama}</p>
                                    <p className="font-bold text-2xl text-[#0A1E4A] tracking-wider">{item.waktu}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}