const Sidebar = () => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    
    const [isCollapsed, setIsCollapsed] = React.useState(user.appearanceSettings?.sidebarCollapsed || false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    const getPathFromHash = () => {
        const hash = window.location.hash; 
        return hash.startsWith('#') ? hash.slice(1).toLowerCase() : hash.toLowerCase() || '/signup';
    };

    const [activePath, setActivePath] = React.useState(getPathFromHash);
    
    const userName = user.firstName || 'Хэрэглэгч';
    const userRole = user.role || 'student';

    React.useEffect(() => {
        const onHashChange = () => setActivePath(getPathFromHash());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const navigateTo = (e, path) => {
        e.preventDefault();
        window.location.hash = path;
        setActivePath(path);
        if (window.innerWidth <= 768) setIsMobileOpen(false);
    };

    const handleLogout = (e) => {
        e.preventDefault(); 
        if (confirm('Та системээс гарахдаа итгэлтэй байна уу?')) {
            sessionStorage.clear();
            window.location.hash = '/signup'; 
            window.location.reload(); 
        }
    };

    return (
        <React.Fragment>
            <button className="sb-hamburger" onClick={() => setIsMobileOpen(true)}>
                <i className="fas fa-bars"></i>
            </button>

            <div 
                className={`sb-overlay ${isMobileOpen ? 'show' : ''}`} 
                onClick={() => setIsMobileOpen(false)}
            ></div>

            <aside id="sidebar" className={`${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sb-top">
                    <img src="assets/images/logo.png" alt="EduLearn" className="sb-logo-img" />
                    <button className="sb-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
                        <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                    </button>
                </div>

                {/* Сурагчийн цэс */}
                {userRole === 'student' && (
                    <nav>
                        <div className="sb-label">Сурагчийн самбар</div>
                        <ul>
                            <li className={activePath === '/student-main' ? 'active' : ''}>
                                <a href="#/student-main" onClick={(e) => navigateTo(e, '/student-main')} data-title="Нүүр">
                                    <i className="fas fa-home"></i><span className="link-text">Нүүр</span>
                                </a>
                            </li>
                            <li className={activePath === '/student-classes' ? 'active' : ''}>
                                <a href="#/student-classes" onClick={(e) => navigateTo(e, '/student-classes')} data-title="Хичээлүүд">
                                    <i className="fas fa-book-open"></i><span className="link-text">Хичээлүүд</span>
                                </a>
                            </li>
                            <li className={activePath === '/calendar' ? 'active' : ''}>
                                <a href="#/calendar" onClick={(e) => navigateTo(e, '/calendar')} data-title="Хуваарь">
                                    <i className="fas fa-calendar-alt"></i><span className="link-text">Хуваарь</span>
                                </a>
                            </li>
                            <li className={activePath === '/market' ? 'active' : ''}>
                                <a href="#/market" onClick={(e) => navigateTo(e, '/market')} data-title="Маркет">
                                    <i className="fas fa-store"></i><span className="link-text">Асуулт маркет</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                )}

                {/* Багшийн цэс */}
                {userRole === 'teacher' && (
                    <nav>
                        <div className="sb-label">Багшийн самбар</div>
                        <ul>
                            
                            <li className={activePath === '/teacher-main' ? 'active' : ''}>
                                <a href="#/teacher-main" onClick={(e) => navigateTo(e, '/teacher-main')} data-title="Нүүр">
                                    <i className="fas fa-home"></i><span className="link-text">Нүүр</span>
                                </a>
                            </li>
                            <li className={activePath === '/teacher-classes' ? 'active' : ''}>
                                <a href="#/teacher-classes" onClick={(e) => navigateTo(e, '/teacher-classes')} data-title="Ангиуд">
                                    <i className="fas fa-layer-group"></i><span className="link-text">Ангиуд</span>
                                </a>
                            </li>
                            <li className={activePath === '/teacher-students' ? 'active' : ''}>
                                <a href="#/teacher-students" onClick={(e) => navigateTo(e, '/teacher-students')} data-title="Сурагчид">
                                    <i className="fas fa-user-graduate"></i><span className="link-text">Сурагчид</span>
                                </a>
                            </li>
                            <li className={activePath === '/teacher-analytics' ? 'active' : ''}>
                                <a href="#/teacher-analytics" onClick={(e) => navigateTo(e, '/teacher-analytics')} data-title="Тайлан">
                                    <i className="fas fa-chart-bar"></i><span className="link-text">Тайлан</span>
                                </a>
                            </li>
                            <li className={activePath === '/teacher-market' ? 'active' : ''}>
                                <a href="#/teacher-market" onClick={(e) => navigateTo(e, '/teacher-market')} data-title="Асуулт Маркет">
                                    <i className="fas fa-store"></i><span className="link-text">Даалгаврын маркет</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                )}

                <div className="sb-spacer"></div>
                <hr className="sb-divider" />

                <nav>
                    <div className="sb-label">Хаяг</div>
                    <ul>
                        <li className={activePath === '/settings' ? 'active' : ''}>
                            <a href="#/settings" onClick={(e) => navigateTo(e, '/settings')} data-title="Тохиргоо">
                                <i className="fas fa-cog"></i><span className="link-text">Тохиргоо</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className="sb-bottom-profile">
                    <div className="sb-bp-avatar">
                        <img src={user.avatar || "assets/images/boy.png"} alt="Profile" className="sb-bp-img" />
                    </div>
                    <div className="sb-profile-text">
                        <div className="sb-user-name">{userName}</div>
                        <div className="sb-user-role">{userRole === 'teacher' ? 'Багш' : 'Сурагч'}</div>
                    </div>
                    <button className="sb-bp-logout" title="Гарах" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </aside>
        </React.Fragment>
    );
};

window.Sidebar = Sidebar;