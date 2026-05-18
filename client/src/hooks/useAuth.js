// useAuth нь AuthContext-ээс шууд re-export хийж байна
// Тусдаа файл болгон байлгах нь import замыг богиносгоно
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}