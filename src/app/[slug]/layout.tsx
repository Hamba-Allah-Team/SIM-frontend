import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";
import api from "@/lib/api";

// Fungsi untuk mengambil data spesifik masjid untuk layout (misal, untuk footer)
async function getMasjidLayoutData(slug: string) {
    try {
        const response = await api.get(`/api/public/mosques/${slug}`);
        return response.data.data;
    } catch (error) {
        console.error("Gagal mengambil data layout masjid:", error);
        return null;
    }
}

export default async function GuestLayout({ children, params }: { children: ReactNode, params: { slug: string } }) {
    const masjidData = await getMasjidLayoutData(params.slug);

    return (
        <div className="relative min-h-screen bg-[#F8F9FA]">
            <Navbar />
            <main>
                {children}
            </main>
            {masjidData && <Footer masjidData={masjidData} />}
        </div>
    );
}