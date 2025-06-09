import ActivationNavbar from "@/components/layout/NavbarLanding";
import LandingFooter from "@/components/layout/FooterLanding";
import { ReactNode } from "react";

export default function ActivationLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen bg-white">
            <ActivationNavbar />
            <main>
                {children}
            </main>
            <LandingFooter />
        </div>
    );
}
