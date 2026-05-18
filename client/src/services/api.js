import axios from 'axios'

// vite.config.js дахь proxy-р дамжин localhost:3000/api руу очно
const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
})

// Request interceptor — хэрэв token хэрэгтэй болвол энд нэм
api.interceptors.request.use((config) => {
    return config
})

// Response interceptor — 401 бол login руу шилжүүлэх
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.clear()
            window.location.hash = '/signup'
        }
        return Promise.reject(error)
    }
)

export default api