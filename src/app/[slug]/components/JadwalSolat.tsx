interface JadwalSholatData {
    tanggalHijriyah: string;
    subuh: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
}

export function JadwalSolat({ jadwal }: { jadwal: JadwalSholatData }) {
    const waktuSholat = [
        { nama: "Subuh", waktu: jadwal.subuh },
        { nama: "Dzuhur", waktu: jadwal.dzuhur },
        { nama: "Ashar", waktu: jadwal.ashar },
        { nama: "Maghrib", waktu: jadwal.maghrib },
        { nama: "Isya", waktu: jadwal.isya },
    ];
    return (
        <section className="relative -mt-16 z-10">
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1 p-3">
                            <span className="text-sm text-slate-500">Jadwal Sholat</span>
                            <span className="font-bold text-[#0A1E4A] text-center">{jadwal.tanggalHijriyah}</span>
                        </div>
                        {waktuSholat.map(item => (
                            <div key={item.nama} className="bg-[#FFF3EC] p-3 rounded-xl">
                                <p className="text-sm font-semibold text-[#FF9357]">{item.nama}</p>
                                <p className="font-bold text-2xl text-[#0A1E4A] tracking-wider">{item.waktu}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}