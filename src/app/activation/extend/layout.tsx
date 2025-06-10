import { ReactNode } from "react";

// Layout ini juga hanya me-render children
export default function ExtendLayout({ children }: { children: ReactNode }) {
    return (
        <section>
            {children}
        </section>
    );
}