import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// role='teacher' эсвэл 'student' дамжуулж болно
// role дамжуулаагүй бол зөвхөн нэвтэрсэн эсэхийг шалгана
function PrivateRoute({ children, role }) {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/signup" replace />
    }

    if (role && user.role !== role) {
        return <Navigate to="/signup" replace />
    }

    return children
}

export default PrivateRoute