import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import { average, classAverage } from '../utils/classStats'

function TeacherClassCard({ color, icon, name, subject, avg, students, lessons }) {
    const lessonCount = Array.isArray(lessons) ? lessons.length : 0
    return (
        <div className="t-cls-card" style={{ '--cc': color }}>
            <div className="t-cls-top">
                <div className="t-cls-icon" style={{ background: `${color}20`, color }}>
                    <i className={`fas ${icon || 'fa-book'}`} />
                </div>
                <span className="t-cls-avg">{avg}</span>
            </div>
            <div className="t-cls-content">
                <div className="t-cls-name">{name} - {subject}</div>
                <div className="t-cls-meta">{students} сурагч · {lessonCount} хичээл</div>
                <div className="t-cls-bar-wrap">
                    <div className="t-cls-bar-fill" style={{ width: avg?.includes('%') ? avg : `${avg}%`, background: color }} />
                </div>
            </div>
        </div>
    )
}

function TeacherMain() {
    const { user } = useAuth()

    const [stats, setStats] = useState({ classes: 0, students: 0, upcoming: 0, examAvg: '0%', newStudents: 0 })
    const [recentClasses, setRecentClasses] = useState([])
    const [pendingAssignments, setPendingAssignments] = useState([])
    const [upcomingSchedules, setUpcomingSchedules] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await api.get(`/classes?teacherId=${user.id}`)

                if (data && data.length > 0) {
                    const totalStudents = data.reduce((sum, c) => {
                        const count = Array.isArray(c.studentList) ? c.studentList.length : (c.students || 0)
                        return sum + count
                    }, 0)

                    const upcomingExamsCount = data
                        .flatMap(c => (c.exams || []))
                        .filter(e => e.status === 'upcoming').length

                    const classAvgs = data.map(c => classAverage(c).avgNum).filter(n => n > 0)
                    const finalAvg = average(classAvgs)

                    const lastCheck = localStorage.getItem('last_check') || new Date().toISOString()
                    const newOnes = data
                        .flatMap(c => c.studentList || [])
                        .filter(s => new Date(s.joinedAt) > new Date(lastCheck)).length

                    setStats({
                        classes: data.length,
                        students: totalStudents,
                        upcoming: upcomingExamsCount,
                        examAvg: finalAvg + '%',
                        newStudents: newOnes
                    })

                    setRecentClasses(data.map(c => ({ ...c, ...classAverage(c) })).slice(0, 4))

                    const allAssignments = data.flatMap(c =>
                        (c.assignments || []).map(a => ({ ...a, className: c.name }))
                    )
                    setPendingAssignments(allAssignments.filter(a => a.status === 'active').slice(0, 3))

                    const allSchedules = data.flatMap(c =>
                        (c.exams || []).map(ex => {
                            const parts = (ex.date || '').split('-')
                            return {
                                ...ex,
                                className: c.name,
                                day: parts[2] || '00',
                                month: parts[1] ? parseInt(parts[1]) + ' сар' : 'Тун удахгүй'
                            }
                        })
                    )
                    setUpcomingSchedules(allSchedules.filter(ex => ex.status === 'upcoming').slice(0, 3))

                    localStorage.setItem('last_check', new Date().toISOString())
                }
            } catch (err) {
                console.error('Дата татахад алдаа:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user.id])

    if (loading) return <div className="page-loading">Ачаалж байна...</div>

    return (
        <div className="page">
            <div className="teacher-banner">
                <div className="teacher-banner-text">
                    <div className="banner-eyebrow"><i className="fas fa-chalkboard-teacher" /> Багшийн самбар</div>
                    <h1 className="banner-title">Сайн байна уу, <span>{user.firstName}</span>!</h1>
                    <p className="banner-sub">Өнөөдрийн байдлаарх сургалтын нэгдсэн мэдээлэл</p>
                </div>
                <div className="banner-actions">
                    <button className="btn-banner" onClick={() => window.location.href = '/teacher-classes'}>
                        <i className="fas fa-plus" /> Хичээл нэмэх
                    </button>
                    <button className="btn-banner outline" onClick={() => window.location.href = '/teacher-classes'}>
                        <i className="fas fa-pen" /> Шалгалт үүсгэх
                    </button>
                </div>
            </div>

            <div className="teacher-stats">
                {[
                    { bg: '#d1fae5', color: '#065f46', icon: 'fa-layer-group', val: stats.classes, lbl: 'Идэвхтэй анги' },
                    { bg: '#dbeafe', color: '#1d4ed8', icon: 'fa-users', val: stats.students, lbl: 'Нийт сурагч' },
                    { bg: '#fef3c7', color: '#92400e', icon: 'fa-tasks', val: stats.upcoming, lbl: 'Хүлээгдэж буй' },
                    { bg: '#ede9fe', color: '#5b21b6', icon: 'fa-chart-bar', val: stats.examAvg, lbl: 'Шалгалтын дундаж' },
                ].map((s, i) => (
                    <div className="t-stat-card" key={i}>
                        <div className="t-stat-icon" style={{ background: s.bg, color: s.color }}>
                            <i className={`fas ${s.icon}`} />
                        </div>
                        <div className="t-stat-body">
                            <div className="t-stat-val">{s.val}</div>
                            <div className="t-stat-lbl">{s.lbl}</div>
                        </div>
                        {i === 1 && stats.newStudents > 0 && (
                            <div className="t-stat-trend up"><i className="fas fa-arrow-up" /> +{stats.newStudents}</div>
                        )}
                    </div>
                ))}
            </div>

            <div className="teacher-grid">
                <div className="teacher-col-main">
                    <div className="t-card">
                        <div className="t-card-head">
                            <div>
                                <h3><i className="fas fa-layer-group" /> Миний ангиуд</h3>
                                <p>Идэвхтэй {recentClasses.length} анги</p>
                            </div>
                            <button className="t-btn-sm" onClick={() => window.location.href = '/teacher-classes'}>
                                Бүгдийг харах <i className="fas fa-arrow-right" />
                            </button>
                        </div>
                        <div className="t-cls-grid">
                            {recentClasses.map(cls => (
                                <TeacherClassCard
                                    key={cls.id}
                                    color={cls.color}
                                    icon={cls.icon}
                                    name={cls.name}
                                    subject={cls.subject}
                                    avg={cls.avg}
                                    students={cls.studentList?.length || cls.students || 0}
                                    lessons={cls.lessons}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="t-card">
                        <div className="t-card-head">
                            <div><h3><i className="fas fa-tasks" /> Даалгаварууд</h3><p>Шалгах шаардлагатай</p></div>
                            <button className="t-btn-sm" onClick={() => window.location.href = '/teacher-classes'}>
                                Бүгдийг харах <i className="fas fa-arrow-right" />
                            </button>
                        </div>
                        <div className="assign-list">
                            {pendingAssignments.length > 0 ? pendingAssignments.map(asn => (
                                <div className="assign-row" key={asn.id}>
                                    <div className="assign-status-dot active" />
                                    <div className="assign-info">
                                        <div className="assign-title">{asn.title}</div>
                                        <div className="assign-meta">{asn.className} · Дуусах: {asn.dueDate || 'Хугацаагүй'}</div>
                                    </div>
                                    <span className="assign-badge active">Идэвхтэй</span>
                                </div>
                            )) : <p className="empty-msg">Шалгах даалгавар байхгүй.</p>}
                        </div>
                    </div>
                </div>

                <div className="teacher-col-side">
                    <div className="t-card">
                        <div className="t-card-head">
                            <div><h3><i className="fas fa-pen-square" /> Шалгалтууд</h3><p>Ойрын хуваарь</p></div>
                        </div>
                        <div className="exam-list">
                            {upcomingSchedules.map(exam => (
                                <div className="exam-entry upcoming" key={exam.id}>
                                    <div className="exam-entry-left">
                                        <div className="exam-entry-date"><span>{exam.day}</span>{exam.month}</div>
                                    </div>
                                    <div className="exam-entry-info">
                                        <div className="exam-entry-title">{exam.title}</div>
                                        <div className="exam-entry-meta">{exam.className} · {exam.totalQuestions || 0} асуулт</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherMain
