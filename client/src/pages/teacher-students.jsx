import { useState, useEffect, useMemo } from 'react'
import api from '../services/api'

const PALETTE = [
  { bg: '#dbeafe', tc: '#1d4ed8', btn: '#3b82f6', tag: '#eff6ff', tagTc: '#1d4ed8' },
  { bg: '#d1fae5', tc: '#065f46', btn: '#10b981', tag: '#f0fdf4', tagTc: '#065f46' },
  { bg: '#fef3c7', tc: '#92400e', btn: '#f59e0b', tag: '#fffbeb', tagTc: '#b45309' },
  { bg: '#ede9fe', tc: '#5b21b6', btn: '#8b5cf6', tag: '#f5f3ff', tagTc: '#5b21b6' },
  { bg: '#fee2e2', tc: '#991b1b', btn: '#ef4444', tag: '#fef2f2', tagTc: '#dc2626' },
  { bg: '#cffafe', tc: '#164e63', btn: '#06b6d4', tag: '#ecfeff', tagTc: '#0e7490' },
];


const stuName = (s) => s ? [s.firstName, s.lastName].filter(Boolean).join(' ') : '';
const safe    = (arr) => Array.isArray(arr) ? arr : [];

const avg = (nums) => nums.length
  ? Math.round(nums.reduce((sum, n) => sum + n, 0) / nums.length)
  : null;

function metricsForStudent(cls, student, user) {
  const examScores = safe(cls.exams).flatMap(ex =>
    safe(ex.submissions)
      .filter(sub => sub.studentId === student.id || sub.id === student.id)
      .map(sub => Number(sub.score))
      .filter(Number.isFinite)
  );
  const assignScores = safe(cls.assignments).flatMap(asn =>
    safe(asn.submissions)
      .filter(sub => sub.studentId === student.id || sub.id === student.id)
      .map(sub => Number(sub.score))
      .filter(Number.isFinite)
  );
  const completedLessons = safe(user?.classProgress?.[cls.id]?.completedLessons).length;
  const lessonCount = safe(cls.lessons).length;
  const lessonScore = lessonCount > 0 && completedLessons > 0
    ? Math.round((completedLessons / lessonCount) * 100)
    : null;

  return {
    score: avg([...examScores, ...assignScores, lessonScore].filter(Number.isFinite)),
    examScores,
    assignScores,
    examCount: examScores.length,
    assignCount: assignScores.length,
    completedLessons,
    lessonCount,
    lessonScore,
  };
}

function TeacherStudents() {
  const storedId  = sessionStorage.getItem('user_id') || sessionStorage.getItem('userId');
  let teacherId   = storedId || 'teacher_1';
  if (!storedId) {
    try { const u = JSON.parse(sessionStorage.getItem('user') || '{}'); if (u.id) teacherId = u.id; } catch (err) { console.error(err); }
  }

  const [classes, setClasses]                 = useState([]);
  const [students, setStudents]               = useState([]);
  const [selectedClass, setSelectedClass]     = useState('all');
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [searchTerm, setSearchTerm]           = useState('');
  const [sortKey, setSortKey]                 = useState('score-desc');
  const [selectedStudent, setSelectedStudent] = useState(null);

 
  useEffect(() => {
    setLoading(true);
    api.get(`/classes?teacherId=${teacherId}`)
      .then(res => res.data)
      .then(async data => {
        const { data: users } = await api.get('/users');
        const usersById = new Map(safe(users).map(user => [user.id, user]));
        setClasses(data);

        const allStudents = data.flatMap((cls, ci) => {
          const pal = PALETTE[ci % PALETTE.length];
          return safe(cls.studentList)
            .filter(s => s != null)          
            .map(s => {
              const metrics = metricsForStudent(cls, s, usersById.get(s.id));

              return {
                ...s,
                _name:       stuName(s),                   
                ...metrics,
                className:   cls.name,                       
                classId:     cls.id,
                subject:     cls.subject,
                _palette: {
                  bg:    s.color  || pal.bg,
                  tc:    s.tc     || pal.tc,
                  btn:   cls.color || pal.btn,
                  tag:   pal.tag,
                  tagTc: pal.tagTc,
                },
              };
            });
        });

        setStudents(allStudents);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [teacherId]);


  const filteredStudents = useMemo(() => {
    let list = students.filter(s => {
      const matchClass  = selectedClass === 'all' || s.classId === selectedClass;
      const matchSearch = s._name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchClass && matchSearch;
    });

    if (sortKey === 'score-desc') list.sort((a, b) => (b.score ?? -1) - (a.score ?? -1) || a._name.localeCompare(b._name, 'mn'));
    else if (sortKey === 'score-asc') list.sort((a, b) => (a.score ?? 101) - (b.score ?? 101) || a._name.localeCompare(b._name, 'mn'));
    else if (sortKey === 'name-asc')  list.sort((a, b) => a._name.localeCompare(b._name, 'mn'));

    return list;
  }, [students, selectedClass, searchTerm, sortKey]);

 
  const stats = useMemo(() => {
    if (!filteredStudents.length) return { count: 0, high: '—', avg: '—', warn: 0 };
    const scores = filteredStudents.map(s => s.score).filter(Number.isFinite);
    if (!scores.length) return { count: filteredStudents.length, high: '—', avg: '—', warn: 0 };
    return {
      count: filteredStudents.length,
      high:  Math.max(...scores),
      avg:   Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      warn:  filteredStudents.filter(s => Number.isFinite(s.score) && s.score < 60).length,
    };
  }, [filteredStudents]);


  if (loading) return (
    <div className="page">
      <div className="ts-loading">
        <div className="ts-spinner"></div>
        <p>Ачаалж байна...</p>
      </div>
    </div>
  );


  if (error) return (
    <div className="page">
      <div className="ts-error">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Холбогдоход алдаа гарлаа</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Дахин оролдох</button>
      </div>
    </div>
  );


  return (
    <div className="page">
      <div className="students-layout">

  
        <div className="left-panel">
          <div className="lp-header">
            <h1><i className="fas fa-user-graduate"></i> Сурагчид</h1>
            <p>Ангиар шүүж харах боломжтой</p>
          </div>

          <div className="lp-stats">
            <StatCard icon="users"                val={stats.count}      lbl="Нийт сурагч"   bg="#dbeafe" color="#1d4ed8" />
            <StatCard icon="trophy"               val={stats.high === '—' ? '—' : `${stats.high}%`} lbl="Хамгийн өндөр" bg="#d1fae5" color="#065f46" />
            <StatCard icon="chart-line"           val={stats.avg === '—' ? '—' : `${stats.avg}%`}  lbl="Нийт дундаж"   bg="#fef3c7" color="#92400e" />
            <StatCard icon="exclamation-triangle" val={stats.warn}       lbl="Анхааруулга"   bg="#fee2e2" color="#991b1b" />
          </div>

          <div className="lp-section-label">Анги сонгох</div>
          <div className="cls-filters-wrap">
            <ClassCard
              isAll
              count={students.length}
              active={selectedClass === 'all'}
              onClick={() => setSelectedClass('all')}
            />
            {classes.map((cls, idx) => (
              <ClassCard
                key={cls.id}
                name={cls.name}                   
                subject={cls.subject}
                count={safe(cls.studentList).length}
                avg={cls.avgNum}
                color={PALETTE[idx % PALETTE.length]}
                clsColor={cls.color}
                active={selectedClass === cls.id}
                onClick={() => setSelectedClass(cls.id)}
              />
            ))}
          </div>
        </div>

       
        <div className="right-panel">
          <div className="rp-toolbar">
            <div className="rp-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Сурагчийн нэрээр хайх..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="rp-sort" value={sortKey} onChange={e => setSortKey(e.target.value)}>
              <option value="score-desc">Оноогоор ↓</option>
              <option value="score-asc">Оноогоор ↑</option>
              <option value="name-asc">Нэрээр А–Я</option>
            </select>
            <div className="rp-count"><span>{filteredStudents.length}</span> сурагч</div>
          </div>

          <div className="student-table-wrap">
            <table className="student-table">
              <thead>
                <tr>
                  <th style={{width:'36px'}}>#</th>
                  <th>Сурагч</th>
                  <th>Анги</th>
                  <th>Шалгалт</th>
                  <th>Даалгавар</th>
                  <th style={{textAlign:'right'}}>Дундаж оноо</th>
                  <th style={{textAlign:'center', width:'60px'}}>Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0
                  ? filteredStudents.map((s, idx) => {
                      const pal   = s._palette;
                      const rank  = idx + 1;
                      const isTop3 = rank <= 3;
                      const score = Number.isFinite(s.score) ? s.score : null;
                      return (
                        <tr key={s.id} onClick={() => setSelectedStudent(s)}>
                          <td>
                            <div className={`rank-badge ${isTop3 ? `rank-${rank}` : 'rank-n'}`}>
                              {rank}
                            </div>
                          </td>
                          <td>
                            <div className="st-name-cell">
                              <div className="st-av" style={{background: pal.bg, color: pal.tc}}>
                                {s.av || s._name.charAt(0)}
                              </div>
                              <div>
                                <div className="st-name">{s._name}</div>
                                <div className="st-email">
                                  {s._name.toLowerCase().replace(/\s/g,'')}@school.edu
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="class-tag" style={{background: pal.tag, color: pal.tagTc}}>
                              {s.className}
                            </span>
                          </td>
                          <td>
                            <span style={{fontWeight:600}}>{s.examCount}</span>{' '}
                            <span className="st-meta-txt">шалгалт</span>
                          </td>
                          <td>
                            <span style={{fontWeight:600}}>{s.assignCount}</span>{' '}
                            <span className="st-meta-txt">даалгавар</span>
                          </td>
                          <td className="score-cell">
                            <div className={`score-val ${score == null ? '' : score>=80?'score-high':score>=65?'score-mid':'score-low'}`}>
                              {score == null ? '—' : `${score}%`}
                            </div>
                            <div className="score-bar-wrap">
                              <div className="score-bar-track">
                                <div
                                  className={`score-bar-fill ${score == null ? '' : score>=80?'bar-high':score>=65?'bar-mid':'bar-low'}`}
                                  style={{width:`${score ?? 0}%`}}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td style={{textAlign:'center'}}>
                            <div className="st-actions" onClick={e => e.stopPropagation()}>
                              <button className="st-btn-icon" title="Дэлгэрэнгүй"
                                onClick={() => setSelectedStudent(s)}>
                                <i className="fas fa-chart-line"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  : (
                    <tr>
                      <td colSpan="7" className="st-empty">
                        <i className="fas fa-search"></i>
                        <span>Мэдээлэл олдсонгүй</span>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

 
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}


function StudentModal({ student: s, onClose }) {
  const score = Number.isFinite(s.score) ? s.score : null;
  const grade = score == null ? '—' : score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 65 ? 'C' : 'D';

  const examAvg = s.examScores.length
    ? Math.round(s.examScores.reduce((a, b) => a + b, 0) / s.examScores.length)
    : null;
  const assignAvg = s.assignScores.length
    ? Math.round(s.assignScores.reduce((a, b) => a + b, 0) / s.assignScores.length)
    : null;

  
  const emailLocal = s._name.toLowerCase().replace(/\s/g,'').replace(/[үүөөһһ]/g, m => ({
    'ү':'u','Ү':'u','ө':'o','Ө':'o','һ':'h','Һ':'h'
  }[m] || m));

  return (
    <div className="std-overlay open" onClick={onClose}>
      <div className="std-modal full-design" onClick={e => e.stopPropagation()}>
        <button className="std-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="std-header-blue">
          <div className="std-header-top">
            <div className="std-big-av" style={{color: s._palette.btn}}>
              {s.av || s._name.charAt(0)}
            </div>
            <div className="std-name-info">
              <h2>{s._name}</h2>
              <div className="std-sub-badge">{s.className} • {s.subject}</div>
            </div>
          </div>
          <div className="std-top-stats">
            <div className="std-stat-box">
              <span className="std-stat-val">{score == null ? '—' : `${score}%`}</span>
              <span className="std-stat-lbl">Дундаж оноо</span>
            </div>
            <div className="std-stat-box">
              <span className="std-stat-val">{s.examCount}</span>
              <span className="std-stat-lbl">Шалгалт</span>
            </div>
            <div className="std-stat-box">
              <span className="std-stat-val">{s.assignCount}</span>
              <span className="std-stat-lbl">Даалгавар</span>
            </div>
          </div>
        </div>

        <div className="std-modal-body">
          <div className="std-progress-section">
            <div className="std-prog-label">
              <span>Нийт дундаж оноо</span>
              <span className="std-prog-val">{score == null ? '—' : `${score}%`} • {grade}</span>
            </div>
            <div className="std-bar-track">
              <div className="std-bar-fill green" style={{width:`${score ?? 0}%`}}></div>
            </div>
          </div>

          {examAvg !== null && (
            <div className="std-progress-section">
              <div className="std-prog-label">
                <span>Шалгалтын дундаж</span>
                <span className="std-prog-val">{examAvg}%</span>
              </div>
              <div className="std-bar-track">
                <div className="std-bar-fill blue" style={{width:`${examAvg}%`}}></div>
              </div>
            </div>
          )}

          {assignAvg !== null && (
            <div className="std-progress-section">
              <div className="std-prog-label">
                <span>Даалгаврын дундаж</span>
                <span className="std-prog-val">{assignAvg}%</span>
              </div>
              <div className="std-bar-track">
                <div className="std-bar-fill yellow" style={{width:`${assignAvg}%`}}></div>
              </div>
            </div>
          )}

          {s.lessonScore !== null && (
            <div className="std-progress-section">
              <div className="std-prog-label">
                <span>Хичээлийн явц</span>
                <span className="std-prog-val">{s.completedLessons}/{s.lessonCount} • {s.lessonScore}%</span>
              </div>
              <div className="std-bar-track">
                <div className="std-bar-fill blue" style={{width:`${s.lessonScore}%`}}></div>
              </div>
            </div>
          )}

          <div className="std-detail-row">
            <div className="std-detail-item">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <div className="std-detail-lbl">Бүртгүүлсэн</div>
                <div className="std-detail-val">
                  {s.joinedAt ? s.joinedAt.split('T')[0].replace(/-/g,'/') : '—'}
                </div>
              </div>
            </div>
            <div className="std-detail-item">
              <i className="fas fa-envelope"></i>
              <div>
                <div className="std-detail-lbl">Имэйл</div>
                <div className="std-detail-val">{emailLocal}@school.edu</div>
              </div>
            </div>
          </div>

          <div className="std-section-title">Ерөнхий дүгнэлт</div>
          {score == null ? (
            <div className="std-feedback-tag tag-warn">
              <i className="fas fa-info-circle"></i> Одоогоор үнэлгээний өгөгдөл алга
            </div>
          ) : score >= 80 ? (
            <div className="std-feedback-tag tag-good">
              <i className="fas fa-check-circle"></i> Гүйцэтгэл сайн байна
            </div>
          ) : score >= 65 ? (
            <div className="std-feedback-tag tag-warn">
              <i className="fas fa-info-circle"></i> Дундаж гүйцэтгэлтэй байна
            </div>
          ) : (
            <div className="std-feedback-tag tag-bad">
              <i className="fas fa-exclamation-circle"></i> Анхаарах шаардлагатай
            </div>
          )}

          <div className="std-action-row">
            <button className="std-action-btn primary">
              <i className="fas fa-envelope"></i> Мессеж илгээх
            </button>
            <button className="std-action-btn secondary">
              <i className="fas fa-file-alt"></i> Тайлан харах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


const StatCard = ({ icon, val, lbl, bg, color }) => (
  <div className="lp-stat">
    <div className="lp-stat-icon" style={{background: bg, color}}>
      <i className={`fas fa-${icon}`}></i>
    </div>
    <div className="lp-stat-val">{val}</div>
    <div className="lp-stat-lbl">{lbl}</div>
  </div>
);

const ClassCard = ({ name, count, avg, color, clsColor, active, onClick, isAll }) => {
  const accent = isAll ? '#07437d' : (clsColor || (color && color.btn) || '#3b82f6');
  return (
    <div
      className={`cls-filter-card ${active ? 'active' : ''} ${isAll ? 'cls-filter-all' : ''}`}
      onClick={onClick}
      style={{ '--cls-color': accent }}
    >
      <div
        className="cls-fc-icon"
        style={isAll
          ? { background: 'rgba(255,255,255,.2)', color: '#fff' }
          : { background: color.bg, color: color.tc }
        }
      >
        {isAll
          ? <i className="fas fa-layer-group"></i>
          : (name || '').charAt(0)
        }
      </div>
      <div className="cls-fc-info">
        <div className="cls-fc-name">
          {isAll ? 'Бүх анги' : name}
          <div className="cls-fc-check"><i className="fas fa-check"></i></div>
        </div>
        <div className="cls-fc-meta">
          <span><i className="fas fa-users" style={{marginRight:'3px'}}></i>{count} сурагч</span>
          {!isAll && avg != null && (
            <span className="avg-tag" style={{background:'#d1fae5', color:'#065f46'}}>{avg}%</span>
          )}
          {isAll && <span><i className="fas fa-layer-group" style={{marginRight:'3px'}}></i>бүх анги</span>}
        </div>
      </div>
    </div>
  );
};

export default TeacherStudents


