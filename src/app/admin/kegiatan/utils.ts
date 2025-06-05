import api from "@/lib/api"; // Pastikan path ini benar
import { Activity } from "./types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// Fungsi untuk mendapatkan URL gambar yang lengkap
export const getFullImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) {
        return null;
    }
    // Jika imagePath sudah merupakan URL absolut (misalnya dari Azure Storage)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // Jika imagePath adalah path relatif dari backend (misalnya /uploads/...)
    return `${API_BASE_URL}${imagePath}`;
};


export async function getActivities(): Promise<Activity[]> {
    try {
        // Menggunakan endpoint yang sudah ada di backend Anda
        // Endpoint ini memerlukan mosque_id dari user yang login,
        // yang akan ditangani oleh backend berdasarkan token JWT.
        const response = await api.get("/api/activities");
        // Pastikan backend mengembalikan array Activity
        return response.data as Activity[];
    } catch (error) {
        console.error("Gagal mengambil daftar kegiatan:", error);
        throw error; // Lempar error agar bisa ditangani di komponen
    }
}

export async function getActivityById(activityId: number): Promise<Activity | null> {
    try {
        const response = await api.get(`/api/activities/${activityId}`);
        return response.data as Activity;
    } catch (error) {
        console.error(`Gagal mengambil kegiatan dengan ID ${activityId}:`, error);
        // Kembalikan null atau lempar error tergantung kebutuhan error handling
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
}

export async function createActivity(payload: FormData): Promise<Activity> {
    try {
        const response = await api.post("/api/activities", payload, {
            headers: {
                "Content-Type": "multipart/form-data", // Penting untuk upload file
            },
        });
        return response.data as Activity;
    } catch (error) {
        console.error("Gagal membuat kegiatan:", error);
        throw error;
    }
}

export async function updateActivity(activityId: number, payload: FormData): Promise<Activity> {
    try {
        const response = await api.put(`/api/activities/${activityId}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data", // Penting jika ada file baru
            },
        });
        return response.data as Activity;
    } catch (error) {
        console.error(`Gagal memperbarui kegiatan dengan ID ${activityId}:`, error);
        throw error;
    }
}

export async function deleteActivity(activityId: number): Promise<void> {
    try {
        await api.delete(`/api/activities/${activityId}`);
    } catch (error) {
        console.error(`Gagal menghapus kegiatan dengan ID ${activityId}:`, error);
        throw error;
    }
}