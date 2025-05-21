// hooks/services/useUserProfile.ts
import { useEffect, useState } from "react"
import api from "@/lib/api"
import axios from "axios"

interface UserProfile {
    id: number
    name: string
    email: string
    role: "admin" | "superadmin"
    // tambahkan properti lain sesuai data dari backend
}

export function useUserProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get<UserProfile>("/api/users/profile")
                setProfile(response.data)
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const serverMsg = err.response?.data?.message
                    setError(serverMsg || "Gagal mengambil profil pengguna.")
                } else {
                    setError("Terjadi kesalahan tak terduga.")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    return { profile, loading, error }
}
