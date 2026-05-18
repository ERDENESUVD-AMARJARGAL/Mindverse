import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import PrivateRoute from './components/PrivateRoute'
import Sidebar from './components/Sidebar'

// Pages (Бүгдийг жижиг үсэг, зураастай стандартаар импортлов)
import SignupPage from './pages/signup'
import StudentMain from './pages/student-main'
import StudentClasses from './pages/student-classes'
import TeacherMain from './pages/teacher-main'
import TeacherClasses from './pages/teacher-classes'
import TeacherStudents from './pages/teacher-students'
import TeacherAnalytics from './pages/teacher-analytics'
import TeacherMarket from './pages/teacher-market'
import Market from './pages/market'
import Calendar from './pages/calendar'
import Settings from './pages/settings'

function App() {
    const { user } = useAuth()

    return (
        <div style={{ minHeight: '100vh' }}>
            {user && <Sidebar user={user} />}
            <main className={user ? 'main-content' : ''}>
                <Routes>
                    {/* Нэвтрэх хуудас */}
                    <Route
                        path="/signup"
                        element={
                            user
                                ? <Navigate to={user.role === 'teacher' ? '/teacher-main' : '/student-main'} replace />
                                : <SignupPage />
                        }
                    />

                    {/* Сурагчийн хуудсууд */}
                    <Route path="/student-main" element={
                        <PrivateRoute role="student"><StudentMain /></PrivateRoute>
                    } />
                    <Route path="/student-classes" element={
                        <PrivateRoute role="student"><StudentClasses /></PrivateRoute>
                    } />
                    <Route path="/market" element={
                        <PrivateRoute role="student"><Market /></PrivateRoute>
                    } />
                    <Route path="/calendar" element={
                        <PrivateRoute role="student"><Calendar /></PrivateRoute>
                    } />

                    {/* Багшийн хуудсууд */}
                    <Route path="/teacher-main" element={
                        <PrivateRoute role="teacher"><TeacherMain /></PrivateRoute>
                    } />
                    <Route path="/teacher-classes" element={
                        <PrivateRoute role="teacher"><TeacherClasses /></PrivateRoute>
                    } />
                    <Route path="/teacher-students" element={
                        <PrivateRoute role="teacher"><TeacherStudents /></PrivateRoute>
                    } />
                    <Route path="/teacher-analytics" element={
                        <PrivateRoute role="teacher"><TeacherAnalytics /></PrivateRoute>
                    } />
                    <Route path="/teacher-market" element={
                        <PrivateRoute role="teacher"><TeacherMarket /></PrivateRoute>
                    } />

                    {/* Нийтлэг */}
                    <Route path="/settings" element={
                        <PrivateRoute><Settings /></PrivateRoute>
                    } />

                    {/* Default */}
                    <Route path="/" element={<Navigate to="/signup" replace />} />
                    <Route path="*" element={<Navigate to="/signup" replace />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
