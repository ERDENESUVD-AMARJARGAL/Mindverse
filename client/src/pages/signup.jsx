import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

function SignupPage() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [view, setView] = useState('login')
    const [role, setRole] = useState('student')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrorMessage('')
    }

    const toggleView = (e, targetView) => {
        e.preventDefault()
        setView(targetView)
        setErrorMessage('')
    }

    const handleAuth = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        setIsLoading(true)

        try {
            if (view === 'login') {
                const { data } = await api.post('/login', {
                    email: formData.email,
                    password: formData.password
                })

                const user = data.user

                if (user.role !== role) {
                    setErrorMessage(`Та ${role === 'student' ? 'сурагчаар' : 'багшаар'} бүртгэлгүй байна!`)
                    setIsLoading(false)
                    return
                }

                login(user)

                navigate(user.role === 'teacher' ? '/teacher-main' : '/student-main')

            } else {
                if (formData.password !== formData.confirmPassword) {
                    setErrorMessage('Нууц үг зөрүүтэй байна!')
                    setIsLoading(false)
                    return
                }

                const newUser = {
                    id: `${role === 'teacher' ? 'teacher' : 'stu'}_${Date.now()}`,
                    name: `${formData.lastName} ${formData.firstName}`,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    role: role,
                    balance: 0,
                    classId: [],
                    avatar: 'assets/images/boy.png'
                }

                await api.post('/users', newUser)
                alert('Амжилттай бүртгэгдлээ. Одоо нэвтэрнэ үү.')
                setView('login')
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.error || 'Сервертэй холбогдоход алдаа гарлаа.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`container ${role === 'teacher' ? 'teacher-mode-active' : ''}`}>

            {/* ══ LEFT PANEL ══ */}
            <div className={`left ${role === 'teacher' ? 'teacher-mode' : ''}`}>
                <div className="left-content">
                    <div className="left-brand">
                        <div className="brand-icon"><i className="fas fa-graduation-cap"></i></div>
                        EduLearn
                    </div>
                    <h2 className="left-headline">Мэдлэгийн замд<br /><span>нэгдээрэй</span></h2>
                    <p className="left-sub">Мэргэжлийн багш нарын хичээлд нэвтэрч, мэдлэгээ тэлээрэй.</p>

                    <div className="left-features">
                        <div className="feat-item">
                            <div className="feat-icon"><i className="fas fa-user-graduate"></i></div>
                            <div>
                                <div className="feat-title">Сурагчаар нэгдэх</div>
                                <div className="feat-desc">Хичээл, материал, шалгалтад нэвтрэх</div>
                            </div>
                        </div>
                        <div className="feat-item">
                            <div className="feat-icon"><i className="fas fa-chalkboard-teacher"></i></div>
                            <div>
                                <div className="feat-title">Багшаар нэгдэх</div>
                                <div className="feat-desc">Анги үүсгэж, шалгалт тавих боломж</div>
                            </div>
                        </div>
                        <div className="feat-item">
                            <div className="feat-icon"><i className="fas fa-shield-alt"></i></div>
                            <div>
                                <div className="feat-title">Найдвартай платформ</div>
                                <div className="feat-desc">Хаягаа нэгэн удаа бүртгүүлснээр бүгд нэвтрэх</div>
                            </div>
                        </div>
                    </div>

                    <div className="left-stats">
                        <div className="stat-pill"><strong>100+</strong><span>Сурагч</span></div>
                        <div className="stat-pill"><strong>4.9★</strong><span>Үнэлгээ</span></div>
                        <div className="stat-pill"><strong>Үнэгүй</strong><span>Эхлэх</span></div>
                    </div>
                </div>
            </div>

            {/* ══ RIGHT PANEL ══ */}
            <div className="right">
                <div className="login-box">
                    <div className="login-header">
                        <h2>{view === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</h2>
                        <p className="subtitle">EduLearn-д тавтай морил</p>
                    </div>

                    <span className="role-label">Би бол:</span>
                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-btn ${role === 'student' ? 'active' : ''}`}
                            onClick={() => { setRole('student'); setErrorMessage('') }}
                        >
                            <i className="fa-solid fa-user-graduate"></i>
                            <span className="role-btn-title">Сурагч</span>
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${role === 'teacher' ? 'teacher-active' : ''}`}
                            onClick={() => { setRole('teacher'); setErrorMessage('') }}
                        >
                            <i className="fa-solid fa-chalkboard-user"></i>
                            <span className="role-btn-title">Багш</span>
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="error-message-box" style={{
                            backgroundColor: '#fff2f0',
                            border: '1px solid #ffccc7',
                            color: '#ff4d4f',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            fontSize: '14px',
                            textAlign: 'center'
                        }}>
                            <i className="fas fa-circle-exclamation" style={{ marginRight: '8px' }}></i>
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleAuth}>
                        {view === 'signup' && (
                            <div className="input-row">
                                <div className="input-box">
                                    <label>Овог</label>
                                    <input type="text" name="lastName" placeholder="Бат" required onChange={handleChange} />
                                </div>
                                <div className="input-box">
                                    <label>Нэр</label>
                                    <input type="text" name="firstName" placeholder="Болд" required onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        <div className="input-box">
                            <label>Имэйл хаяг</label>
                            <div className="input-icon-wrap">
                                <i className="fas fa-envelope"></i>
                                <input type="email" name="email" placeholder="name@example.com" required onChange={handleChange} />
                            </div>
                        </div>

                        <div className={view === 'signup' ? 'input-row' : ''}>
                            <div className="input-box">
                                <label>Нууц үг</label>
                                <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} />
                            </div>
                            {view === 'signup' && (
                                <div className="input-box">
                                    <label>Давтах</label>
                                    <input type="password" name="confirmPassword" placeholder="••••••••" required onChange={handleChange} />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`submit-btn ${role === 'teacher' ? 'teacher-mode' : ''}`}
                            disabled={isLoading}
                        >
                            <i className={view === 'login' ? 'fa-solid fa-right-to-bracket' : 'fa-solid fa-user-plus'}></i>
                            {isLoading
                                ? 'Түр хүлээнэ үү...'
                                : view === 'login'
                                    ? 'Нэвтрэх'
                                    : `${role === 'student' ? 'Сурагчаар' : 'Багшаар'} бүртгүүлэх`
                            }
                        </button>
                    </form>

                    <div className="divider"><span>эсвэл</span></div>
                    <div className="signup">
                        {view === 'login'
                            ? <p>Бүртгэлгүй юу? <a href="#" onClick={(e) => toggleView(e, 'signup')}>Бүртгүүлэх</a></p>
                            : <p>Бүртгэлтэй юу? <a href="#" onClick={(e) => toggleView(e, 'login')}>Нэвтрэх</a></p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage
