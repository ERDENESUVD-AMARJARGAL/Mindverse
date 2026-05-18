import { useState } from 'react'

    function Settings() {
        const userId = sessionStorage.getItem('user_id');
        const [activePanel, setActivePanel] = useState('account');
        const [flash, setFlash] = useState({ acc: false, pw: false, notif: false, app: false });
        const [isLoading, setIsLoading] = useState(false);

        // ── Хэрэглэгчийн мэдээллийг session-оос авах ──
        const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user') || '{}'));
        
        const [form, setForm] = useState({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || ''
        });

        const [passwords, setPasswords] = useState({ old: '', new1: '', new2: '' });
        const [darkMode, setDarkMode] = useState(user.appearanceSettings?.darkMode || false);
        const [notif, setNotif] = useState(user.notificationSettings || {
            newAssignment: true, examReminder: true, gradePosted: true, classUpdate: true
        });

        // ── Туслах функцүүд ──
        const triggerFlash = (key) => {
            setFlash(prev => ({ ...prev, [key]: true }));
            setTimeout(() => setFlash(prev => ({ ...prev, [key]: false })), 2500);
        };

        const handleFormChange = (e) => {
            setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        };

        // ── 1. Бүртгэл хадгалах (DB ruu PATCH hiih) ──
        const saveAccount = async () => {
            if (!form.firstName || !form.lastName) return alert('Нэр, овогоо оруулна уу!');
            if (!form.email.includes('@')) return alert('Зөв имэйл оруулна уу!');

            setIsLoading(true);
            try {
                const payload = { firstName: form.firstName, lastName: form.lastName, email: form.email };
                
                // 1. DB шинэчлэх
                await fetch(`${window.API_URL}/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                // 2. Session шинэчлэх (Sidebar болон бусад хуудас шууд харах)
                const updatedUser = { ...user, ...payload };
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                
                triggerFlash('acc');
            } catch (err) {
                alert('Хадгалахад алдаа гарлаа: ' + err.message);
            }
            setIsLoading(false);
        };

        // ── 2. Нууц үг солих (DB ruu PATCH hiih) ──
        const changePassword = async () => {
            if (!passwords.old) return alert('Одоогийн нууц үгээ оруулна уу!');
            if (passwords.new1.length < 6) return alert('Нууц үг 6-аас дээш тэмдэгт байх ёстой!');
            if (passwords.new1 !== passwords.new2) return alert('Шинэ нууц үгүүд таарахгүй байна!');

            setIsLoading(true);
            try {
                // TODO: Authentication байхгүй учир энд хуучин нууц үгийг шалгах боломжгүй, шууд солих үйлдэл хийв.
                await fetch(`${window.API_URL}/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: passwords.new1 })
                });
                
                setPasswords({ old: '', new1: '', new2: '' });
                triggerFlash('pw');
            } catch (err) {
                alert('Алдаа гарлаа: ' + err.message);
            }
            setIsLoading(false);
        };

        // ── 3. Мэдэгдэлийн тохиргоо (DB ruu PATCH) ──
        const toggleNotif = async (key) => {
            const newNotif = { ...notif, [key]: !notif[key] };
            setNotif(newNotif);
            
            try {
                const updatedUser = { ...user, notificationSettings: newNotif };
                await fetch(`${window.API_URL}/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ notificationSettings: newNotif })
                });
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                triggerFlash('notif');
            } catch (err) {
                console.error(err);
            }
        };

        // ── 4. Харагдацын тохиргоо ──
        const toggleDark = async (checked) => {
            setDarkMode(checked);
            document.body.classList.toggle('dark', checked);
            
            try {
                const newAppSettings = { ...user.appearanceSettings, darkMode: checked };
                const updatedUser = { ...user, appearanceSettings: newAppSettings };
                await fetch(`${window.API_URL}/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ appearanceSettings: newAppSettings })
                });
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            } catch (err) {
                console.error(err);
            }
        };

        // ── 5. Аюултай бүс ──
        const deleteAccount = () => {
            if (!confirm('Анхааруулга: Таны бүртгэл болон холбогдох бүх өгөгдөл устгагдах болно!\nҮргэлж үү?')) return;
            
            fetch(`${window.API_URL}/users/${userId}`, { method: 'DELETE' })
                .then(() => {
                    sessionStorage.clear();
                    window.location.hash = '/signup'; // Хуудас руу үсрэх
                    window.location.reload();
                })
                .catch(() => alert('Устгахад алдаа гарлаа'));
        };

        return (
            <div className="page">
                <div className="section-head">
                    <div>
                        <h2>Тохиргоо</h2>
                        <p style={{ marginTop: '4px' }}>Бүртгэл, мэдэгдэл болон аюулгүй байдлын тохиргоо</p>
                    </div>
                </div>

                <div className="settings-wrap">
                    {/* ── NAV ── */}
                    <nav className="settings-nav">
                        <div className={`nav-item ${activePanel === 'account' ? 'active' : ''}`} onClick={() => setActivePanel('account')}>
                            <i className="fas fa-user"></i> Бүртгэл
                        </div>
                        <div className={`nav-item ${activePanel === 'password' ? 'active' : ''}`} onClick={() => setActivePanel('password')}>
                            <i className="fas fa-lock"></i> Нууц үг
                        </div>
                        <div className={`nav-item ${activePanel === 'notifications' ? 'active' : ''}`} onClick={() => setActivePanel('notifications')}>
                            <i className="fas fa-bell"></i> Мэдэгдэл
                        </div>
                        <div className={`nav-item ${activePanel === 'appearance' ? 'active' : ''}`} onClick={() => setActivePanel('appearance')}>
                            <i className="fas fa-palette"></i> Харагдац
                        </div>
                        <div className={`nav-item ${activePanel === 'danger' ? 'active' : ''}`} onClick={() => setActivePanel('danger')}>
                            <i className="fas fa-exclamation-triangle"></i> Аюултай бүс
                        </div>
                    </nav>

                    {/* ── PANELS ── */}
                    <div className="settings-content">
                        
                        {/* Account Panel */}
                        {activePanel === 'account' && (
                            <div className="settings-panel active">
                                <div className="s-card">
                                    <h3>Хувийн мэдээлэл</h3>
                                    <p className="s-sub">Нэр, имэйл болон профайлын тохиргоо</p>
                                    
                                    <div className="field-row">
                                        <div className="field">
                                            <label>Овог</label>
                                            <input type="text" name="lastName" value={form.lastName} onChange={handleFormChange} placeholder="Бат" />
                                        </div>
                                        <div className="field">
                                            <label>Нэр</label>
                                            <input type="text" name="firstName" value={form.firstName} onChange={handleFormChange} placeholder="Болд" />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label>Имэйл хаяг</label>
                                        <input type="email" name="email" value={form.email} onChange={handleFormChange} placeholder="email@example.com" />
                                    </div>
                                    
                                    <button className="save-btn" onClick={saveAccount} disabled={isLoading}>
                                        {isLoading ? 'Хадгалах...' : 'Хадгалах'}
                                    </button>
                                    <span className="save-confirm" style={{ opacity: flash.acc ? 1 : 0 }}>
                                        <i className="fas fa-check"></i> Хадгалагдлаа
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Password Panel */}
                        {activePanel === 'password' && (
                            <div className="settings-panel active">
                                <div className="s-card">
                                    <h3>Нууц үг солих</h3>
                                    <p className="s-sub">Аюулгүй байдлын үүднээс нууц үгээ тогтмол солиорой</p>
                                    
                                    <div className="field">
                                        <label>Одоогийн нууц үг</label>
                                        <input type="password" value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} placeholder="••••••••" />
                                    </div>
                                    <div className="field">
                                        <label>Шинэ нууц үг</label>
                                        <input type="password" value={passwords.new1} onChange={e => setPasswords({...passwords, new1: e.target.value})} placeholder="Хамгийн багадаа 6 тэмдэгт" />
                                    </div>
                                    <div className="field">
                                        <label>Шинэ нууц үг давтах</label>
                                        <input type="password" value={passwords.new2} onChange={e => setPasswords({...passwords, new2: e.target.value})} placeholder="••••••••" />
                                    </div>
                                    
                                    <button className="save-btn" onClick={changePassword} disabled={isLoading}>
                                        {isLoading ? 'Шалгаж байна...' : 'Нууц үг солих'}
                                    </button>
                                    <span className="save-confirm" style={{ opacity: flash.pw ? 1 : 0 }}>
                                        <i className="fas fa-check"></i> Амжилттай солигдлоо
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Notifications Panel */}
                        {activePanel === 'notifications' && (
                            <div className="settings-panel active">
                                <div className="s-card">
                                    <h3>Мэдэгдэлийн тохиргоо</h3>
                                    <p className="s-sub">Ямар мэдэгдэл хүлээхийг сонгоно уу</p>
                                    
                                    <div className="toggle-row">
                                        <div className="toggle-info">
                                            <h4>Шинэ даалгавар</h4>
                                            <p>Багш шинэ даалгавар тавих үед мэдэгдэх</p>
                                        </div>
                                        <label className="toggle">
                                            <input type="checkbox" checked={notif.newAssignment} onChange={() => toggleNotif('newAssignment')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>

                                    <div className="toggle-row">
                                        <div className="toggle-info">
                                            <h4>Шалгалтын сануулга</h4>
                                            <p>Шалгалт болохоос өмнө сануулга өгөх</p>
                                        </div>
                                        <label className="toggle">
                                            <input type="checkbox" checked={notif.examReminder} onChange={() => toggleNotif('examReminder')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>

                                    <div className="toggle-row">
                                        <div className="toggle-info">
                                            <h4>Дүн нээлт</h4>
                                            <p>Оноо, дүнгүүд нээгдэх үед мэдэгдэх</p>
                                        </div>
                                        <label className="toggle">
                                            <input type="checkbox" checked={notif.gradePosted} onChange={() => toggleNotif('gradePosted')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>

                                    <div className="toggle-row">
                                        <div className="toggle-info">
                                            <h4>Ангины шинэчлэл</h4>
                                            <p>Хичээл, материалын өөрчлөлтүүдийн тухай</p>
                                        </div>
                                        <label className="toggle">
                                            <input type="checkbox" checked={notif.classUpdate} onChange={() => toggleNotif('classUpdate')} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>

                                    <button className="save-btn" onClick={() => triggerFlash('notif')} style={{ marginTop: '20px' }}>
                                        Хадгалах
                                    </button>
                                    <span className="save-confirm" style={{ opacity: flash.notif ? 1 : 0 }}>
                                        <i className="fas fa-check"></i> Хадгалагдлаа
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Appearance Panel */}
                        {activePanel === 'appearance' && (
                            <div className="settings-panel active">
                                <div className="s-card">
                                    <h3>Харагдац</h3>
                                    <p className="s-sub">Дэлгэцийн тохиргоо</p>
                                    
                                    <div className="toggle-row">
                                        <div className="toggle-info">
                                            <h4>Харанхуй горим</h4>
                                            <p>Харанхуй өнгөний схем ашиглах</p>
                                        </div>
                                        <label className="toggle">
                                            <input type="checkbox" checked={darkMode} onChange={e => toggleDark(e.target.checked)} />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Danger Panel */}
                        {activePanel === 'danger' && (
                            <div className="settings-panel active">
                                <div className="s-card">
                                    <h3 style={{ color: '#ef4444' }}>Аюултай бүс</h3>
                                    <p className="s-sub">Эдгээр үйлдлүүд буцаах боломжгүй</p>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                                        <div className="danger-item">
                                            <div>
                                                <div style={{ fontWeight: 600 }}>Бүртгэл устгах</div>
                                                <div style={{ fontSize: '12px', color: '#64748b' }}>Таны бүртгэл болон холбогдох бүх өгөгдөл үүсгэгдэнэ</div>
                                            </div>
                                            <button className="danger-btn" onClick={deleteAccount}>
                                                <i className="fas fa-trash"></i> Бүртгэл устгах
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        );
    }
export default Settings


