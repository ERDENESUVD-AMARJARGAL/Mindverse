import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

// ── Constants ─────────────────────────────────────────────
const COLORS   = ['#1d4ed8','#059669','#7c3aed','#db2777','#ea580c','#2563eb']
const SUBJECTS = ['Математик','Физик','Мэдээлэл технологи','Англи хэл','Хими','Биологи','Түүх','Алгебр','Геометр','Тригонометр']
const ICONS    = ['fa-calculator','fa-shapes','fa-wave-square','fa-flask','fa-globe','fa-atom','fa-book','fa-layer-group']

// ── Helpers ───────────────────────────────────────────────
const uid          = (pfx = 'id') => pfx + '_' + Math.random().toString(36).substr(2, 9)
const generateCode = (subj) => subj.substring(0, 3).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase()
const safe         = (arr) => Array.isArray(arr) ? arr : []
const extIcon      = (name = '') => {
    const ext = (name.split('.').pop() || '').toLowerCase()
    return { pdf:'fa-file-pdf', doc:'fa-file-word', docx:'fa-file-word', xls:'fa-file-excel', xlsx:'fa-file-excel', png:'fa-file-image', jpg:'fa-file-image', jpeg:'fa-file-image' }[ext] || 'fa-file-alt'
}
const stuName = (s) => s ? [s.firstName, s.lastName].filter(Boolean).join(' ') : ''
const CONTENT_BLANK = { title:'', date:'', duration:'', description:'', contentType:'link', contentUrl:'', files:[], totalQuestions:'', passingScore:'', dueDate:'', badge:'upcoming' }

function average(nums) {
    return nums.length ? Math.round(nums.reduce((sum, n) => sum + n, 0) / nums.length) : null
}

function studentMetrics(cls, studentId) {
    const assessmentScores = [
        ...safe(cls.exams),
        ...safe(cls.assignments),
    ].flatMap(item => safe(item.submissions)
        .filter(sub => sub.studentId === studentId || sub.id === studentId)
        .map(sub => Number(sub.score))
        .filter(Number.isFinite)
    )

    const progress = safe(cls.studentList).find(student => student.id === studentId)?.classProgress
    const completedLessons = safe(progress?.completedLessons).length
    const lessonCount = safe(cls.lessons).length
    const lessonScore = lessonCount > 0 && completedLessons > 0
        ? Math.round((completedLessons / lessonCount) * 100)
        : null
    const scoreParts = [...assessmentScores, lessonScore].filter(Number.isFinite)

    return {
        score: average(scoreParts),
        lessonScore,
        completedLessons,
        lessonCount,
        assessmentCount: assessmentScores.length,
    }
}

// ── Toast ─────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
    useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t) }, [onDone])
    return (
        <div className={`toast toast-${type}`}>
            <i className={`fas ${type==='success'?'fa-check-circle':type==='error'?'fa-times-circle':'fa-info-circle'}`}/>
            <span>{msg}</span>
        </div>
    )
}

function useToast() {
    const [toasts, setToasts] = useState([])
    const show   = useCallback((msg, type = 'success') => { const id = uid('t'); setToasts(p => [...p, { id, msg, type }]) }, [])
    const remove = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), [])
    const el = (
        <div className="toast-container">
            {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} onDone={() => remove(t.id)}/>)}
        </div>
    )
    return [show, el]
}

// ── ClassCodeBadge ────────────────────────────────────────
function ClassCodeBadge({ code }) {
    const [copied, setCopied] = useState(false)
    const copy = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(code).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="cc-code-badge" onClick={copy}>
            <i className="fas fa-key" style={{ marginRight: 6, fontSize: 11, color: '#64748b' }}/>
            <code>{code}</code>
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} style={{ marginLeft: 8, fontSize: 11, color: copied ? '#059669' : '#94a3b8' }}/>
            {copied && <span className="cc-copied-tooltip">Хуулагдлаа!</span>}
        </div>
    )
}

// ── FileDropzone ──────────────────────────────────────────
function FileDropzone({ files, onFiles, onRemove }) {
    const ref  = useRef()
    const [drag, setDrag] = useState(false)
    return (
        <div>
            <div className={`file-dropzone${drag ? ' drag-over' : ''}`}
                onClick={() => ref.current.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); onFiles(Array.from(e.dataTransfer.files)) }}>
                <i className="fas fa-cloud-upload-alt"/>
                <div className="fdz-text">Файл чирж оруулах эсвэл <u>сонгох</u></div>
                <div className="fdz-hint">PDF, Word, Excel, Зураг дэмжинэ</div>
                <input ref={ref} type="file" multiple style={{ display: 'none' }} onChange={e => onFiles(Array.from(e.target.files))}/>
            </div>
            {files.length > 0 && (
                <div className="fdz-file-list">
                    {files.map((f, i) => (
                        <div key={i} className="fdz-file-item">
                            <i className={`fas ${extIcon(f.name)}`}/>
                            <span className="fdz-file-name">{f.name}</span>
                            <span className="fdz-file-size">{(f.size / 1024).toFixed(1)}KB</span>
                            <button className="fdz-remove" onClick={e => { e.stopPropagation(); onRemove(i) }}>
                                <i className="fas fa-times"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ── ContentChip ───────────────────────────────────────────
function ContentChip({ contentType, contentUrl, label }) {
    if (!contentUrl) return null
    if (contentType === 'link') return (
        <a href={contentUrl} target="_blank" rel="noreferrer" className="content-chip">
            <i className="fas fa-link"/>{label || 'Линк нээх'}
        </a>
    )
    const fileName = contentUrl.split('/').pop() || contentUrl
    return (
        <span className="content-chip" style={{ cursor: 'default' }}>
            <i className={`fas ${extIcon(fileName)}`}/>{fileName}
        </span>
    )
}

// ── ContentModal ──────────────────────────────────────────
function ContentModal({ open, onClose, onSave, type, initial }) {
    const isLesson = type === 'lesson'
    const isExam   = type === 'exam'
    const isAssign = type === 'assignment'
    const [form,  setForm]  = useState(CONTENT_BLANK)
    const [files, setFiles] = useState([])
    const [tab,   setTab]   = useState('link')
    const [err,   setErr]   = useState('')

    useEffect(() => {
        if (open) {
            const ct = initial?.contentType || 'link'
            setForm(initial ? { ...CONTENT_BLANK, ...initial } : CONTENT_BLANK)
            setFiles([]); setTab(ct); setErr('')
        }
    }, [open, initial])

    const f = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const typeLabel = isLesson ? 'Хичээл' : isExam ? 'Шалгалт' : 'Даалгавар'
    const typeIcon  = isLesson ? 'fa-book-open' : isExam ? 'fa-pen-square' : 'fa-tasks'

    const save = () => {
        if (!form.title.trim()) { setErr('Гарчиг оруулна уу'); return }
        if (tab === 'link' && !form.contentUrl.trim()) { setErr('Линк оруулна уу'); return }
        if (tab === 'file' && files.length === 0 && !initial?.contentUrl) { setErr('Файл сонгоно уу'); return }
        setErr('')
        onSave({
            ...form,
            id: initial?.id || uid(type.substring(0, 3)),
            contentType: tab,
            contentUrl: tab === 'link' ? form.contentUrl : (files[0]?.name || initial?.contentUrl || ''),
            duration: form.duration ? parseInt(form.duration) : null,
            totalQuestions: form.totalQuestions ? parseInt(form.totalQuestions) : null,
            passingScore: form.passingScore ? parseInt(form.passingScore) : null,
        })
    }

    if (!open) return null
    return (
        <div className="modal-overlay show" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal modal-lg">
                <div className="modal-header">
                    <h3><i className={`fas ${typeIcon}`} style={{ marginRight: 8, color: '#07437d' }}/>{initial ? 'Засах' : 'Шинэ'} {typeLabel}</h3>
                    <button className="modal-close" onClick={onClose}><i className="fas fa-times"/></button>
                </div>
                <div className="modal-body">
                    {err && <div className="form-error"><i className="fas fa-exclamation-circle"/> {err}</div>}
                    <div className="modal-section-title">Үндсэн мэдээлэл</div>
                    <div className="form-row">
                        <div className="form-group" style={{ flex: 2 }}>
                            <label>Гарчиг *</label>
                            <input value={form.title} onChange={e => f('title', e.target.value)} placeholder={`${typeLabel}ийн гарчиг...`}/>
                        </div>
                        <div className="form-group">
                            <label>{isAssign ? 'Дуусах огноо' : 'Огноо'}</label>
                            <input type="date" value={isAssign ? form.dueDate : form.date}
                                onChange={e => f(isAssign ? 'dueDate' : 'date', e.target.value)}/>
                        </div>
                    </div>
                    {(isLesson || isExam) && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Хугацаа (мин)</label>
                                <input type="number" value={form.duration} onChange={e => f('duration', e.target.value)} placeholder="45"/>
                            </div>
                            {isExam && <>
                                <div className="form-group">
                                    <label>Асуултын тоо</label>
                                    <input type="number" value={form.totalQuestions} onChange={e => f('totalQuestions', e.target.value)} placeholder="20"/>
                                </div>
                                <div className="form-group">
                                    <label>Тэнцэх оноо (%)</label>
                                    <input type="number" value={form.passingScore} onChange={e => f('passingScore', e.target.value)} placeholder="60"/>
                                </div>
                            </>}
                            {isLesson && (
                                <div className="form-group">
                                    <label>Статус</label>
                                    <select value={form.badge} onChange={e => f('badge', e.target.value)}>
                                        <option value="upcoming">Удахгүй</option>
                                        <option value="done">Дууссан</option>
                                        <option value="draft">Ноорог</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="form-group">
                        <label>Тайлбар</label>
                        <textarea value={form.description} onChange={e => f('description', e.target.value)} placeholder="Нэмэлт тайлбар..." rows={2}/>
                    </div>
                    <div className="modal-section-title" style={{ marginTop: 16 }}>Агуулга</div>
                    <div className="content-tab-switcher">
                        <button className={`cts-btn${tab === 'link' ? ' active' : ''}`} onClick={() => setTab('link')}>
                            <i className="fas fa-link"/> Линк оруулах
                        </button>
                        <button className={`cts-btn${tab === 'file' ? ' active' : ''}`} onClick={() => setTab('file')}>
                            <i className="fas fa-upload"/> Файл байршуулах
                        </button>
                    </div>
                    {tab === 'link' ? (
                        <div className="form-group" style={{ marginTop: 10 }}>
                            <label>Линк</label>
                            <div className="link-input-wrap">
                                <i className="fas fa-link link-icon"/>
                                <input value={form.contentUrl} onChange={e => f('contentUrl', e.target.value)}
                                    placeholder="https://example.com/..." className="link-input"/>
                                {form.contentUrl && (
                                    <a href={form.contentUrl} target="_blank" rel="noreferrer" className="link-preview-btn">
                                        <i className="fas fa-external-link-alt"/>
                                    </a>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginTop: 10 }}>
                            <FileDropzone files={files}
                                onFiles={ff => setFiles(p => [...p, ...ff])}
                                onRemove={i => setFiles(p => p.filter((_, idx) => idx !== i))}/>
                            {initial?.contentUrl && files.length === 0 && (
                                <div className="current-file-badge">
                                    <i className={`fas ${extIcon(initial.contentUrl)}`}/>
                                    Одоогийн файл: {initial.contentUrl}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="t-btn ghost" onClick={onClose}>Болих</button>
                    <button className="t-btn primary" onClick={save}>
                        <i className={`fas ${initial ? 'fa-save' : 'fa-plus'}`}/> {initial ? 'Хадгалах' : `${typeLabel} нэмэх`}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── ConfirmModal ──────────────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, title, msg, danger }) {
    if (!open) return null
    return (
        <div className="modal-overlay show" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal modal-sm">
                <div className="modal-header">
                    <h3><i className={`fas ${danger ? 'fa-trash' : 'fa-question-circle'}`} style={{ marginRight: 8, color: danger ? '#ef4444' : '#f59e0b' }}/>{title}</h3>
                    <button className="modal-close" onClick={onClose}><i className="fas fa-times"/></button>
                </div>
                <div className="modal-body"><p style={{ color: '#64748b', fontSize: 14 }}>{msg}</p></div>
                <div className="modal-footer">
                    <button className="t-btn ghost" onClick={onClose}>Болих</button>
                    <button className={`t-btn ${danger ? 'danger' : 'primary'}`} onClick={() => { onConfirm(); onClose() }}>
                        <i className={`fas ${danger ? 'fa-trash' : 'fa-check'}`}/> {danger ? 'Устгах' : 'Тийм'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── AddClassModal ─────────────────────────────────────────
function AddClassModal({ open, onClose, onAdd }) {
    const [form,   setForm]   = useState({ name: '', subject: 'Математик', color: COLORS[0], icon: 'fa-calculator', maxStudents: 30 })
    const [step,   setStep]   = useState('form')
    const [code,   setCode]   = useState('')
    const [copied, setCopied] = useState(false)
    const [err,    setErr]    = useState('')

    const close = () => { setStep('form'); setForm({ name: '', subject: 'Математик', color: COLORS[0], icon: 'fa-calculator', maxStudents: 30 }); setErr(''); setCopied(false); onClose() }

    const submit = () => {
        if (!form.name.trim()) { setErr('Ангийн нэр оруулна уу'); return }
        if (!form.maxStudents || form.maxStudents < 1) { setErr('Сурагчийн тоо зөв оруулна уу'); return }
        const newCode = generateCode(form.subject)
        setCode(newCode)
        onAdd({ id: uid('cls'), ...form, name: form.name.trim(), students: 0, avg: '-', avgClass: 'mid', avgNum: 0, classCode: newCode, lessons: [], exams: [], assignments: [], studentList: [] })
        setStep('code')
    }

    if (!open) return null
    return (
        <div className="modal-overlay show">
            <div className="modal">
                {step === 'form' ? (
                    <>
                        <div className="modal-header">
                            <h3><i className="fas fa-plus-circle" style={{ marginRight: 8, color: '#07437d' }}/>Шинэ анги нэмэх</h3>
                            <button className="modal-close" onClick={close}><i className="fas fa-times"/></button>
                        </div>
                        <div className="modal-body">
                            {err && <div className="form-error"><i className="fas fa-exclamation-circle"/> {err}</div>}
                            <div className="form-group">
                                <label>Ангийн нэр *</label>
                                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Жишээ: 10А анги"/>
                            </div>
                            <div className="form-row">
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label>Хичээлийн нэр</label>
                                    <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Сурагчийн хязгаар *</label>
                                    <input type="number" min="1" max="100" value={form.maxStudents}
                                        onChange={e => setForm(p => ({ ...p, maxStudents: parseInt(e.target.value) || 0 }))}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Өнгө</label>
                                <div className="color-row">
                                    {COLORS.map(c => (
                                        <div key={c} className={`color-pick${form.color === c ? ' active' : ''}`}
                                            style={{ background: c }} onClick={() => setForm(p => ({ ...p, color: c }))}/>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Дүрс</label>
                                <div className="icon-row">
                                    {ICONS.map(ic => (
                                        <div key={ic} className={`icon-pick${form.icon === ic ? ' active' : ''}`}
                                            style={form.icon === ic ? { borderColor: form.color, color: form.color } : {}}
                                            onClick={() => setForm(p => ({ ...p, icon: ic }))}>
                                            <i className={`fas ${ic}`}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="info-box blue">
                                <i className="fas fa-info-circle"/> Анги үүсгэхэд автоматаар <strong>нэгдэх код</strong> үүснэ.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="t-btn ghost" onClick={close}>Болих</button>
                            <button className="t-btn primary" onClick={submit}><i className="fas fa-plus"/> Анги үүсгэх</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="modal-header">
                            <h3><i className="fas fa-check-circle" style={{ marginRight: 8, color: '#059669' }}/>Анги амжилттай үүслээ!</h3>
                            <button className="modal-close" onClick={close}><i className="fas fa-times"/></button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Доорх кодыг сурагчдадаа хуваалцаарай.</p>
                            <div className="code-reveal-box">
                                <div className="crb-label">Ангийн нэгдэх код</div>
                                <div className="crb-code">{code}</div>
                                <button className={`crb-copy${copied ? ' copied' : ''}`}
                                    onClick={() => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000) }}>
                                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}/>
                                    {copied ? 'Хуулагдлаа!' : 'Код хуулах'}
                                </button>
                                <div className="crb-hint">Кодыг ангийн картнаас хэдийд ч дахин харж болно</div>
                            </div>
                            <div className="info-box green" style={{ marginTop: 14 }}>
                                <i className="fas fa-user-graduate"/> Сурагч: <strong>Нэвтрэх → "Ангид нэгдэх" → Код оруулах → Нэгдэх</strong>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="t-btn primary" onClick={close}>Ойлголоо</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// ── EditClassModal ────────────────────────────────────────
function EditClassModal({ open, onClose, cls, onSave }) {
    const [maxStudents, setMaxStudents] = useState(cls?.maxStudents || 30)
    useEffect(() => { if (open) setMaxStudents(cls?.maxStudents || 30) }, [open, cls])
    if (!open || !cls) return null
    return (
        <div className="modal-overlay show" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal modal-sm">
                <div className="modal-header">
                    <h3><i className="fas fa-cog" style={{ marginRight: 8, color: '#07437d' }}/>Анги тохируулах</h3>
                    <button className="modal-close" onClick={onClose}><i className="fas fa-times"/></button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Сурагчийн хязгаар</label>
                        <input type="number" min="1" max="100" value={maxStudents} onChange={e => setMaxStudents(parseInt(e.target.value) || 1)}/>
                        <div className="field-hint">Одоогийн сурагчийн тоо: <strong>{safe(cls.studentList).length}</strong></div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="t-btn ghost" onClick={onClose}>Болих</button>
                    <button className="t-btn primary" onClick={() => { onSave({ maxStudents }); onClose() }}>
                        <i className="fas fa-save"/> Хадгалах
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Panes ─────────────────────────────────────────────────
function LessonPane({ cls, idx, onUpdate, showToast }) {
    const [modal,   setModal]   = useState(false)
    const [editing, setEditing] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const lessons  = safe(cls.lessons)
    const done     = lessons.filter(l => l.badge === 'done').length
    const upcoming = lessons.filter(l => l.badge === 'upcoming').length
    const draft    = lessons.filter(l => l.badge === 'draft').length
    const donePct  = Math.round(done / (lessons.length || 1) * 100)
    const upPct    = Math.round(upcoming / (lessons.length || 1) * 100)

    const handleSave = async (data) => {
        const updated = editing ? lessons.map(l => l.id === editing.id ? { ...l, ...data } : l) : [...lessons, data]
        await api.patch(`/classes/${cls.id}`, { lessons: updated }).catch(() => {})
        onUpdate(idx, 'lessons', updated)
        showToast(editing ? 'Хичээл шинэчлэгдлээ' : 'Хичээл нэмэгдлээ')
        setModal(false)
    }
    const handleDelete = async (lsn) => {
        const updated = lessons.filter(l => l.id !== lsn.id)
        await api.patch(`/classes/${cls.id}`, { lessons: updated }).catch(() => {})
        onUpdate(idx, 'lessons', updated)
        showToast('Хичээл устгагдлаа', 'info')
    }
    const badgeLabel = b => b === 'done' ? 'Үзсэн' : b === 'upcoming' ? 'Удахгүй' : 'Ноорог'

    return (
        <div>
            <div className="cd-lesson-ov">
                <div className="cd-ov-seg"><div className="cd-ov-val" style={{ color: '#059669' }}>{done}</div><div className="cd-ov-lbl">Дууссан</div></div>
                <div className="cd-ov-seg"><div className="cd-ov-val" style={{ color: '#1d4ed8' }}>{upcoming}</div><div className="cd-ov-lbl">Удахгүй</div></div>
                <div className="cd-ov-seg"><div className="cd-ov-val" style={{ color: '#94a3b8' }}>{draft}</div><div className="cd-ov-lbl">Ноорог</div></div>
                <div className="cd-ov-seg"><div className="cd-ov-val">{lessons.length}</div><div className="cd-ov-lbl">Нийт</div></div>
                <div style={{ flex: 2, minWidth: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 5 }}>
                        <span>Ахиц</span><span style={{ fontWeight: 700, color: '#07437d' }}>{donePct}%</span>
                    </div>
                    <div className="cd-ov-stacked">
                        <div className="cd-ov-stacked-seg" style={{ width: `${donePct}%`, background: '#10b981' }}/>
                        <div className="cd-ov-stacked-seg" style={{ width: `${upPct}%`, background: '#93c5fd' }}/>
                        <div className="cd-ov-stacked-seg" style={{ flex: 1, background: '#f1f5f9' }}/>
                    </div>
                </div>
            </div>
            <div className="cd-pane-head">
                <div><h4>Хичээлийн хөтөлбөр</h4><p>Хөтөлбөрийн хэрэгжилт ба хичээл бүрийн статус</p></div>
                <button className="t-btn-sm" onClick={() => { setEditing(null); setModal(true) }}><i className="fas fa-plus"/> Нэмэх</button>
            </div>
            {lessons.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-book-open"/><p>Хичээл байхгүй байна</p>
                    <button className="t-btn primary" style={{ marginTop: 12 }} onClick={() => { setEditing(null); setModal(true) }}><i className="fas fa-plus"/> Хичээл нэмэх</button>
                </div>
            ) : (
                <div className="lesson-list">
                    {lessons.map((lsn, i) => (
                        <div className="lesson-item" key={lsn.id || i}>
                            <div className={`lesson-num${lsn.badge === 'done' ? ' done-num' : ''}`}>{i + 1}</div>
                            <div className="lesson-info">
                                <div className="lesson-title">{lsn.title}</div>
                                <div className="lesson-meta">
                                    <i className="fas fa-calendar-alt" style={{ marginRight: 4, fontSize: 10 }}/>{lsn.date}
                                    {lsn.duration && <><i className="fas fa-clock" style={{ marginLeft: 8, marginRight: 4, fontSize: 10 }}/>{lsn.duration} мин</>}
                                </div>
                                <ContentChip contentType={lsn.contentType} contentUrl={lsn.contentUrl} label="Хичээлийн линк"/>
                            </div>
                            <span className={`lesson-badge ${lsn.badge}`}>{badgeLabel(lsn.badge)}</span>
                            <button className="t-btn-icon" onClick={e => { e.stopPropagation(); setEditing(lsn); setModal(true) }}><i className="fas fa-pen"/></button>
                            <button className="t-btn-icon red" onClick={e => { e.stopPropagation(); setConfirm(lsn) }}><i className="fas fa-trash"/></button>
                        </div>
                    ))}
                </div>
            )}
            <ContentModal open={modal} onClose={() => setModal(false)} onSave={handleSave} type="lesson" initial={editing}/>
            <ConfirmModal open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => handleDelete(confirm)}
                title="Хичээл устгах" msg={`"${confirm?.title}" хичээлийг устгах уу?`} danger/>
        </div>
    )
}

function ExamPane({ cls, idx, onUpdate, showToast }) {
    const [modal,   setModal]   = useState(false)
    const [editing, setEditing] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const exams = safe(cls.exams)

    const handleSave = async (data) => {
        const total   = safe(cls.studentList).length
        const updated = editing
            ? exams.map(e => e.id === editing.id ? { ...e, ...data, submissions: e.submissions || [] } : e)
            : [...exams, { ...data, status: 'upcoming', result: null, resultNum: null, submissions: [], total }]
        await api.patch(`/classes/${cls.id}`, { exams: updated }).catch(() => {})
        onUpdate(idx, 'exams', updated)
        showToast(editing ? 'Шалгалт шинэчлэгдлээ' : 'Шалгалт нэмэгдлээ')
        setModal(false)
    }
    const handleDelete = async (exm) => {
        const updated = exams.filter(e => e.id !== exm.id)
        await api.patch(`/classes/${cls.id}`, { exams: updated }).catch(() => {})
        onUpdate(idx, 'exams', updated)
        showToast('Шалгалт устгагдлаа', 'info')
    }

    return (
        <div>
            <div className="cd-pane-head">
                <div><h4>Шалгалтууд</h4><p>Ангийн шалгалтын хуваарь ба дүн</p></div>
                <button className="t-btn-sm" onClick={() => { setEditing(null); setModal(true) }}><i className="fas fa-plus"/> Шалгалт үүсгэх</button>
            </div>
            {exams.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-pen-square"/><p>Шалгалт байхгүй байна</p>
                    <button className="t-btn primary" style={{ marginTop: 12 }} onClick={() => { setEditing(null); setModal(true) }}><i className="fas fa-plus"/> Шалгалт үүсгэх</button>
                </div>
            ) : (
                <div className="detail-exam-list">
                    {exams.map((exm, i) => {
                        const subs    = safe(exm.submissions)
                        const scored  = subs.filter(s => s.score != null)
                        const avg     = scored.length > 0 ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length) : (exm.resultNum || 0)
                        const hasDone = exm.status === 'done' || subs.length > 0 || !!exm.result
                        return (
                            <div className="detail-exam-item" key={exm.id || i}>
                                <div className={`exam-icon ${hasDone ? 'done' : 'upcoming'}`}>
                                    <i className={`fas ${hasDone ? 'fa-check-circle' : 'fa-pen-square'}`}/>
                                </div>
                                <div className="detail-exam-info">
                                    <div className="detail-exam-title">{exm.title}</div>
                                    <div className="detail-exam-meta">
                                        <i className="fas fa-calendar-alt" style={{ marginRight: 4, fontSize: 10 }}/>{exm.date || exm.meta}
                                        {exm.totalQuestions && <span style={{ marginLeft: 8 }}><i className="fas fa-list-ol" style={{ marginRight: 3 }}/>{exm.totalQuestions} асуулт</span>}
                                        {exm.duration && <span style={{ marginLeft: 8 }}><i className="fas fa-clock" style={{ marginRight: 3 }}/>{exm.duration} мин</span>}
                                    </div>
                                    <ContentChip contentType={exm.contentType} contentUrl={exm.contentUrl} label="Шалгалт нээх"/>
                                    <div className="exam-sub-stats">
                                        <span className="ess-badge sub"><i className="fas fa-user-check"/> {subs.length} ирүүлсэн</span>
                                        {hasDone && avg > 0 && (
                                            <span className={`ess-badge score ${avg >= 75 ? 'good' : avg >= 60 ? 'mid' : 'low'}`}>
                                                <i className="fas fa-chart-bar"/> Дундаж: {avg}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {hasDone && avg > 0 ? (
                                    <div className="exam-score-bar">
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#07437d', textAlign: 'right', marginBottom: 4 }}>{avg}%</div>
                                        <div className="esb-track">
                                            <div className="esb-fill" style={{ width: `${Math.min(avg, 100)}%`, background: avg >= 75 ? '#10b981' : avg >= 60 ? '#f59e0b' : '#ef4444' }}/>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="exam-scheduled-badge"><i className="fas fa-hourglass-half"/> Хүлээгдэж буй</span>
                                )}
                                <button className="t-btn-icon" onClick={e => { e.stopPropagation(); setEditing(exm); setModal(true) }}><i className="fas fa-pen"/></button>
                                <button className="t-btn-icon red" onClick={e => { e.stopPropagation(); setConfirm(exm) }}><i className="fas fa-trash"/></button>
                            </div>
                        )
                    })}
                </div>
            )}
            <ContentModal open={modal} onClose={() => setModal(false)} onSave={handleSave} type="exam" initial={editing}/>
            <ConfirmModal open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => handleDelete(confirm)}
                title="Шалгалт устгах" msg={`"${confirm?.title}" шалгалтыг устгах уу?`} danger/>
        </div>
    )
}

function AssignPane({ cls, idx, onUpdate, showToast }) {
    const [modal,   setModal]   = useState(false)
    const [editing, setEditing] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const assignments = safe(cls.assignments)
    const statusLabel = s => s === 'active' ? 'Идэвхтэй' : s === 'late' ? 'Хугацаа өнгөрсөн' : s === 'done' ? 'Дууссан' : 'Удахгүй'

    const handleSave = async (data) => {
        const total   = safe(cls.studentList).length
        const updated = editing
            ? assignments.map(a => a.id === editing.id ? { ...a, ...data } : a)
            : [...assignments, { ...data, status: 'active', submissions: [], submitted: 0, total }]
        await api.patch(`/classes/${cls.id}`, { assignments: updated }).catch(() => {})
        onUpdate(idx, 'assignments', updated)
        showToast(editing ? 'Даалгавар шинэчлэгдлээ' : 'Даалгавар нэмэгдлээ')
        setModal(false)
    }
    const handleDelete = async (asn) => {
        const updated = assignments.filter(a => a.id !== asn.id)
        await api.patch(`/classes/${cls.id}`, { assignments: updated }).catch(() => {})
        onUpdate(idx, 'assignments', updated)
        showToast('Даалгавар устгагдлаа', 'info')
    }

    return (
        <div>
            <div className="cd-pane-head">
                <div><h4>Гэрийн даалгавар</h4><p>Даалгаврын явц ба ирүүлсэн байдал</p></div>
                <button className="t-btn-sm" onClick={() => { setEditing(null); setModal(true) }}><i className="fas fa-plus"/> Өгөх</button>
            </div>
            {assignments.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-tasks"/><p>Даалгавар байхгүй байна</p>
                    <button className="t-btn primary" style={{ marginTop: 12 }} onClick={() => { setEditing(null); setModal(true) }}><i className="fas fa-plus"/> Даалгавар өгөх</button>
                </div>
            ) : (
                <div className="detail-assign-list">
                    {assignments.map((asn, i) => {
                        const subs      = safe(asn.submissions)
                        const scored    = subs.filter(s => s.score != null)
                        const submitted = subs.length
                        const total     = safe(cls.studentList).length || asn.total || 1
                        const pct       = Math.round((submitted / total) * 100)
                        const avgScore  = scored.length > 0 ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length) : null
                        const st        = asn.status || 'active'
                        return (
                            <div className="detail-assign-item" key={asn.id || i}>
                                <div className={`assign-icon ${st}`}>
                                    <i className={`fas ${st==='active'?'fa-file-alt':st==='late'?'fa-exclamation-circle':st==='done'?'fa-check':'fa-clock'}`}/>
                                </div>
                                <div className="detail-assign-info">
                                    <div className="detail-assign-title">{asn.title}</div>
                                    <div className="detail-assign-meta">
                                        <i className="fas fa-calendar-alt" style={{ marginRight: 4, fontSize: 10 }}/>Дуусах: {asn.dueDate || asn.meta}
                                    </div>
                                    <ContentChip contentType={asn.contentType} contentUrl={asn.contentUrl} label="Даалгавар нээх"/>
                                    {avgScore !== null && (
                                        <span className={`ess-badge score ${avgScore >= 75 ? 'good' : avgScore >= 60 ? 'mid' : 'low'}`} style={{ marginTop: 4, display: 'inline-flex' }}>
                                            <i className="fas fa-chart-bar"/> Дундаж оноо: {avgScore}%
                                        </span>
                                    )}
                                </div>
                                <div className="assign-submit-stat">
                                    <div className="submit-bar-label">Ирүүлсэн</div>
                                    <div className="submit-bar-track"><div className="submit-bar-fill" style={{ width: `${pct}%` }}/></div>
                                    <div className="submit-pct">{submitted}/{total}</div>
                                </div>
                                <span className={`assign-badge ${st}`}>{statusLabel(st)}</span>
                                <button className="t-btn-icon" onClick={e => { e.stopPropagation(); setEditing(asn); setModal(true) }}><i className="fas fa-pen"/></button>
                                <button className="t-btn-icon red" onClick={e => { e.stopPropagation(); setConfirm(asn) }}><i className="fas fa-trash"/></button>
                            </div>
                        )
                    })}
                </div>
            )}
            <ContentModal open={modal} onClose={() => setModal(false)} onSave={handleSave} type="assignment" initial={editing}/>
            <ConfirmModal open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => handleDelete(confirm)}
                title="Даалгавар устгах" msg={`"${confirm?.title}" даалгаврыг устгах уу?`} danger/>
        </div>
    )
}

function StudentPane({ cls, idx, onUpdate, showToast }) {
    const [q,       setQ]       = useState('')
    const [confirm, setConfirm] = useState(null)
    const studentList = safe(cls.studentList)
    const filtered    = studentList
        .map(student => {
            const metrics = studentMetrics(cls, student.id)
            return { ...student, metrics, computedScore: metrics.score }
        })
        .filter(s => stuName(s).toLowerCase().includes(q.toLowerCase()))
    const sorted      = [...filtered].sort((a, b) => (b.computedScore ?? -1) - (a.computedScore ?? -1))
    const rankCls     = i => i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''
    const scoreColor  = s => s >= 75 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444'

    const handleRemove = async (stu) => {
        const updated = studentList.filter(s => s.id !== stu.id)
        await api.patch(`/classes/${cls.id}`, { studentList: updated, students: updated.length }).catch(() => {})
        try {
            const { data: freshUser } = await api.get(`/users/${stu.id}`)
            const classIds = Array.isArray(freshUser.classId)
                ? freshUser.classId
                : [freshUser.classId].filter(Boolean)
            const classProgress = { ...(freshUser.classProgress || {}) }
            delete classProgress[cls.id]
            await api.patch(`/users/${stu.id}`, {
                classId: classIds.filter(id => id !== cls.id),
                classProgress,
            })
        } catch (err) {
            console.error(err)
        }
        onUpdate(idx, 'studentList', updated)
        onUpdate(idx, 'students', updated.length)
        showToast(`${stuName(stu)} ангиас хасагдлаа`, 'info')
    }

    const maxStu  = cls.maxStudents || 30
    const fillPct = Math.round((studentList.length / maxStu) * 100)

    return (
        <div>
            <div className="stu-capacity-bar">
                <div className="scb-info">
                    <span>Суудлын тоо</span>
                    <span style={{ fontWeight: 700, color: fillPct >= 90 ? '#ef4444' : fillPct >= 70 ? '#f59e0b' : '#059669' }}>{studentList.length} / {maxStu}</span>
                </div>
                <div className="scb-track">
                    <div className="scb-fill" style={{ width: `${Math.min(fillPct, 100)}%`, background: fillPct >= 90 ? '#ef4444' : fillPct >= 70 ? '#f59e0b' : '#10b981' }}/>
                </div>
            </div>
            <div className="info-box blue" style={{ marginBottom: 16 }}>
                <i className="fas fa-info-circle"/> Сурагчид <strong>ангийн кодыг</strong> оруулж нэгдэнэ.
            </div>
            <div className="student-table-header">
                <div className="stu-search">
                    <i className="fas fa-search"/>
                    <input placeholder="Сурагч хайх..." value={q} onChange={e => setQ(e.target.value)}/>
                </div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Нийт {studentList.length} сурагч</span>
            </div>
            {sorted.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-users"/>
                    <p>{q ? `"${q}" хайлтад тохирох сурагч олдсонгүй` : 'Сурагч бүртгэгдээгүй байна'}</p>
                </div>
            ) : (
                <div className="student-grid">
                    {sorted.map((stu, i) => (
                        <div className="student-card" key={stu.id || i}>
                            <div className="student-av" style={{ background: stu.color || `${COLORS[i % COLORS.length]}22`, color: stu.tc || COLORS[i % COLORS.length] }}>
                                {stu.av || stuName(stu).charAt(0) || 'S'}
                            </div>
                            <div className="student-info">
                                <div className="student-name">{stuName(stu)}</div>
                                <div className="student-score-row">
                                    <div className="student-score-bar">
                                        <div className="student-score-fill" style={{ width: `${stu.computedScore ?? 0}%`, background: scoreColor(stu.computedScore ?? 0) }}/>
                                    </div>
                                    <span className="student-score-pct" style={{ color: stu.computedScore == null ? '#94a3b8' : scoreColor(stu.computedScore) }}>
                                        {stu.computedScore == null ? '—' : `${stu.computedScore}%`}
                                    </span>
                                </div>
                                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                                    Хичээл: {stu.metrics.completedLessons}/{stu.metrics.lessonCount}
                                </div>
                            </div>
                            <div className={`student-rank ${rankCls(i)}`}>{i + 1}</div>
                            <button className="t-btn-icon red stu-remove" onClick={() => setConfirm(stu)}>
                                <i className="fas fa-user-minus"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <ConfirmModal open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => handleRemove(confirm)}
                title="Сурагч хасах" msg={`"${stuName(confirm)}" сурагчийг ангиас хасах уу?`} danger/>
        </div>
    )
}

// ── ClassDetail ───────────────────────────────────────────
function ClassDetail({ cls, idx, onUpdate, onClose, showToast }) {
    const [tab,      setTab]      = useState('lessons')
    const [editOpen, setEditOpen] = useState(false)
    if (!cls) return null

    const lessons     = safe(cls.lessons)
    const exams       = safe(cls.exams)
    const assignments = safe(cls.assignments)
    const studentList = safe(cls.studentList)
    const done         = lessons.filter(l => l.badge === 'done').length
    const pct          = Math.round(done / (lessons.length || 1) * 100)
    const activeAssign = assignments.filter(a => a.status === 'active').length
    const bannerBg     = `linear-gradient(160deg, color-mix(in srgb, ${cls.color} 10%, #fff) 0%, #fff 70%)`

    const tabs = [
        { id: 'lessons',     label: 'Хичээлүүд',   icon: 'fa-book-open',  count: lessons.length     },
        { id: 'exams',       label: 'Шалгалтууд',   icon: 'fa-pen-square', count: exams.length       },
        { id: 'assignments', label: 'Даалгаварууд', icon: 'fa-tasks',      count: assignments.length },
        { id: 'students',    label: 'Сурагчид',     icon: 'fa-users',      count: studentList.length },
    ]

    const handleEditSave = async (data) => {
        await api.patch(`/classes/${cls.id}`, data).catch(() => {})
        Object.entries(data).forEach(([k, v]) => onUpdate(idx, k, v))
        showToast('Анги шинэчлэгдлээ')
    }

    return (
        <div className="class-detail">
            <div className="cd-banner" style={{ background: bannerBg }}>
                <div className="cd-banner-top">
                    <div className="cd-banner-icon" style={{ background: `color-mix(in srgb, ${cls.color} 14%, #fff)`, color: cls.color }}>
                        <i className={`fas ${cls.icon}`}/>
                    </div>
                    <div className="cd-banner-info">
                        <div className="cd-banner-title">{cls.name} - {cls.subject}</div>
                        <div className="cd-banner-meta">
                            <span><i className="fas fa-users" style={{ color: cls.color }}/> {studentList.length}/{cls.maxStudents || 30} сурагч</span>
                            <span><i className="fas fa-book" style={{ color: cls.color }}/> {lessons.length} хичээл</span>
                            <span><i className="fas fa-chart-bar" style={{ color: cls.color }}/> Дундаж: {cls.avg}</span>
                        </div>
                    </div>
                    <div className="cd-banner-actions">
                        <button className="t-btn ghost sm" onClick={() => setEditOpen(true)}><i className="fas fa-cog"/> Тохируулах</button>
                        <button className="t-btn ghost sm" onClick={onClose}><i className="fas fa-times"/> Хаах</button>
                    </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>
                        <i className="fas fa-key"/> Сурагчдад хуваалцах код
                    </div>
                    <ClassCodeBadge code={cls.classCode}/>
                </div>
                <div className="cd-kpis">
                    <div className="cd-kpi"><div className="cd-kpi-val" style={{ color: cls.color }}>{pct}%</div><div className="cd-kpi-lbl">Хөтөлбөр</div></div>
                    <div className="cd-kpi"><div className="cd-kpi-val" style={{ color: cls.color }}>{done}/{lessons.length}</div><div className="cd-kpi-lbl">Хичээл дууссан</div></div>
                    <div className="cd-kpi"><div className="cd-kpi-val" style={{ color: cls.color }}>{activeAssign}</div><div className="cd-kpi-lbl">Идэвхтэй даалгавар</div></div>
                    <div className="cd-kpi"><div className="cd-kpi-val" style={{ color: cls.color }}>{cls.avg}</div><div className="cd-kpi-lbl">Ангийн дундаж</div></div>
                </div>
            </div>
            <div className="cd-tabs">
                {tabs.map(t => (
                    <button key={t.id} className={`cd-tab${tab === t.id ? ' active' : ''}`}
                        style={tab === t.id ? { color: cls.color } : {}} onClick={() => setTab(t.id)}>
                        <i className={`fas ${t.icon}`}/> {t.label}
                        <span className="tc">{t.count}</span>
                    </button>
                ))}
            </div>
            <div className="cd-content">
                {tab === 'lessons'     && <LessonPane  cls={cls} idx={idx} onUpdate={onUpdate} showToast={showToast}/>}
                {tab === 'exams'       && <ExamPane    cls={cls} idx={idx} onUpdate={onUpdate} showToast={showToast}/>}
                {tab === 'assignments' && <AssignPane  cls={cls} idx={idx} onUpdate={onUpdate} showToast={showToast}/>}
                {tab === 'students'    && <StudentPane cls={cls} idx={idx} onUpdate={onUpdate} showToast={showToast}/>}
            </div>
            <EditClassModal open={editOpen} onClose={() => setEditOpen(false)} cls={cls} onSave={handleEditSave}/>
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────
function TeacherClasses() {
    const { user } = useAuth()
    const [classes,  setClasses]  = useState([])
    const [selected, setSelected] = useState(-1)
    const [loading,  setLoading]  = useState(true)
    const [error,    setError]    = useState(null)
    const [q,        setQ]        = useState('')
    const [addModal, setAddModal] = useState(false)
    const [delCls,   setDelCls]   = useState(null)
    const [showToast, toastEl]    = useToast()

    const fetchClasses = useCallback(async () => {
        try {
            setLoading(true); setError(null)
            const [{ data }, { data: users }] = await Promise.all([
                api.get(`/classes?teacherId=${user.id}`),
                api.get('/users'),
            ])
            const usersById = new Map(safe(users).map(item => [item.id, item]))
            setClasses(data.map(cls => ({
                ...cls,
                studentList: safe(cls.studentList).map(student => ({
                    ...student,
                    classProgress: usersById.get(student.id)?.classProgress?.[cls.id] || { completedLessons: [], completedAssignments: [] },
                })),
            })))
        } catch (err) {
            setError(err.response?.data?.error || 'Сервертэй холбогдож чадсангүй')
        } finally {
            setLoading(false)
        }
    }, [user.id])

    useEffect(() => { fetchClasses() }, [fetchClasses])

    const totalStudents    = classes.reduce((s, c) => s + safe(c.studentList).length, 0)
    const totalLessons     = classes.reduce((s, c) => s + safe(c.lessons).length, 0)
    const totalAssignments = classes.reduce((s, c) => s + safe(c.assignments).length, 0)
    const filtered         = classes.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.subject.toLowerCase().includes(q.toLowerCase()))

    const selectClass = (idx) => {
        const next = selected === idx ? -1 : idx
        setSelected(next)
        if (next !== -1) setTimeout(() => document.getElementById('cd-anchor')?.scrollIntoView({ behavior: 'smooth' }), 80)
    }

    const handleUpdate = useCallback((idx, field, value) => {
        setClasses(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c))
    }, [])

    const handleAdd = async (newClass) => {
        try {
            const { data: saved } = await api.post('/classes', { ...newClass, teacherId: user.id })
            setClasses(prev => [...prev, saved])
        } catch {
            setClasses(prev => [...prev, { ...newClass, teacherId: user.id }])
        }
        showToast('Анги амжилттай үүслээ')
    }

    const handleDeleteClass = async (cls) => {
        await api.delete(`/classes/${cls.id}`).catch(() => {})
        setClasses(prev => prev.filter(c => c.id !== cls.id))
        if (classes[selected]?.id === cls.id) setSelected(-1)
        showToast('Анги устгагдлаа', 'info')
    }

    if (loading) return <div className="page-content" style={{ padding: 60, textAlign: 'center', color: '#64748b' }}><i className="fas fa-spinner fa-spin" style={{ fontSize: 28, marginBottom: 12, display: 'block' }}/>Ачаалж байна...</div>
    if (error)   return <div className="page-content" style={{ padding: 60, textAlign: 'center', color: '#ef4444' }}><i className="fas fa-exclamation-triangle" style={{ fontSize: 28, marginBottom: 12, display: 'block' }}/>{error}<br/><button className="t-btn primary" style={{ marginTop: 16 }} onClick={fetchClasses}>Дахин оролдох</button></div>

    return (
        <div className="page-content">
            {toastEl}
            <div className="tc-page-header">
                <div>
                    <h1>Миний ангиуд</h1>
                    <p>Нийт {classes.length} анги · {totalStudents} сурагч удирдаж байна</p>
                </div>
                <button className="t-btn primary" onClick={() => setAddModal(true)}><i className="fas fa-plus"/> Анги нэмэх</button>
            </div>

            <div className="tc-summary">
                {[
                    { icon: 'fa-chalkboard-teacher', bg: '#dbeafe', color: '#1d4ed8', val: classes.length,     lbl: 'Нийт анги'     },
                    { icon: 'fa-users',              bg: '#d1fae5', color: '#065f46', val: totalStudents,       lbl: 'Нийт сурагч'   },
                    { icon: 'fa-book-open',          bg: '#ede9fe', color: '#5b21b6', val: totalLessons,        lbl: 'Нийт хичээл'   },
                    { icon: 'fa-tasks',              bg: '#fef3c7', color: '#92400e', val: totalAssignments,    lbl: 'Нийт даалгавар'},
                ].map((s, i) => (
                    <div key={i} className="tc-sum-card">
                        <div className="tc-sum-icon" style={{ background: s.bg, color: s.color }}><i className={`fas ${s.icon}`}/></div>
                        <div><div className="tc-sum-val">{s.val}</div><div className="tc-sum-lbl">{s.lbl}</div></div>
                    </div>
                ))}
            </div>

            <div className="class-search-wrap">
                <div className="class-search-bar">
                    <i className="fas fa-search"/>
                    <input type="text" placeholder="Анги, хичээлээр хайх..." value={q} onChange={e => setQ(e.target.value)}/>
                    {q && <button className="search-clear-btn" onClick={() => setQ('')}><i className="fas fa-times"/></button>}
                </div>
                {q && <span className="search-result-badge">{filtered.length} анги олдлоо</span>}
            </div>

            <div className="class-grid">
                {filtered.map(c => {
                    const realIdx  = classes.findIndex(item => item.id === c.id)
                    const lessons  = safe(c.lessons)
                    const done     = lessons.filter(l => l.badge === 'done').length
                    const donePct  = Math.round(done / (lessons.length || 1) * 100)
                    const isSel    = selected === realIdx
                    const stuCount = safe(c.studentList).length
                    const maxStu   = c.maxStudents || 30
                    const capPct   = Math.round((stuCount / maxStu) * 100)
                    return (
                        <div key={c.id}
                            className={`class-card${isSel ? ' selected' : ''}`}
                            style={isSel ? { borderColor: c.color, boxShadow: `0 8px 0 ${c.color}22, 0 14px 38px ${c.color}55` } : {}}
                            onClick={() => selectClass(realIdx)}>
                            <div className="class-card-top" style={{ background: c.color }}/>
                            <button className="class-card-delete" onClick={e => { e.stopPropagation(); setDelCls(c) }}>
                                <i className="fas fa-trash"/>
                            </button>
                            <div className="class-card-body">
                                <div className="cc-subject-row">
                                    <div className="cc-subject-icon" style={{ background: `color-mix(in srgb, ${c.color} 13%, #fff)`, color: c.color }}>
                                        <i className={`fas ${c.icon}`}/>
                                    </div>
                                    <div className="cc-subject-text">
                                        <div className="cc-class-name">{c.name}</div>
                                        <div className="cc-subject-name">{c.subject}</div>
                                    </div>
                                </div>
                                <div className="class-card-stats">
                                    <div className="cc-stat"><strong>{stuCount}</strong><span>Сурагч</span></div>
                                    <div className="cc-stat"><strong>{lessons.length}</strong><span>Хичээл</span></div>
                                    <div className="cc-stat"><strong>{safe(c.exams).length}</strong><span>Шалгалт</span></div>
                                    <div className="cc-stat"><strong>{safe(c.assignments).length}</strong><span>Даалгавар</span></div>
                                </div>
                                <div className="cc-capacity">
                                    <div className="cc-cap-header">
                                        <span style={{ fontSize: 11, color: '#64748b' }}>Суудлын тоо</span>
                                        <span style={{ fontSize: 11, fontWeight: 700, color: capPct >= 90 ? '#ef4444' : capPct >= 70 ? '#f59e0b' : '#059669' }}>{stuCount}/{maxStu}</span>
                                    </div>
                                    <div className="cc-cap-track">
                                        <div className="cc-cap-fill" style={{ width: `${Math.min(capPct, 100)}%`, background: capPct >= 90 ? '#ef4444' : capPct >= 70 ? '#f59e0b' : c.color }}/>
                                    </div>
                                </div>
                                <div className="cc-progress">
                                    <div className="cc-progress-header"><span>Хөтөлбөрийн ахиц</span><span>{donePct}%</span></div>
                                    <div className="cc-progress-track">
                                        <div className="cc-progress-fill" style={{ width: donePct + '%', background: c.color }}/>
                                    </div>
                                </div>
                            </div>
                            <div className="class-card-footer">
                                <span className={`cc-avg ${c.avgClass}`}><i className="fas fa-chart-bar" style={{ marginRight: 4 }}/>Дундаж: {c.avg}</span>
                                <i className={`fas fa-chevron-down cc-arrow${isSel ? ' rotated' : ''}`}/>
                            </div>
                        </div>
                    )
                })}
                {filtered.length === 0 && (
                    <div className="class-no-results"><i className="fas fa-search-minus"/><p>"{q}" хайлтад тохирох анги олдсонгүй</p></div>
                )}
            </div>

            <div id="cd-anchor" style={{ height: 1 }}/>
            {selected !== -1 && selected < classes.length && (
                <ClassDetail cls={classes[selected]} idx={selected} onUpdate={handleUpdate} onClose={() => setSelected(-1)} showToast={showToast}/>
            )}

            <AddClassModal open={addModal} onClose={() => setAddModal(false)} onAdd={handleAdd}/>
            <ConfirmModal open={!!delCls} onClose={() => setDelCls(null)} onConfirm={() => handleDeleteClass(delCls)}
                title="Анги устгах" msg={`"${delCls?.name}" ангийг бүрмөсөн устгах уу?`} danger/>
        </div>
    )
}

export default TeacherClasses
