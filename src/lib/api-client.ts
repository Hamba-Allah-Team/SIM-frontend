import api from "./api"; // Impor instance dasar

// Interceptor hanya akan ditambahkan jika kode berjalan di sisi klien (browser)
if (typeof window !== "undefined") {
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
}

export const apiClient = api;