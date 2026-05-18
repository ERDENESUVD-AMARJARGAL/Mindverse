import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

// ── Helpers ───────────────────────────────────────────────
const SUBJECT_META = {
    'Алгебр':      { color: '#3b82f6', icon: 'fa-calculator'  },
    'Геометр':     { color: '#10b981', icon: 'fa-shapes'       },
    'Тригонометр': { color: '#f59e0b', icon: 'fa-wave-square'  },
    'Физик':       { color: '#8b5cf6', icon: 'fa-atom'         },
    'Хими':        { color: '#ef4444', icon: 'fa-flask'        },
}
const DEFAULT_META = { color: '#64748b', icon: 'fa-book' }
const subjectMeta = (s) => SUBJECT_META[s] || DEFAULT_META

function getProgress(cls) {
    const total = (cls.lessons || []).length
    const progress = cls.userProgress?.completedLessons
    const done = Array.isArray(progress) ? progress.length : 0
    return total ? Math.round(done / total * 100) : 0
}

function getAvgScore(classes, userId) {
    const nums = classes.flatMap(c => (c.exams || [])
        .map(e => getUserScore(e, userId))
        .filter(Number.isFinite)
    )
    return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null
}

function getUserScore(item, userId) {
    const sub = (item.submissions || []).find(s => s.studentId === userId || s.id === userId)
    return sub?.score != null ? Number(sub.score) : null
}

function gradeInfo(pct) {
    if (pct >= 90) return { lbl: 'A', cls: 'grade-a' }
    if (pct >= 75) return { lbl: 'B', cls: 'grade-b' }
    if (pct >= 60) return { lbl: 'C', cls: 'grade-c' }
    return               { lbl: 'D', cls: 'grade-d' }
}

// ── Ring SVG ──────────────────────────────────────────────
function Ring({ pct, color }) {
    const r = 20, circ = 2 * Math.PI * r
    const offset = circ - (pct / 100) * circ
    return (
        <div className="ring-wrap">
            <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4.5"/>
                <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4.5"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round" transform="rotate(-90 26 26)"
                    style={{ transition: 'stroke-dashoffset .6s ease' }}/>
            </svg>
            <div className="ring-label">{pct}%</div>
        </div>
    )
}

// ── SummaryBar ────────────────────────────────────────────
function SummaryBar({ classes, userId }) {
    const totalL  = classes.reduce((s, c) => s + (c.lessons || []).length, 0)
    const doneL   = classes.reduce((s, c) => s + (Array.isArray(c.userProgress?.completedLessons)
        ? c.userProgress.completedLessons.length
        : 0), 0)
    const scores  = classes.flatMap(c => (c.exams || [])
        .map(e => getUserScore(e, userId))
        .filter(Number.isFinite)
    )
    const avg     = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
    const pending = classes.reduce((s, c) => s + (c.assignments || []).filter(a =>
        !(a.submissions || []).some(sub => sub.studentId === userId || sub.id === userId)
    ).length, 0)

    const kpis = [
        { icon: 'fa-book-open',    colorClass: 'kpi-blue',   val: totalL,    lbl: 'Нийт хичээл'        },
        { icon: 'fa-check-circle', colorClass: 'kpi-green',  val: doneL,     lbl: 'Дуусгасан'           },
        { icon: 'fa-star',         colorClass: 'kpi-purple', val: avg == null ? '—' : avg + '%', lbl: 'Дундаж оноо'         },
        { icon: 'fa-tasks',        colorClass: 'kpi-yellow', val: pending,   lbl: 'Идэвхтэй даалгавар'  },
    ]

    return (
        <div className="cls-summary">
            {kpis.map((k, i) => (
                <div key={i} className={`cls-kpi ${k.colorClass}`}>
                    <div className="cls-kpi-icon"><i className={`fas ${k.icon}`}/></div>
                    <div>
                        <div className="cls-kpi-val">{k.val}</div>
                        <div className="cls-kpi-lbl">{k.lbl}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── JoinClassModal ────────────────────────────────────────
function JoinClassModal({ onClose, onJoined }) {
    const { user, updateUser } = useAuth()
    const [code, setCode]       = useState('')
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)
    const JOIN_COST = 1000

    const handleJoin = async () => {
        setError('')
        if (!code.trim()) { setError('Ангийн кодоо оруулна уу!'); return }
        setLoading(true)
        try {
            const { data: freshUser } = await api.get(`/users/${user.id}`)
            const currentBalance = freshUser.balance || 0

            if (currentBalance < JOIN_COST) {
                setError(`Үлдэгдэл хүрэлцэхгүй байна! Танд ${JOIN_COST - currentBalance}₮ дутуу байна.`)
                setLoading(false)
                return
            }

            const { data } = await api.post('/join-class', {
                studentId: user.id,
                classCode: code.trim().toUpperCase(),
                joinCost: JOIN_COST
            })
            updateUser(data.user || { balance: currentBalance - JOIN_COST })

            alert('Амжилттай нэгдлээ!')
            onJoined()
        } catch (err) {
            setError('Серверт алдаа гарлаа: ' + err.message)
        }
        setLoading(false)
    }

    return (
        <div className="lsn-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="lsn-modal" style={{ maxWidth: '440px' }}>
                <div className="lsn-modal-head" style={{ background: 'linear-gradient(135deg, #07437d 0%, #1d4ed8 100%)' }}>
                    <div className="lsn-head-left">
                        <div className="lsn-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-plus-circle"/> Ангид нэгдэх
                        </div>
                        <div className="lsn-modal-meta">
                            <span><i className="fas fa-key"/> Ангийн кодоор нэгдэх</span>
                        </div>
                    </div>
                    <button className="lsn-close-btn" onClick={onClose}><i className="fas fa-times"/></button>
                </div>

                <div className="lsn-modal-body">
                    {error && (
                        <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', color: '#ff4d4f', padding: '12px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-exclamation-triangle"/> {error}
                        </div>
                    )}

                    <div style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="lsn-info-lbl" style={{ marginBottom: '2px' }}>Нэгдэх үнэ</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Төлбөр төлсний дараа нэгдэнэ</div>
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: '#07437d' }}>
                            {JOIN_COST.toLocaleString()}₮
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label className="lsn-info-lbl" style={{ display: 'block', marginBottom: '8px' }}>Ангийн код</label>
                        <input
                            type="text"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            placeholder="Жишээ: ALG-7K2M"
                            style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = '#3b82f6'}
                            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <button
                        className="lsn-complete-btn"
                        onClick={handleJoin}
                        disabled={loading || !code.trim()}
                        style={{ opacity: (loading || !code.trim()) ? 0.6 : 1 }}
                    >
                        <i className="fas fa-wallet"/> {loading ? 'Боловсруулж байна...' : 'Төлбөр төлөж нэгдэх'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── ClassCard ─────────────────────────────────────────────
function ClassCard({ cls, selected, onClick, userId }) {
    const pct     = getProgress(cls)
    const meta    = subjectMeta(cls?.subject)
    const doneL   = Array.isArray(cls.userProgress?.completedLessons)
        ? cls.userProgress.completedLessons.length
        : 0
    const pending = (cls.assignments || []).filter(a =>
        !(a.submissions || []).some(sub => sub.studentId === userId || sub.id === userId)
    ).length

    return (
        <div className={`cls-card${selected ? ' selected' : ''}`} style={{ '--cc': cls.color || meta.color }} onClick={onClick}>
            <div className="cls-card-header">
                <div className="cls-card-icon-box">
                    <i className={`fas ${cls.icon || meta.icon}`}/>
                </div>
                <Ring pct={pct} color={cls.color || meta.color}/>
            </div>
            <div className="cls-card-body">
                <div className="cls-card-subject">{cls?.subject}</div>
                <div className="cls-card-name">{cls.name}</div>
                <div className="cls-card-strip">
                    <div className="cls-card-strip-item">
                        <div className="cls-strip-val">{doneL}/{(cls.lessons || []).length}</div>
                        <div className="cls-strip-lbl">Хичээл</div>
                    </div>
                    <div className="cls-card-strip-item">
                        <div className="cls-strip-val">{(cls.exams || []).length}</div>
                        <div className="cls-strip-lbl">Шалгалт</div>
                    </div>
                    <div className="cls-card-strip-item">
                        <div className="cls-strip-val">{pending}</div>
                        <div className="cls-strip-lbl">Даалгавар</div>
                    </div>
                </div>
                <div className="cls-card-progress-track">
                    <div className="cls-card-progress-fill" style={{ width: pct + '%', background: cls.color || meta.color }}/>
                </div>
            </div>
        </div>
    )
}

// ── Tabs ──────────────────────────────────────────────────
function LessonsTab({ cls, userId, onProgressChange }) {
    const [modal, setModal] = useState(null)
    const lessons = cls.lessons || []

    useEffect(() => { setModal(null) }, [cls.id])

    const completedLessons = Array.isArray(cls.userProgress?.completedLessons)
        ? cls.userProgress.completedLessons
        : []

    const lessonId = (lesson, i) => lesson?.id || 'lesson_' + i
    const isDone = (lesson, i) => completedLessons.includes(lessonId(lesson, i))

    async function markDone(i) {
        const id = lessonId(lessons[i], i)
        const nextCompleted = completedLessons.includes(id) ? completedLessons : [...completedLessons, id]
        const nextProgress = { ...(cls.userProgress || {}), completedLessons: nextCompleted }

        try {
            const { data: freshUser } = await api.get('/users/' + userId)
            const classProgress = {
                ...(freshUser.classProgress || {}),
                [cls.id]: {
                    ...(freshUser.classProgress?.[cls.id] || {}),
                    ...nextProgress,
                },
            }
            await api.patch('/users/' + userId, { classProgress })
        } catch (err) {
            console.error(err)
        }

        onProgressChange?.(cls.id, nextProgress)
        setModal(null)
    }

    const l = modal !== null ? lessons[modal] : null

    return (
        <>
            <div className="lesson-list">
                {lessons.map((lsn, i) => {
                    const done = isDone(lsn, i)
                    return (
                        <div key={i} className={'lesson-row lesson-row--' + (done ? 'done' : 'upcoming')} onClick={() => setModal(i)}>
                            <div className={'lesson-num lesson-num--' + (done ? 'done' : 'upcoming')}>
                                {done ? <i className="fas fa-check"/> : <i className="fas fa-play"/>}
                            </div>
                            <div className="lesson-info">
                                <div className="lesson-title">{lsn.title}</div>
                                <div className="lesson-meta"><span><i className="fas fa-clock"/> {lsn.meta}</span></div>
                            </div>
                            <div className={'lesson-badge lesson-badge--' + (done ? 'done' : 'upcoming')}>{done ? 'Дууссан' : 'Үзээгүй'}</div>
                        </div>
                    )
                })}
            </div>
            {l && (
                <div className="lsn-overlay open" onClick={e => e.target === e.currentTarget && setModal(null)}>
                    <div className="lsn-modal">
                        <div className="lsn-modal-head" style={{ background: `linear-gradient(135deg,${cls.color}ee,${cls.color}88)` }}>
                            <div className="lsn-head-left">
                                <div className={'lsn-status-tag ' + (isDone(l, modal) ? 'done' : 'pending')}>{isDone(l, modal) ? 'Дууссан' : 'Үзээгүй'}</div>
                                <div className="lsn-modal-title">{l.title}</div>
                                <div className="lsn-modal-meta">
                                    <span><i className="fas fa-clock"/> {l.meta}</span>
                                    <span><i className="fas fa-book"/> {cls?.subject}</span>
                                </div>
                            </div>
                            <button className="lsn-close-btn" onClick={() => setModal(null)}><i className="fas fa-times"/></button>
                        </div>
                        <div className="lsn-modal-body">
                            <div className="lsn-video-box">
                                {isDone(l, modal) && <div className="lsn-done-ribbon"><i className="fas fa-check-circle"/> Дууссан</div>}
                                <div className="lsn-play-btn"><i className="fas fa-play"/></div>
                                <div className="lsn-video-label">Хичээлийн бичлэг</div>
                            </div>
                            <div className="lsn-info-grid">
                                <div className="lsn-info-card"><div className="lsn-info-lbl">Хугацаа</div><div className="lsn-info-val"><i className="fas fa-clock lsn-info-icon--blue"/> {l.meta}</div></div>
                                <div className="lsn-info-card"><div className="lsn-info-lbl">Хичээл</div><div className="lsn-info-val"><i className="fas fa-book-open lsn-info-icon--green"/> {cls?.subject}</div></div>
                            </div>
                            {isDone(l, modal)
                                ? <div className="lsn-completed-note"><i className="fas fa-check-circle"/> Та энэ хичээлийг амжилттай дуусгасан байна.</div>
                                : <button className="lsn-complete-btn" onClick={() => markDone(modal)}><i className="fas fa-check"/> Дуусгасан тэмдэглэх</button>
                            }
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function ExamsTab({ cls, userId }) {
    return (
        <div className="exam-list">
            {(cls.exams || []).map((ex, i) => {
                const score = getUserScore(ex, userId)
                const done = score !== null
                const pct  = done ? score : 0
                const g    = done ? gradeInfo(pct) : null
                return (
                    <div key={i} className={`exam-card${done ? ' exam-card--done' : ''}`}>
                        <div className="exam-card-top">
                            <div className="exam-card-info">
                                <div className="exam-title">{ex.title}</div>
                                <div className="exam-meta">{ex.meta}</div>
                            </div>
                            {done
                                ? <div className={`exam-grade-badge ${g.cls}`}>{g.lbl}</div>
                                : <div className="exam-upcoming-badge">Болоогүй</div>
                            }
                        </div>
                        {done && (
                            <div className="exam-score-area">
                                <div className="exam-score-row">
                                    <span className="exam-score-lbl">Таны оноо</span>
                                    <span className={`exam-score-val ${g.cls}`}>{pct}%</span>
                                </div>
                                <div className="exam-bar-track">
                                    <div className={`exam-bar-fill ${g.cls}`} style={{ width: pct + '%' }}/>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

function AssignmentsTab({ cls, userId }) {
    const [filter, setFilter] = useState('all')
    useEffect(() => setFilter('all'), [cls.id])
    const assigns = cls.assignments || []
    const withUserStatus = assigns.map(a => {
        const submitted = (a.submissions || []).some(s => s.studentId === userId || s.id === userId)
        return {
            ...a,
            userStatus: submitted ? 'done' : 'active',
            userStatusLabel: submitted ? 'Дууссан' : 'Хийгээгүй',
        }
    })
    const visible = filter === 'all' ? withUserStatus : withUserStatus.filter(a => a.userStatus === filter)

    if (!assigns.length) return <div className="cls-empty"><i className="fas fa-tasks"/><p>Даалгавар байхгүй байна</p></div>
    return (
        <div>
            <div className="asgn-filters">
                {[
                    { id: 'all',    lbl: 'Бүгд',       cnt: withUserStatus.length },
                    { id: 'active', lbl: 'Хийгээгүй',  cnt: withUserStatus.filter(a => a.userStatus === 'active').length },
                    { id: 'done',   lbl: 'Дууссан',    cnt: withUserStatus.filter(a => a.userStatus === 'done').length },
                ].map(f => (
                    <button key={f.id} className={`asgn-filter-btn${filter === f.id ? ' active' : ''}`} onClick={() => setFilter(f.id)}>
                        {f.lbl} <span className="asgn-filter-cnt">{f.cnt}</span>
                    </button>
                ))}
            </div>
            <div className="asgn-list">
                {visible.map((a, i) => (
                    <div key={i} className={`asgn-row asgn-row--${a.userStatus}`}>
                        <div className={`asgn-dot asgn-dot--${a.userStatus}`}/>
                        <div className="asgn-info">
                            <div className="asgn-title">{a.title}</div>
                            <div className="asgn-meta"><span><i className="fas fa-calendar-alt"/> {a.meta}</span></div>
                        </div>
                        <div className={`asgn-status-badge asgn-status--${a.userStatus}`}>{a.userStatusLabel}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function GradesTab({ cls, userId }) {
    const scored = (cls.exams || []).map(e => ({ ...e, userScore: getUserScore(e, userId) })).filter(e => e.userScore !== null)
    const avg    = scored.length ? Math.round(scored.reduce((s, e) => s + e.userScore, 0) / scored.length) : null
    const g      = avg !== null ? gradeInfo(avg) : null
    const circ   = 2 * Math.PI * 48
    const offset = avg !== null ? circ - (avg / 100) * circ : circ

    return (
        <div>
            {avg !== null && (
                <div className="grade-hero" style={{ background: `linear-gradient(135deg,${cls.color},${cls.color}99)` }}>
                    <div className="grade-ring-wrap">
                        <svg width="110" height="110" viewBox="0 0 110 110">
                            <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="8"/>
                            <circle cx="55" cy="55" r="48" fill="none" stroke="#fff" strokeWidth="8"
                                strokeDasharray={circ} strokeDashoffset={offset}
                                strokeLinecap="round" transform="rotate(-90 55 55)"
                                style={{ transition: 'stroke-dashoffset .7s ease' }}/>
                        </svg>
                        <div className="grade-ring-center">
                            <div className="grade-ring-num">{avg}</div>
                            <div className="grade-ring-lbl">оноо</div>
                        </div>
                    </div>
                    <div className="grade-hero-info">
                        <div className="grade-letter-badge">{g.lbl} — {avg >= 90 ? 'Онц' : avg >= 75 ? 'Сайн' : avg >= 60 ? 'Дунд' : 'Хангалтгүй'}</div>
                        <div className="grade-class-name">{cls.name}</div>
                        <div className="grade-exam-count">{scored.length} шалгалт дүгнэгдсэн</div>
                    </div>
                </div>
            )}
            <div className="grade-exam-list">
                {(cls.exams || []).map((ex, i) => {
                    const score = getUserScore(ex, userId)
                    const done = score !== null
                    const pct  = done ? score : 0
                    const gi   = done ? gradeInfo(pct) : null
                    return (
                        <div key={i} className="grade-exam-row">
                            <div className={`grade-exam-badge ${done ? gi.cls : 'grade-empty'}`}>{done ? gi.lbl : '—'}</div>
                            <div className="grade-exam-info">
                                <div className="grade-exam-title">{ex.title}</div>
                                <div className="grade-exam-meta">{ex.meta}</div>
                                {done && <div className="grade-exam-bar"><div className={`grade-exam-fill ${gi.cls}`} style={{ width: pct + '%' }}/></div>}
                            </div>
                            <div className={`grade-exam-score ${done ? gi.cls : 'grade-empty'}`}>{done ? `${pct}%` : 'Болоогүй'}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ── DetailPanel ───────────────────────────────────────────
const TABS = [
    { id: 'lessons',     icon: 'fa-road',           lbl: 'Хичээлүүд' },
    { id: 'exams',       icon: 'fa-clipboard-list',  lbl: 'Шалгалт'   },
    { id: 'assignments', icon: 'fa-tasks',           lbl: 'Даалгавар' },
    { id: 'grades',      icon: 'fa-chart-line',      lbl: 'Дүн'       },
]

function DetailPanel({ cls, onClose, userId, onProgressChange }) {
    const [tab, setTab] = useState('lessons')
    useEffect(() => setTab('lessons'), [cls.id])
    const meta  = subjectMeta(cls.subject)
    const pct   = getProgress(cls)
    const avg   = getAvgScore([cls], userId)
    const doneL = Array.isArray(cls.userProgress?.completedLessons)
        ? cls.userProgress.completedLessons.length
        : 0

    return (
        <div className="cls-detail">
            <div className="cls-det-banner" style={{ background: `linear-gradient(135deg,${cls.color || meta.color} 0%,${cls.color || meta.color}99 100%)` }}>
                <div className="cls-det-top">
                    <div className="cls-det-icon"><i className={`fas ${cls.icon || meta.icon}`}/></div>
                    <div className="cls-det-info">
                        <div className="cls-det-subject">{cls?.subject}</div>
                        <div className="cls-det-title">{cls.name}</div>
                    </div>
                    <button className="cls-det-close" onClick={onClose}><i className="fas fa-times"/></button>
                </div>
                <div className="cls-det-kpis">
                    {[
                        { val: `${doneL}/${(cls.lessons || []).length}`, lbl: 'Хичээл'  },
                        { val: pct + '%',                                 lbl: 'Явц'     },
                        { val: avg !== null ? avg : '—',                  lbl: 'Дундаж'  },
                        { val: (cls.exams || []).filter(e => getUserScore(e, userId) !== null).length, lbl: 'Шалгалт' },
                    ].map((k, i) => (
                        <div key={i} className="cls-det-kpi">
                            <div className="cls-det-kpi-val">{k.val}</div>
                            <div className="cls-det-kpi-lbl">{k.lbl}</div>
                        </div>
                    ))}
                </div>
                <div className="cls-tabs">
                    {TABS.map(t => (
                        <button key={t.id}
                            className={`cls-tab${tab === t.id ? ' active' : ''}`}
                            style={tab === t.id ? { color: cls.color || meta.color, borderColor: cls.color || meta.color } : {}}
                            onClick={() => setTab(t.id)}
                        >
                            <i className={`fas ${t.icon}`}/> {t.lbl}
                        </button>
                    ))}
                </div>
            </div>
            <div className="cls-tab-body">
                {tab === 'lessons'     && <LessonsTab     cls={cls} userId={userId} onProgressChange={onProgressChange}/>}
                {tab === 'exams'       && <ExamsTab       cls={cls} userId={userId}/>}
                {tab === 'assignments' && <AssignmentsTab cls={cls} userId={userId}/>}
                {tab === 'grades'      && <GradesTab      cls={cls} userId={userId}/>}
            </div>
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────
function StudentClasses() {
    const { user } = useAuth()
    const [classes,   setClasses]   = useState([])
    const [loading,   setLoading]   = useState(true)
    const [error,     setError]     = useState(null)
    const [selected,  setSelected]  = useState(null)
    const [query,     setQuery]     = useState('')
    const [joinModal, setJoinModal] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const { data: userData }  = await api.get(`/users/${user.id}`)
            const { data: allClasses } = await api.get('/classes')
            const ids = Array.isArray(userData.classId) ? userData.classId : [userData.classId].filter(Boolean)
            setClasses(allClasses
                .filter(c => ids.includes(c.id))
                .map(c => ({
                    ...c,
                    userProgress: userData.classProgress?.[c.id] || { completedLessons: [], completedAssignments: [] },
                })))
        } catch (err) {
            setError(err.response?.data?.error || 'Өгөгдөл татахад алдаа гарлаа')
        } finally {
            setLoading(false)
        }
    }, [user.id])

    useEffect(() => { load() }, [load])

    const handleProgressChange = useCallback((classId, userProgress) => {
        setClasses(prev => prev.map(c => c.id === classId ? { ...c, userProgress } : c))
        setSelected(prev => prev?.id === classId ? { ...prev, userProgress } : prev)
    }, [])

    const filtered = classes.filter(c => {
        if (!query) return true
        const q = query.toLowerCase()
        return c.name.toLowerCase().includes(q) || c?.subject?.toLowerCase().includes(q)
    })

    if (loading) return <div className="page-container"><div className="page cls-loading"><div className="cls-spinner"/><p>Ачааллаж байна...</p></div></div>
    if (error)   return (
        <div className="page-container">
            <div className="page cls-error-wrap">
                <i className="fas fa-exclamation-circle cls-error-icon"/>
                <p className="cls-error-msg">{error}</p>
                <button className="cls-retry-btn" onClick={load}><i className="fas fa-redo"/> Дахин оролдох</button>
            </div>
        </div>
    )

    return (
        <div className="page-container">
            <div className="page">
                <div className="cls-hero">
                    <div className="cls-hero-blob"/>
                    <div className="cls-hero-inner">
                        <div className="cls-hero-left">
                            <div className="cls-hero-tag"><i className="fas fa-book-open"/> Хичээлүүд</div>
                            <h1 className="cls-hero-title">Миний <em>Хичээлүүд</em></h1>
                            <p className="cls-hero-sub">Хичээл, шалгалт, даалгавар — бүгд нэг дор</p>
                        </div>
                        <div className="cls-hero-tags">
                            <div className="cls-hero-chip"><i className="fas fa-layer-group"/> {classes.length} хичээл</div>
                            <div className="cls-hero-chip" onClick={() => setJoinModal(true)} style={{ cursor: 'pointer', background: 'rgba(255,255,255,.25)', border: '1.5px dashed rgba(255,255,255,.5)' }}>
                                <i className="fas fa-plus"/> Анги нэгдэх
                            </div>
                            <div className="cls-hero-chip"><i className="fas fa-calendar-week"/> 2026 оны 2-р улирал</div>
                        </div>
                    </div>
                </div>

                <SummaryBar classes={classes} userId={user.id}/>

                <div className="cls-search-wrap">
                    <div className="cls-search-bar">
                        <i className="fas fa-search"/>
                        <input type="text" placeholder="Хичээл, сэдвээр хайх..." value={query} onChange={e => setQuery(e.target.value)}/>
                        {query && <button className="cls-search-clear" onClick={() => setQuery('')}><i className="fas fa-times"/></button>}
                    </div>
                    {query && <span className="cls-search-badge">{filtered.length} үр дүн</span>}
                </div>

                <div className="cls-layout">
                    <div className={`cls-grid${selected ? ' has-detail' : ''}`}>
                        {filtered.length === 0 && <div className="cls-no-results"><i className="fas fa-search"/><p>Хайлтад тохирох хичээл олдсонгүй</p></div>}
                        {filtered.map(cls => (
                            <ClassCard key={cls.id} cls={cls} userId={user.id} selected={selected?.id === cls.id} onClick={() => setSelected(prev => prev?.id === cls.id ? null : cls)}/>
                        ))}
                    </div>
                    {selected && <DetailPanel cls={selected} onClose={() => setSelected(null)} userId={user.id} onProgressChange={handleProgressChange}/>}
                </div>
            </div>

            {joinModal && (
                <JoinClassModal
                    onClose={() => setJoinModal(false)}
                    onJoined={() => { setJoinModal(false); load() }}
                />
            )}
        </div>
    )
}

export default StudentClasses
