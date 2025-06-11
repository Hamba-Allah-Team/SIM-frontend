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
    const { slug } = await params;
    const masjidData = await getMasjidLayoutData(slug);

    return (
        <>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/modern-normalize@2.0.0/modern-normalize.min.css" />
            <div className="relative flex flex-col min-h-screen bg-[#F8F9FA]">
                <Navbar slug={slug} />
                <main className="flex-grow">
                    {children}
                </main>
                {masjidData && <Footer masjidData={masjidData} />}
            </div>
        </>
    );
}