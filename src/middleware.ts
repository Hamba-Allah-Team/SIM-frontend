import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Definisikan tipe untuk payload JWT
interface AppJWTPayload {
    id: number;
    role: string;
}

async function verifyToken(token: string): Promise<AppJWTPayload | null> {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET tidak diatur di environment variables.");
        return null;
    }
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // 👈 PERBAIKAN: Akses properti secara langsung dan buat objek baru
        // Ini memastikan tipe data yang dikembalikan sesuai dengan interface kita
        return {
            id: payload.id as number,
            role: payload.role as string
        };
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return null;
    }
}


// Fungsi middleware utama
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Jika mencoba mengakses halaman yang dilindungi tanpa token
    if ((pathname.startsWith('/admin') || pathname.startsWith('/superadmin')) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Jika sudah login dan mencoba mengakses halaman login
    if (pathname.startsWith('/login') && token) {
        const payload = await verifyToken(token);

        if (payload) {
            if (payload.role === 'superadmin') {
                return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
            }
            if (payload.role === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
        }
        // Jika token tidak valid atau role tidak ada, hapus cookie dan arahkan ke login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('token');
        return response;
    }

    return NextResponse.next();
}

// Konfigurasi Matcher
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\..*).*)',
    ],
}
