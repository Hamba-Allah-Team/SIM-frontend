import { useEffect, useState } from "react"
import api from "@/lib/api"

interface Mosque {
    id: number
    name: string
    // tambahkan properti lain sesuai struktur di backend
}

export interface UserProfile {
    id: number
    name: string
    email: string
    role: "admin" | "superadmin"
    mosque?: Mosque
    // tambahkan properti lain jika ada
}

export default function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get<UserProfile>("/api/users/profile")
                setProfile(response.data)
            } catch (err: any) {
                setError(err?.response?.data?.message || "Gagal mengambil profil")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    return { profile, loading, error }
}
