import { CheckCircle } from "lucide-react";
import { Card as PricingCard, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button as PricingButton } from "@/components/ui/button";
import Link from "next/link";

export default function PricingSection() {
    const features = [
        "Masa Aktif 30 Hari",
        "Fitur Keuangan",
        "Fitur Konten",
        "Fitur Reservasi",
        "Layanan Penuh",
    ];

    return (
        <section id="harga" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#0A1E4A]">Harga Paket</h2>
                    <p className="text-slate-500 mt-2">Pilih paket yang sesuai dengan kebutuhan Anda.</p>
                </div>
                <div className="flex justify-center">
                    <PricingCard className="w-full max-w-sm shadow-2xl rounded-2xl overflow-hidden border-2 border-[#FF9357] hover:shadow-orange-500/20 transition-shadow">
                        <CardHeader className="bg-white p-6 text-center">
                            <div className="inline-block mx-auto bg-orange-100 text-[#FF9357] px-4 py-1 rounded-full text-sm font-semibold mb-4">
                                Paket Bulanan
                            </div>
                            <CardTitle className="text-5xl font-extrabold text-[#0A1E4A]">Rp 50.000</CardTitle>
                            <CardDescription className="text-slate-500 line-through">Rp 150.000</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 bg-slate-50/50">
                            <ul className="space-y-4">
                                {features.map(feature => (
                                    <li key={feature} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="p-6 bg-white">
                            <PricingButton asChild className="w-full bg-[#FF9357] hover:bg-[#FF9357]/90 text-white font-semibold py-6 text-base rounded-full">
                                <Link href="/activation/register">Langganan Sekarang</Link>
                            </PricingButton>
                        </CardFooter>
                    </PricingCard>
                </div>
            </div>
        </section>
    );
}