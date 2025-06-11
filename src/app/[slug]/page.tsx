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

async function getLaporanKeuanganPage(slug: string) {
    try {
        const response = await api.get(`/api/public/financial-summary/${slug}`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil data laporan keuangan:", error);
        return { pemasukan: 0, pengeluaran: 0 }; // Kembalikan nilai default jika gagal
    }
}

async function getBeritaPage(slug: string) {
    try {
        const response = await api.get(`/api/public/news/recent/${slug}`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil data berita:", error);
        return []; // Kembalikan array kosong jika gagal
    }
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
    const { slug } = params;

    const masjidData = await getMasjidDataPage(slug);

    if (!masjidData) {
        notFound();
    }

    const [
        jadwalSholatData,
        beritaData,
        laporanKeuanganData,
        kegiatanData
    ] = await Promise.all([
        getJadwalSholatPage(slug),
        getBeritaPage(slug),
        getLaporanKeuanganPage(slug),
        getKegiatanPage(slug),
    ]);

    return (
        <>
            <HeroSection masjid={masjidData} />
            <JadwalSolat jadwal={jadwalSholatData} />
            <BeritaTerbaru berita={beritaData} slug={slug} />
            <LaporanKeuangan laporan={laporanKeuanganData} />
            <KegiatanMendatang kegiatan={kegiatanData} slug={slug} />
        </>
    );
}