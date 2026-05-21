import axios from 'axios'

export const API_BASE_URL = '/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => config)

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
