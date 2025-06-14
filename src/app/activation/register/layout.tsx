import { ReactNode } from "react";

// Layout ini hanya akan me-render children tanpa Navbar atau Footer
export default function RegisterLayout({ children }: { children: ReactNode }) {
    return (
        <section>
            {children}
        </section>
    );
}