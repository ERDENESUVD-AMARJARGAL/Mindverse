import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logoImg from '../assets/images/logo.png'
import defaultAvatar from '../assets/images/boy.png'

const Sidebar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [isCollapsed, setIsCollapsed] = useState(user?.appearanceSettings?.sidebarCollapsed || false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [activePath, setActivePath] = useState(location.pathname.toLowerCase())

    useEffect(() => {
        setActivePath(location.pathname.toLowerCase())
    }, [location.pathname])

    const closeMobile = () => setIsMobileOpen(false)

    const handleLogout = (e) => {
        e.preventDefault()
        if (confirm('Та системээс гарахдаа итгэлтэй байна уу?')) {
            logout()
            navigate('/signup')
        }
    }

    const userName = user?.firstName || 'Хэрэглэгч'
    const userRole = user?.role || 'student'
    const avatar = user?.avatar?.startsWith('http') ? user.avatar : defaultAvatar

    const teacherLinks = [
        { path: '/teacher-main', icon: 'fa-home', label: 'Нүүр', title: 'Нүүр' },
        { path: '/teacher-classes', icon: 'fa-layer-group', label: 'Ангиуд', title: 'Ангиуд' },
        { path: '/teacher-students', icon: 'fa-user-graduate', label: 'Сурагчид', title: 'Сурагчид' },
        { path: '/teacher-analytics', icon: 'fa-chart-bar', label: 'Тайлан', title: 'Тайлан' },
        { path: '/teacher-market', icon: 'fa-store', label: 'Даалгаврын маркет', title: 'Асуулт маркет' },
    ]

    const studentLinks = [
        { path: '/student-main', icon: 'fa-home', label: 'Нүүр', title: 'Нүүр' },
        { path: '/student-classes', icon: 'fa-book-open', label: 'Хичээлүүд', title: 'Хичээлүүд' },
        { path: '/calendar', icon: 'fa-calendar-alt', label: 'Хуваарь', title: 'Хуваарь' },
        { path: '/market', icon: 'fa-store', label: 'Асуулт маркет', title: 'Маркет' },
    ]

    const links = userRole === 'teacher' ? teacherLinks : studentLinks

    return (
        <React.Fragment>
            <button className="sb-hamburger" onClick={() => setIsMobileOpen(true)} aria-label="Цэс нээх">
                <i className="fas fa-bars"></i>
            </button>

            <div
                className={`sb-overlay ${isMobileOpen ? 'show' : ''}`}
                onClick={closeMobile}
            ></div>

            <aside id="sidebar" className={`${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sb-top">
                    <img src={logoImg} alt="EduLearn" className="sb-logo-img" />
                    <button className="sb-toggle" onClick={() => setIsCollapsed(!isCollapsed)} aria-label="Sidebar хураах">
                        <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                    </button>
                </div>

                <nav>
                    <div className="sb-label">{userRole === 'teacher' ? 'Багшийн самбар' : 'Сурагчийн самбар'}</div>
                    <ul>
                        {links.map((item) => (
                            <li key={item.path} className={activePath === item.path ? 'active' : ''}>
                                <Link to={item.path} onClick={closeMobile} data-title={item.title}>
                                    <i className={`fas ${item.icon}`}></i>
                                    <span className="link-text">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sb-spacer"></div>
                <hr className="sb-divider" />

                <nav>
                    <div className="sb-label">Хаяг</div>
                    <ul>
                        <li className={activePath === '/settings' ? 'active' : ''}>
                            <Link to="/settings" onClick={closeMobile} data-title="Тохиргоо">
                                <i className="fas fa-cog"></i>
                                <span className="link-text">Тохиргоо</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="sb-bottom-profile">
                    <div className="sb-bp-avatar">
                        <img src={avatar} alt="Profile" className="sb-bp-img" />
                    </div>
                    <div className="sb-profile-text">
                        <div className="sb-user-name">{userName}</div>
                        <div className="sb-user-role">{userRole === 'teacher' ? 'Багш' : 'Сурагч'}</div>
                    </div>
                    <button className="sb-bp-logout" title="Гарах" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </aside>
        </React.Fragment>
    )
}

export default Sidebar
