const { HashRouter, Route, Switch, Redirect } = ReactRouterDOM;
const { useState, useEffect } = React;

window.API_URL = 'http://localhost:5000';

function App() {
    // 1. Анх ачаалахад хаягийг зөв авах
    const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
    
    const role = sessionStorage.getItem('user_role');
    const isAuthenticated = !!role;

    useEffect(() => {
        const handleHashChange = () => setCurrentPath(window.location.hash);
        window.addEventListener('hashchange', handleHashChange);

        // --- CSS СОЛИХ УХААЛАГ ЛОГИК ---
        const themeLink = document.getElementById('dynamic-theme');
        if (themeLink) {
            // 1. Хаягнаас хуудасны нэрийг салгаж авах (Жишээ нь: #/teacher-main -> teacher-main)
            let pathName = currentPath.replace('#/', '').split('?')[0];
            
            // 2. Хэрэв хаяг хоосон эсвэл нэвтрээгүй бол signup.css ачаална
            if (!pathName || pathName === '' || !isAuthenticated) {
                pathName = 'signup';
            }

            // 3. Файлын замыг үүсгэх (assets/css/хуудасны-нэр.css)
            // Жишээ нь: teacher-classes руу орвол teacher-classes.css-ийг уншина.
            const newCssPath = `assets/css/${pathName}.css`;

            // 4. Зөвхөн өөр байвал href-ийг шинэчилнэ
            if (themeLink.getAttribute('href') !== newCssPath) {
                themeLink.href = newCssPath;
            }
        }

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [currentPath, isAuthenticated]);

    // Sidebar харуулах нөхцөл (Signup хуудаснаас бусад бүх газар харуулна)
    const isAuthPage = currentPath === '' || currentPath === '#/' || currentPath.toLowerCase().includes('/signup');

    return (
        <HashRouter>
            <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
                
                {/* 3. Зөвхөн нэвтэрсэн БӨГӨӨД auth хуудас биш үед Sidebar харуулна */}
                {isAuthenticated && !isAuthPage && <Sidebar />}

                <main className={isAuthPage ? "full-screen" : "main-content"} style={{ flex: 1 }}>
                    <Switch>
                        {/* 4. Signup зам дээрх алдааг засах: path-ийг зөвхөн /signup болгоно */}
                        <Route path="/signup">
                            {isAuthenticated ? (
                                <Redirect to={role === 'teacher' ? "/teacher-main" : "/student-main"} />
                            ) : (
                                <SignupPage />
                            )}
                        </Route>

                        {/* --- БАГШИЙН ХУУДСУУД --- */}
                        <Route path="/teacher-main">
                            {isAuthenticated && role === 'teacher' ? <TeacherMain /> : <Redirect to="/signup" />}
                        </Route>
                        <Route path="/teacher-classes">
                            {isAuthenticated && role === 'teacher' ? <TeacherClasses /> : <Redirect to="/signup" />}
                        </Route>
                        <Route path="/teacher-students">
                            {isAuthenticated && role === 'teacher' ? <TeacherStudents /> : <Redirect to="/signup" />}
                        </Route>
                        <Route path="/teacher-analytics">
                            {isAuthenticated && role === 'teacher' ? <TeacherAnalytics /> : <Redirect to="/signup" />}
                        </Route>
                        <Route path="/teacher-market">
                            {isAuthenticated && role === 'teacher' ? <TeacherMarket /> : <Redirect to="/signup" />}
                        </Route>

                        {/* --- СУРАГЧИЙН ХУУДСУУД --- */}
                        <Route path="/student-main">
                            {isAuthenticated && role === 'student' ? <StudentMain /> : <Redirect to="/signup" />}
                        </Route>
                        <Route path="/student-classes">
                            {isAuthenticated && role === 'student' ? <StudentClasses /> : <Redirect to="/signup" />}
                        </Route>
                        <Route path="/calendar">
                            {isAuthenticated && role === 'student' ? <Calendar /> : <Redirect to="/signup" />}
                        </Route>
                        <Route path="/market">
                            {isAuthenticated && role === 'student' ? <Market /> : <Redirect to="/signup" />}
                        </Route>

                        {/* --- НИЙТЛЭГ ХУУДСУУД --- */}
                        <Route path="/settings">
                            {isAuthenticated ? <Settings /> : <Redirect to="/signup" />}
                        </Route>

                        {/* Анхдагч зам */}
                        <Redirect from="/" to="/signup" />
                    </Switch>
                </main>
            </div>
        </HashRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

