// services/api.ts

import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

export default api;

// import axios from "axios";

// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
// });

// // Interceptor hanya akan ditambahkan jika kode berjalan di sisi klien (browser)
// if (typeof window !== "undefined") {
//     api.interceptors.request.use(
//         (config) => {
//             const token = localStorage.getItem("token");
//             if (token && config.headers) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//             return config;
//         },
//         (error) => Promise.reject(error)
//     );
// }

// export default api;

// import axios from "axios"

// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
// })

// // Interceptor untuk menyisipkan token secara otomatis
// api.interceptors.request.use(
//     (config) => {
//         const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
//         console.log("Token dipakai:", token)
//         if (token && config.headers) {
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         return config
//     },
//     (error) => Promise.reject(error)
// )

// export default api
