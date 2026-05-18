    import { createContext, useState } from 'react'

    const AuthContext = createContext(null)

    export function AuthProvider({ children }) {
        const [user, setUser] = useState(() => {
            try {
                return JSON.parse(sessionStorage.getItem('user') || 'null')
            } catch {
                return null
            }
        })

        const login = (userData) => {
            sessionStorage.setItem('user', JSON.stringify(userData))
            sessionStorage.setItem('user_id', userData.id)
            sessionStorage.setItem('user_role', userData.role)
            setUser(userData)
        }

        const logout = () => {
            sessionStorage.clear()
            setUser(null)
        }

        const updateUser = (updates) => {
            const updated = { ...user, ...updates }
            sessionStorage.setItem('user', JSON.stringify(updated))
            setUser(updated)
        }

        return (
            <AuthContext.Provider value={{ user, login, logout, updateUser }}>
                {children}
            </AuthContext.Provider>
        )
    }

    export default AuthContext
