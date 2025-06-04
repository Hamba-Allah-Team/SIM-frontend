/**
 * Interface untuk objek Kegiatan (Activity) yang diterima dari backend
 * dan digunakan di frontend.
 */
export interface Activity {
    activities_id: number;
    mosque_id: number;
    event_name: string;
    image: string | null; // Path atau URL gambar
    event_description: string | null;
    start_date: string; // ISO string date
    end_date: string | null; // ISO string date
    start_time: string; // Format HH:mm:ss atau HH:mm
    end_time: string | null; // Format HH:mm:ss atau HH:mm
    user_id: number | null;
    created_at: string; // ISO string date
    updated_at: string; // ISO string date
    // Tambahkan properti user jika backend mengirimkannya setelah join
    user?: {
        name: string;
    };
}

/**
 * Interface untuk payload saat membuat Kegiatan baru.
 * Karena ada file, kita akan menggunakan FormData, tapi ini untuk referensi field.
 */
export interface CreateActivityPayload {
    event_name: string;
    event_description?: string;
    start_date: string;
    start_time: string;
    end_date?: string;
    end_time?: string;
    activityImage?: File | null; // Nama field untuk file gambar
}

export interface UpdateActivityPayload extends Partial<CreateActivityPayload> {
    // activityImage bisa File (jika diganti) atau string (jika path lama dipertahankan/dihapus tanpa ganti)
    // atau null (jika gambar dihapus)
    event_name: string;
    event_description?: string;
    start_date: string;
    start_time: string;
    end_date?: string;
    end_time?: string;
    activityImage?: File | null; // Bisa File baru, path lama, atau null jika dihapus
}