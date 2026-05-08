const { useState, useEffect, useRef } = React;

const API = window.API_URL || 'http://localhost:5000';

/* ── Хугацааны тохиргоо ── */
const PERIOD_KEYS   = ['week', 'month', 'quarter', 'year'];
const PERIOD_LABELS = ['Энэ долоо хоног', 'Энэ сар', 'Энэ улирал', 'Жилийн нийт'];

/* ── Ангиудын өнгийн палитр ── */
const PALETTE = [
  { grad: '#3b82f6,#60a5fa', tc: '#1d4ed8' },
  { grad: '#10b981,#34d399', tc: '#065f46' },
  { grad: '#f59e0b,#fbbf24', tc: '#92400e' },
  { grad: '#8b5cf6,#a78bfa', tc: '#5b21b6' },
  { grad: '#ef4444,#f87171', tc: '#991b1b' },
  { grad: '#06b6d4,#22d3ee', tc: '#164e63' },
];

const safe = (arr) => Array.isArray(arr) ? arr : [];

/* ── Огноог хугацааны эхлэлтэй харьцуулах ── */
function getPeriodStart(period) {
  const d = new Date();
  if (period === 'week')    d.setDate(d.getDate() - 7);
  if (period === 'month')   d.setMonth(d.getMonth() - 1);
  if (period === 'quarter') d.setMonth(d.getMonth() - 3);
  if (period === 'year')    d.setFullYear(d.getFullYear() - 1);
  return d;
}

/* ── Огноог "сар/өдөр" хэлбэрт оруулах ── */
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/* ── Өдрийн зөрүү ── */
function daysDiff(dateStr) {
  const now = new Date();
  const d   = new Date(dateStr);
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

/* ══════════════════════════════════════
   ANIMATED BAR
══════════════════════════════════════ */
function AnimBar({ pct, grad, uid }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.width = '0%';
    const id = requestAnimationFrame(() => { el.style.width = pct + '%'; });
    return () => cancelAnimationFrame(id);
  }, [uid]);

  return (
    <div className="bar-track">
      <div ref={ref} className="bar-fill" style={{ width: '0%', background: `linear-gradient(90deg, ${grad})` }} />
    </div>
  );
}

/*ANIMATED PROGRESS*/
function AnimFill({ pct, style, uid }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.width = '0%';
    const id = requestAnimationFrame(() => { el.style.width = pct + '%'; });
    return () => cancelAnimationFrame(id);
  }, [uid]);

  return <div ref={ref} className="so-fill" style={{ width: '0%', ...style }} />;
}


function TeacherAnalytics() {
  let teacherId = sessionStorage.getItem('user_id') || sessionStorage.getItem('userId') || 'teacher_1';
  if (!sessionStorage.getItem('user_id') && !sessionStorage.getItem('userId')) {
    try { const u = JSON.parse(sessionStorage.getItem('user') || '{}'); if (u.id) teacherId = u.id; } catch {}
  }

  const [period,  setPeriod]  = useState('month');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const [kpis,      setKpis]      = useState([]);
  const [bars,      setBars]      = useState([]);
  const [segments,  setSegments]  = useState({ good: 0, fair: 0, ok: 0, warn: 0 });
  const [exams,     setExams]     = useState([]);
  const [subs,      setSubs]      = useState([]);
  const [deadlines, setDeadlines] = useState([]);

  /* ── API ── */
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/classes?teacherId=${teacherId}`)
      .then(res => {
        if (!res.ok) throw new Error('Сервертэй холбогдоход алдаа гарлаа');
        return res.json();
      })
      .then(data => { setClasses(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, [teacherId]);

  useEffect(() => {
    if (!classes.length) return;

    const periodStart = getPeriodStart(period);
    const inPeriod    = str => str && new Date(str) >= periodStart;
    const today       = new Date();

 
    const totalStudents = classes.reduce((n, c) => n + safe(c.studentList).length, 0);


    const allScores = classes.flatMap(c => safe(c.studentList).map(s => s.score || 0));
    const totalAvg  = allScores.length
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    const seg = { good: 0, fair: 0, ok: 0, warn: 0 };
    allScores.forEach(sc => {
      if      (sc >= 80) seg.good++;
      else if (sc >= 65) seg.fair++;
      else if (sc >= 50) seg.ok++;
      else               seg.warn++;
    });
    setSegments(seg);

  
    setBars(classes.map((c, i) => {
      const col    = PALETTE[i % PALETTE.length];
      const scores = safe(c.studentList).map(s => s.score || 0);
      const avg    = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : (c.avgNum || 0);
      return { label: c.name, pct: avg, grad: col.grad, tc: col.tc };
    }));


    const allExams = classes.flatMap(c =>
      safe(c.exams).map(ex => ({ ...ex, className: c.name, classId: c.id }))
    );

    const periodExams = allExams.filter(ex =>
      ex.status === 'upcoming' || inPeriod(ex.date)
    );

    setExams(periodExams.map(ex => {
      if (ex.status === 'upcoming') {
        return {
          upcoming: true,
          title:    ex.title,
          meta:     `${ex.className} · ${fmtDate(ex.date)} · ${ex.totalQuestions || '?'} асуулт`,
        };
      }
      const subScores = safe(ex.submissions).map(s => s.score);
      const avg       = subScores.length
        ? Math.round(subScores.reduce((a, b) => a + b, 0) / subScores.length)
        : (ex.resultNum || 0);
      return {
        upcoming: false,
        title:    ex.title,
        meta:     `${ex.className} · ${fmtDate(ex.date)}`,
        score:    ex.result || `${avg}%`,
        good:     avg >= 75,
        bad:      avg < 60,
      };
    }));

  
    const examCount = periodExams.length;


    const allAssigns = classes.flatMap(c =>
      safe(c.assignments).map(a => ({ ...a, className: c.name, classId: c.id }))
    );

    const periodAssigns = allAssigns.filter(a =>
      a.status === 'active' || (a.dueDate && inPeriod(a.dueDate))
    );

    const subData = periodAssigns.map(a => {
      const cls   = classes.find(c => c.id === a.classId);
      const total = safe(cls?.studentList).length || 1;
      const done  = safe(a.submissions).length;
      const pct   = Math.round((done / total) * 100);
      return {
        label:  a.title,
        sub:    `${a.className} · Дуусах: ${fmtDate(a.dueDate)}`,
        done,
        total,
        pct,
        danger: pct < 30,
        warn:   pct >= 30 && pct < 60,
      };
    });
    setSubs(subData);

    
    const assignAvgPct = subData.length
      ? Math.round(subData.reduce((a, b) => a + b.pct, 0) / subData.length)
      : 0;

  
    setKpis([
      {
        icon: 'users',  bg: '#dbeafe', ic: '#1d4ed8',
        val:  String(totalStudents),
        lbl:  'Нийт сурагч',
        trend:'up',
        txt:  `${classes.length} анги`,
      },
      {
        icon: 'chart-bar', bg: '#d1fae5', ic: '#065f46',
        val:  `${totalAvg}%`,
        lbl:  'Нийт дундаж оноо',
        trend: totalAvg >= 70 ? 'up' : 'down',
        txt:  totalAvg >= 70 ? 'Сайн гүйцэтгэл' : 'Анхаарах хэрэгтэй',
      },
      {
        icon: 'clipboard-check', bg: '#fef3c7', ic: '#92400e',
        val:  `${assignAvgPct}%`,
        lbl:  'Даалгаврын дундаж илгээлт',
        trend: assignAvgPct >= 70 ? 'up' : 'down',
        txt:  assignAvgPct >= 70 ? 'Идэвхтэй' : 'Анхаарах хэрэгтэй',
      },
      {
        icon: 'pen-square', bg: '#ede9fe', ic: '#5b21b6',
        val:  String(examCount),
        lbl:  `Нийт шалгалт (${PERIOD_LABELS[PERIOD_KEYS.indexOf(period)]})`,
        trend:'flat',
        txt:  'Нийт тоо',
      },
    ]);

    
    const soonLimit = new Date();
    soonLimit.setDate(today.getDate() + 7);

    const dlList = [];

    allExams
      .filter(ex => ex.status === 'upcoming' && ex.date && new Date(ex.date) <= soonLimit)
      .forEach(ex => {
        const diff = daysDiff(ex.date);
        dlList.push({
          exam:  true,
          title: ex.title,
          meta:  ex.className,
          date:  `${fmtDate(ex.date)} · ${diff} өдөр`,
          soon:  diff <= 4,
          ts:    new Date(ex.date),
        });
      });

    allAssigns
      .filter(a => a.status === 'active' && a.dueDate && new Date(a.dueDate) <= soonLimit)
      .forEach(a => {
        const cls   = classes.find(c => c.id === a.classId);
        const total = safe(cls?.studentList).length || '?';
        const done  = safe(a.submissions).length;
        const diff  = daysDiff(a.dueDate);
        dlList.push({
          exam:  false,
          title: a.title,
          meta:  `${a.className} · ${done}/${total} илгэсэн`,
          date:  `${fmtDate(a.dueDate)} · ${diff} өдөр`,
          soon:  diff <= 4,
          ts:    new Date(a.dueDate),
        });
      });

    dlList.sort((a, b) => a.ts - b.ts);
    setDeadlines(dlList);

  }, [classes, period]);


  const subStyle = s => {
    if (s.danger) return { background: 'linear-gradient(90deg, #ef4444, #f87171)' };
    if (s.warn)   return { background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' };
    return          { background: 'linear-gradient(90deg, #10b981, #34d399)' };
  };


  if (loading) return (
    <div className="page">
      <Sidebar />
      <div className="an-loading">
        <div className="an-spinner"></div>
        <p>Ачаалж байна...</p>
      </div>
    </div>
  );


  if (error) return (
    <div className="page">
      <Sidebar />
      <div className="an-error">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Холбогдоход алдаа гарлаа</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Дахин оролдох</button>
      </div>
    </div>
  );


  return (
    <div className="page">

        <div className="page-header">
        <h1>
            <i className="fas fa-chart-bar" style={{ color: '#07437d', marginRight: '10px' }}></i>
            Тайлан &amp; Аналитик
        </h1>
        </div>

    
        <div className="period-bar">
        {PERIOD_KEYS.map((k, i) => (
            <button
            key={k}
            className={`period-btn${period === k ? ' active' : ''}`}
            onClick={() => setPeriod(k)}
            >
            {PERIOD_LABELS[i]}
            </button>
        ))}
        </div>

  
        <div className="kpi-row">
        {kpis.map((k, i) => (
            <div key={i} className="kpi-card">
            <div className="kpi-icon" style={{ background: k.bg, color: k.ic }}>
                <i className={`fas fa-${k.icon}`}></i>
            </div>
            <div className="kpi-val">{k.val}</div>
            <div className="kpi-lbl">{k.lbl}</div>
            <span className={`kpi-trend ${k.trend}`}>
                <i className={`fas fa-${k.trend === 'up' ? 'arrow-up' : k.trend === 'down' ? 'arrow-down' : 'minus'}`}></i>
                {k.txt}
            </span>
            </div>
        ))}
        </div>


        <div className="analytics-grid">
        <div className="a-card">
            <div className="a-card-head">
            <div>
                <h3><i className="fas fa-layer-group"></i> Ангиудын дундаж харьцуулалт</h3>
                <p>Шалгалтын нийт дундаж оноогоор</p>
            </div>
            </div>
            <div className="a-card-body">
            <div className="bar-chart">
                {bars.map((b, i) => (
                <div key={i} className="bar-row">
                    <div className="bar-label">{b.label}</div>
                    <AnimBar uid={period + i} pct={b.pct} grad={b.grad} />
                    <div className="bar-pct" style={{ color: b.tc }}>{b.pct}%</div>
                </div>
                ))}
            </div>

   
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <div className="seg-title">Оноогоор ангилал</div>
                <div className="segment-stats">
                <div className="seg-item" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                    <div className="seg-val" style={{ color: '#065f46' }}>{segments.good}</div>
                    <div className="seg-lbl">Сайн (80%+)</div>
                </div>
                <div className="seg-item" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
                    <div className="seg-val" style={{ color: '#92400e' }}>{segments.fair}</div>
                    <div className="seg-lbl">Дунд (65–79%)</div>
                </div>
                <div className="seg-item" style={{ background: '#fff7ed', borderColor: '#fed7aa' }}>
                    <div className="seg-val" style={{ color: '#c2410c' }}>{segments.ok}</div>
                    <div className="seg-lbl">Хангалттай (50–64%)</div>
                </div>
                <div className="seg-item" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                    <div className="seg-val" style={{ color: '#991b1b' }}>{segments.warn}</div>
                    <div className="seg-lbl">Анхааруулга (&lt;50%)</div>
                </div>
                </div>
            </div>
            </div>
        </div>

    
        <div className="a-card">
            <div className="a-card-head">
            <div>
                <h3><i className="fas fa-tasks"></i> Даалгаврын илгээлтийн хяналт</h3>
                <p>Идэвхтэй даалгаврын илгээлтийн хувь</p>
            </div>
            </div>
            <div className="a-card-body">
            {subs.length === 0 ? (
                <div className="an-empty">
                <i className="fas fa-inbox"></i>
                <span>Идэвхтэй даалгавар байхгүй байна</span>
                </div>
            ) : (
                <div className="submit-overview">
                {subs.map((s, i) => (
                    <div key={i} className="so-item">
                    <div className="so-row">
                        <div>
                        <div className="so-label">{s.label}</div>
                        <div className="so-sub">{s.sub}</div>
                        </div>
                        <div className="so-pct">{s.done}/{s.total}</div>
                    </div>
                    <div className="so-track">
                        <AnimFill uid={period + i} pct={s.pct} style={subStyle(s)} />
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        </div>
        </div>


        <div className="analytics-grid">
        <div className="a-card">
            <div className="a-card-head">
            <div>
                <h3><i className="fas fa-pen-square"></i> Шалгалтын үр дүн</h3>
                <p>Шалгалтын оноо ба удахгүй болох шалгалтууд</p>
            </div>
            </div>
            <div className="a-card-body">
            {exams.length === 0 ? (
                <div className="an-empty">
                <i className="fas fa-inbox"></i>
                <span>Шалгалт байхгүй байна</span>
                </div>
            ) : (
                <div className="result-list">
                {exams.map((e, i) => {
                    if (e.upcoming) return (
                    <div key={i} className="result-item">
                        <div className="result-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                        <i className="fas fa-clock"></i>
                        </div>
                        <div className="result-info">
                        <div className="result-title">{e.title}</div>
                        <div className="result-meta">{e.meta}</div>
                        </div>
                        <div className="result-score" style={{ color: '#94a3b8' }}>Удахгүй</div>
                    </div>
                    );
                    const col = e.bad ? '#991b1b' : e.good ? '#065f46' : '#92400e';
                    const bg  = e.bad ? '#fee2e2' : e.good ? '#d1fae5' : '#fef3c7';
                    return (
                    <div key={i} className="result-item">
                        <div className="result-icon" style={{ background: bg, color: col }}>
                        <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="result-info">
                        <div className="result-title">{e.title}</div>
                        <div className="result-meta">{e.meta}</div>
                        </div>
                        <div className="result-score" style={{ color: col }}>{e.score}</div>
                    </div>
                    );
                })}
                </div>
            )}
            </div>
        </div>


        <div className="a-card">
            <div className="a-card-head">
            <div>
                <h3><i className="fas fa-calendar-alt"></i> Ойрын хугацаа</h3>
                <p>Дуусах шалгалт ба даалгаварууд</p>
            </div>
            </div>
            <div className="a-card-body">
            {deadlines.length === 0 ? (
                <div className="an-empty">
                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                <span>Ойрын хугацаанд дуусах зүйл байхгүй байна</span>
                </div>
            ) : (
                <div className="deadline-list">
                {deadlines.map((dl, i) => (
                    <div key={i} className={`deadline-item ${dl.exam ? 'exam' : 'assign'}`}>
                    <div className="deadline-info">
                        <div className="deadline-title">{dl.title}</div>
                        <div className="deadline-meta">
                        <i className="fas fa-layer-group" style={{ color: dl.exam ? '#3b82f6' : '#10b981', marginRight: '4px' }}></i>
                        {dl.meta}
                        </div>
                    </div>
                    <span className={`deadline-date ${dl.soon ? 'soon' : 'ok'}`}>{dl.date}</span>
                    </div>
                ))}
                </div>
            )}
            </div>
        </div>
        </div>

    </div>
  );
}

window.TeacherAnalytics = TeacherAnalytics;