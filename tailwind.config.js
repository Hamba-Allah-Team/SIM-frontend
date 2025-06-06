// 👈 Mengimpor plugin dengan sintaks ESM
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
// Menggunakan const untuk konfigurasi objek
const config = {
    // 1. Mengaktifkan dark mode berbasis kelas
    // Ini memberitahu Tailwind untuk mencari kelas 'dark' pada elemen <html>
    // dan menerapkan styling dark mode jika ada.
    darkMode: "class",

    // 2. Menentukan file mana yang akan dipindai oleh Tailwind
    // Tailwind akan mencari kelas utilitas di semua file ini untuk menghasilkan CSS yang diperlukan.
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}', // Pastikan path ini sesuai dengan struktur proyek Anda
    ],
    prefix: "",

    // 3. Konfigurasi tema
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            // 4. Definisi warna dari variabel CSS (yang diatur oleh shadcn/ui di globals.css)
            // Ini memungkinkan warna-warna komponen shadcn/ui berubah secara dinamis
            // saat tema (terang/gelap) diganti.
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },

    // 5. Plugin untuk animasi (sekarang menggunakan variabel yang diimpor)
    plugins: [tailwindcssAnimate],
};

// 👈 Mengekspor konfigurasi dengan sintaks ESM
export default config;
