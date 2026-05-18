import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'

// ── Helpers ──────────────────────────────────────────────
function getProgress(cls) {
    const total = (cls.lessons || []).length
    const done = Array.isArray(cls.userProgress?.completedLessons)
        ? cls.userProgress.completedLessons.length
        : 0
    return total ? Math.round(done / total * 100) : 0
}

function getUserScore(item, userId) {
    const sub = (item.submissions || []).find(s => s.studentId === userId || s.id === userId)
    return sub?.score != null ? Number(sub.score) : null
}

function getAvgScore(classes, userId) {
    const nums = classes.flatMap(c =>
        (c.exams || []).map(e => getUserScore(e, userId)).filter(Number.isFinite)
    )
    return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null
}

function getUpcomingExams(classes) {
    return classes
        .flatMap(c => (c.exams || [])
            .filter(e => e.status === 'upcoming')
            .map(e => ({ ...e, classColor: c.color, subject: c.subject }))
        )
        .slice(0, 4)
}

function getPendingAssigns(classes, userId) {
    return classes.flatMap(c =>
        (c.assignments || []).filter(a => !(a.submissions || []).some(s => s.studentId === userId || s.id === userId))
    ).length
}

function parseExamDate(meta) {
    const match = (meta || '').match(/(\d{4})\/(\d{2})\/(\d{2})/)
    if (!match) return { day: '—', month: '—' }
    const d = new Date(match[1], match[2] - 1, match[3])
    return { day: d.getDate(), month: `${d.getMonth() + 1}-р сар` }
}

function daysUntil(meta) {
    const match = (meta || '').match(/(\d{4})\/(\d{2})\/(\d{2})/)
    if (!match) return null
    const diff = Math.ceil(
        (new Date(match[1], match[2] - 1, match[3]) - new Date()) / 86400000
    )
    return diff > 0 ? diff : 0
}

// ── Sub-components ────────────────────────────────────────
function Spinner() {
    return (
        <div className="sm-loading">
            <div className="sm-spinner" />
            <p>Ачааллаж байна...</p>
        </div>
    )
}

function Banner({ user, classes }) {
    const examCount = classes.flatMap(c => (c.exams || []).filter(e => getUserScore(e, user.id) !== null)).length
    const streak = parseInt(sessionStorage.getItem('streak') || '7', 10)

    const pills = [
        { icon: 'fa-book-open', val: classes.length, lbl: 'Хичээл' },
        { icon: 'fa-pen-square', val: examCount, lbl: 'Шалгалт өгсөн' },
        { icon: 'fa-fire', val: streak, lbl: 'Өдрийн streak', fireIcon: true },
    ]

    return (
        <div className="stu-banner">
            <div className="stu-banner-blob" />
            <div className="stu-banner-inner">
                <div className="stu-banner-left">
                    <div className="stu-banner-tag">
                        <i className="fas fa-graduation-cap" /> Сурагчийн самбар
                    </div>
                    <div className="stu-banner-title">
                        Сайн байна уу, <em>{user.firstName || 'Сурагч'}</em>!
                    </div>
                    <div className="stu-banner-pills">
                        {pills.map((p, i) => (
                            <div className="stu-banner-pill" key={i}>
                                <div className="stu-banner-pill-icon">
                                    <i className={`fas ${p.icon}${p.fireIcon ? ' sm-fire-icon' : ''}`} />
                                </div>
                                <div>
                                    <div className="stu-banner-pill-val">{p.val}</div>
                                    <div className="stu-banner-pill-lbl">{p.lbl}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="stu-banner-actions">
                    <a href="/student-classes" className="stu-btn solid">
                        <i className="fas fa-book-open" /> Хичээлүүд
                    </a>
                    <a href="/student-classes" className="stu-btn">
                        <i className="fas fa-tasks" /> Даалгавар
                    </a>
                </div>
            </div>
        </div>
    )
}

function Stats({ user, classes }) {
    const avgScore = getAvgScore(classes, user.id)
    const activeAssign = getPendingAssigns(classes, user.id)
    const examsDone = classes.flatMap(c => (c.exams || []).filter(e => getUserScore(e, user.id) !== null)).length

    const items = [
        { colorCls: 'sm-stat-blue', icon: 'fa-layer-group', val: classes.length, lbl: 'Миний хичээл', trend: 'neutral', trendTxt: '2026 хичээлийн жил' },
        { colorCls: 'sm-stat-green', icon: 'fa-pen-square', val: examsDone, lbl: 'Өгсөн шалгалт', trend: 'up', trendTxt: '+1 энэ долоо хоног' },
        { colorCls: 'sm-stat-yellow', icon: 'fa-tasks', val: activeAssign, lbl: 'Хүлээгдэж буй даалгавар', trend: 'down', trendTxt: activeAssign > 0 ? `${activeAssign} нь идэвхтэй` : 'Даалгаваргүй' },
        { colorCls: 'sm-stat-purple', icon: 'fa-chart-bar', val: avgScore == null ? '—' : avgScore + '%', lbl: 'Дундаж оноо', trend: 'up', trendTxt: avgScore == null ? 'Оноо ороогүй' : 'Таны шалгалтын дундаж' },
    ]

    return (
        <div className="stu-stats">
            {items.map((s, i) => (
                <div className={`stu-stat ${s.colorCls}`} key={i}>
                    <div className="stu-stat-icon">
                        <i className={`fas ${s.icon}`} />
                    </div>
                    <div className="stu-stat-body">
                        <div className="stu-stat-val">{s.val}</div>
                        <div className="stu-stat-lbl">{s.lbl}</div>
                        <div className={`stu-stat-trend ${s.trend}`}>{s.trendTxt}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function ClassCards({ user, classes }) {
    if (!classes.length) return (
        <div className="stu-card">
            <div className="sm-empty">
                <i className="fas fa-layer-group" />
                <p>Бүртгэлтэй хичээл байхгүй байна</p>
            </div>
        </div>
    )

    return (
        <div className="stu-card">
            <div className="stu-card-head">
                <div>
                    <div className="stu-card-title">
                        <i className="fas fa-layer-group" /> Миний хичээлүүд
                    </div>
                    <div className="stu-card-sub">Бүртгэлтэй хичээл, ахиц дэвшил</div>
                </div>
                <a href="/student-classes" className="stu-see-all">Бүгдийг харах →</a>
            </div>
            <div className="my-cls-grid">
                {classes.map((c, i) => {
                    const pct = getProgress(c)
                    const pending = (c.assignments || []).filter(a =>
                        !(a.submissions || []).some(s => s.studentId === user.id || s.id === user.id)
                    ).length
                    const nextLsn = (c.lessons || []).find(l => l.badge === 'upcoming')

                    return (
                        <a key={i} href="/student-classes" className="my-cls-card" style={{ '--cc': c.color }}>
                            <div className="my-cls-top">
                                <div className="my-cls-icon" style={{ background: `color-mix(in srgb,${c.color} 15%,#fff)`, color: c.color }}>
                                    <i className={`fas ${c.icon || 'fa-book'}`} />
                                </div>
                                <span className="my-cls-pct">{pct}%</span>
                            </div>
                            <div className="my-cls-name">{c.name}</div>
                            <div className="my-cls-bar-wrap">
                                <div className="my-cls-bar-fill" style={{ width: `${pct}%`, background: c.color }} />
                            </div>
                            <div className="my-cls-footer">
                                <span className="my-cls-next">
                                    <i className="fas fa-play-circle" />
                                    {nextLsn ? nextLsn.title : 'Хичээл байхгүй'}
                                </span>
                                {pending > 0
                                    ? <span className="my-cls-assign-chip">{pending} даалгавар</span>
                                    : <span className="my-cls-assign-chip no-assign">Даалгаваргүй</span>
                                }
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

function ExamCard({ classes }) {
    const exams = getUpcomingExams(classes)

    if (!exams.length) return (
        <div className="stu-card">
            <div className="stu-card-head">
                <div>
                    <div className="stu-card-title"><i className="fas fa-pen-square" /> Ойрын шалгалтууд</div>
                    <div className="stu-card-sub">Бэлдэж байгаарай</div>
                </div>
            </div>
            <div className="sm-empty">
                <i className="fas fa-calendar-check" />
                <p>Ойрын шалгалт байхгүй байна</p>
            </div>
        </div>
    )

    return (
        <div className="stu-card">
            <div className="stu-card-head">
                <div>
                    <div className="stu-card-title"><i className="fas fa-pen-square" /> Ойрын шалгалтууд</div>
                    <div className="stu-card-sub">Бэлдэж байгаарай</div>
                </div>
                <a href="/calendar" className="stu-see-all">Дэлгэрэнгүй →</a>
            </div>
            <div>
                {exams.map((ex, i) => {
                    const { day, month } = parseExamDate(ex.meta)
                    const days = daysUntil(ex.meta)
                    const urgent = days !== null && days <= 3

                    return (
                        <div className="exam-upcoming-row" key={i}>
                            <div className="exam-date-box" style={{ background: `linear-gradient(135deg,${ex.classColor},${ex.classColor}99)` }}>
                                <span className="eday">{day}</span>
                                <span className="emonth">{month}</span>
                            </div>
                            <div className="exam-upcoming-info">
                                <div className="exam-upcoming-name">{ex.title}</div>
                                <div className="exam-upcoming-meta">{ex.subject} · {ex.meta}</div>
                            </div>
                            <span className={`exam-upcoming-pill${urgent ? ' urgent-pill' : ''}`}>
                                {days !== null ? `${days} хоног` : '—'}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ── Main component ────────────────────────────────────────
function StudentMain() {
    const { user } = useAuth()
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: userData } = await api.get(`/users/${user.id}`)
                const { data: allClasses } = await api.get('/classes')

                const classIds = Array.isArray(userData.classId)
                    ? userData.classId
                    : [userData.classId].filter(Boolean)

                setClasses(allClasses
                    .filter(c => classIds.includes(c.id))
                    .map(c => ({
                        ...c,
                        userProgress: userData.classProgress?.[c.id] || { completedLessons: [], completedAssignments: [] },
                    })))
            } catch (err) {
                setError(err.response?.data?.error || 'Өгөгдөл татахад алдаа гарлаа')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user.id])

    if (loading) return <div className="page"><main><Spinner /></main></div>

    if (error) return (
        <div className="page">
            <main>
                <div className="sm-error">
                    <i className="fas fa-exclamation-circle" />
                    <p>{error}</p>
                    <button className="sm-retry-btn" onClick={() => window.location.reload()}>
                        <i className="fas fa-redo" /> Дахин оролдох
                    </button>
                </div>
            </main>
        </div>
    )

    return (
        <div className="page">
            <main>
                <Banner user={user} classes={classes} />
                <Stats user={user} classes={classes} />
                <div className="stu-grid">
                    <ClassCards user={user} classes={classes} />
                    <ExamCard classes={classes} />
                </div>
            </main>
        </div>
    )
}

export default StudentMain
