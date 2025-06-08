import { notFound } from 'next/navigation';
import HeroSection from './components/HeroSection';
import { JadwalSolat } from './components/JadwalSolat';
import { BeritaTerbaru } from './components/BeritaTerbaru';
import { LaporanKeuangan } from './components/LaporanKeuangan';
import { KegiatanMendatang } from './components/KegiatanMendatang';
import api from '@/lib/api';

// --- DATA FETCHING FUNCTIONS ---
async function getMasjidDataPage(slug: string) {
    try {
        const response = await api.get(`/api/public/mosques/${slug}`);
        return response.data.data;
    } catch {
        return null;
    }
}

async function getJadwalSholatPage(slug: string) {
    try {
        const response = await api.get(`/api/public/prayertimes/${slug}`);
        return response.data;
    } catch (error) {
        console.error("Gagal fetch jadwal sholat dari backend:", error);
        // Kembalikan data default jika API gagal
        return { tanggalHijriyah: "-", subuh: "--:--", dzuhur: "--:--", ashar: "--:--", maghrib: "--:--", isya: "--:--" };
    }
}

// 👈 Fungsi ini diperbarui untuk memanggil endpoint baru
async function getLaporanKeuanganPage(slug: string) {
    try {
        const response = await api.get(`/api/public/financial-summary/${slug}`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil data laporan keuangan:", error);
        return { pemasukan: 0, pengeluaran: 0 }; // Kembalikan nilai default jika gagal
    }
}

async function getBeritaPage(
    // masjidId: number
) {
    return [
        { id: 1, img: 'https://placehold.co/600x400/EBF1F4/888?text=Berita+Utama', title: 'Pelaksanaan Sholat Idul Adha 1446 H', date: '2 hari lalu', excerpt: 'Kegiatan sholat Idul Adha berjalan dengan khidmat dan diikuti oleh ribuan jamaah...' },
        { id: 2, img: 'https://placehold.co/150x100/EBF1F4/888?text=Berita', title: 'Kajian Rutin Sabtu Pagi', date: '3 hari lalu' },
        { id: 3, img: 'https://placehold.co/150x100/EBF1F4/888?text=Berita', title: 'Penyaluran Zakat Fitrah', date: '5 hari lalu' },
        { id: 4, img: 'https://placehold.co/150x100/EBF1F4/888?text=Berita', title: 'Program Buka Puasa Bersama', date: '1 minggu lalu' },
    ];
}

async function getKegiatanPage(slug: string) {
    try {
        const response = await api.get(`/api/public/activities/upcoming/${slug}`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil data kegiatan:", error);
        return []; // Kembalikan array kosong jika gagal
    }
}

export default async function MasjidPage({ params }: { params: { slug: string } }) {
    const masjidData = await getMasjidDataPage(params.slug);

    if (!masjidData) {
        notFound();
    }

    const [
        jadwalSholatData,
        beritaData,
        laporanKeuanganData,
        kegiatanData
    ] = await Promise.all([
        getJadwalSholatPage(params.slug),
        getBeritaPage(
            // masjidData.mosque_id
        ),
        getLaporanKeuanganPage(params.slug),
        getKegiatanPage(params.slug),
    ]);

    return (
        <>
            <HeroSection masjid={masjidData} />
            <JadwalSolat jadwal={jadwalSholatData} />
            <BeritaTerbaru berita={beritaData} slug={params.slug} />
            <LaporanKeuangan laporan={laporanKeuanganData} />
            <KegiatanMendatang kegiatan={kegiatanData} slug={params.slug} />
        </>
    );
}