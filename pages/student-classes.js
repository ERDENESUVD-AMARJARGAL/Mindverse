(function() { // Бусад файлаас хамааралгүй ажиллуулахын тулд IIFE хайрцагт авав
    const { useState, useEffect } = React;

    async function fetchStudentClasses(studentId) {
      try {
        const uRes = await fetch(`${window.API_URL}/users/${studentId}`);
        if (!uRes.ok) throw new Error("Хэрэглэгч олдсонгүй");
        const user = await uRes.json();
        
        // classId нь string эсвэл array байж болно
        const ids = Array.isArray(user.classId) ? user.classId : [user.classId].filter(Boolean);

        const cRes = await fetch(`${window.API_URL}/classes`);
        const all = await cRes.json();
        return all.filter(c => ids.includes(c.id));
      } catch (err) {
        console.error("API Error:", err);
        return []; 
      }
    }


    const SUBJECT_META = {
      'Алгебр':      { color:'#3b82f6', icon:'fa-calculator' },
      'Геометр':     { color:'#10b981', icon:'fa-shapes'     },
      'Тригонометр': { color:'#f59e0b', icon:'fa-wave-square'},
      'Физик':       { color:'#8b5cf6', icon:'fa-atom'       },
      'Хими':        { color:'#ef4444', icon:'fa-flask'      },
    };
    const DEFAULT_META = { color:'#64748b', icon:'fa-book' };

    function subjectMeta(subject) {
      return SUBJECT_META[subject] || DEFAULT_META;
    }

    function getProgress(cls) {
      if (!cls || !cls.lessons) return 0;
      const total = cls.lessons.length;
      const done = cls.lessons.filter(l => l.badge === 'done').length;
      return total ? Math.round(done / total * 100) : 0;
    }

    function getAvgScore(classes) {
      if (!classes || classes.length === 0) return 0;
      const nums = classes.flatMap(c => (c.exams || []).filter(e => e.resultNum).map(e => e.resultNum));
      return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
    }

    function gradeInfo(pct) {
      if (pct >= 90) return { lbl:'A', cls:'grade-a' };
      if (pct >= 75) return { lbl:'B', cls:'grade-b' };
      if (pct >= 60) return { lbl:'C', cls:'grade-c' };
      return               { lbl:'D', cls:'grade-d' };
    }


    function JoinClassModal({ onClose, onJoined }) {
      const [code, setCode] = useState('');
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
      const JOIN_COST = 1000; // Ангид нэгдэх үнэ

      const handleJoin = async () => {
        setError('');
        if (!code.trim()) {
          setError("Ангийн кодоо оруулна уу!");
          return;
        }

        setLoading(true);
        try {
          const userId = sessionStorage.getItem('user_id');
          
          // 1. Хэрэглэгчийн мэдээлэл болон үлдэгдэлийг авах
          const uRes = await fetch(`${window.API_URL}/users/${userId}`);
          const user = await uRes.json();
          
          const currentBalance = user.balance || 0;
          
          // 2. Үлдэгдэл шалгах (Market.js-д байгаа мөнгө)
          if (currentBalance < JOIN_COST) {
            setError(`Үлдэгдэл хүрэлцэхгүй байна! Танд ${JOIN_COST - currentBalance}₮ дутуу байна. Market-ээс мөнгө нөхнө үү.`);
            setLoading(false);
            return;
          }

          // 3. Ангийн кодоор ангийг хайх
          const cRes = await fetch(`${window.API_URL}/classes?classCode=${code.trim().toUpperCase()}`);
          const classes = await cRes.json();
          
          if (classes.length === 0) {
            setError("Ийм ангийн код олдсонгүй! Багшаасаа зөв код авна уу.");
            setLoading(false);
            return;
          }
          
          const targetClass = classes[0];

          // 4. Аль хэдийн элссэн эсэхийг шалгах
          const currentIds = Array.isArray(user.classId) ? user.classId : [user.classId].filter(Boolean);
          if (currentIds.includes(targetClass.id)) {
            setError("Та энэ ангид аль хэдийн элссэн байна!");
            setLoading(false);
            return;
          }

          // 5. User-ийн classId-г шинэчлэх (Массив болгох)
          const newIds = [...currentIds, targetClass.id];
          await fetch(`${window.API_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              classId: newIds,
              balance: currentBalance - JOIN_COST
            })
          });

          // 6. Class-ын studentList-д сурагчийг нэмэх
          const newStudent = {
            id: user.id,
            classId: targetClass.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            av: (user.firstName || 'У')[0],
            color: "#dbeafe",
            tc: "#1d4ed8",
            score: 0,
            joinedAt: new Date().toISOString()
          };
          
          const currentStudents = targetClass.studentList || [];
          await fetch(`${window.API_URL}/classes/${targetClass.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentList: [...currentStudents, newStudent],
              students: currentStudents.length + 1
            })
          });

          // 7. Session-ийг шинэчлэх
          user.classId = newIds;
          user.balance = currentBalance - JOIN_COST;
          sessionStorage.setItem('user', JSON.stringify(user));

          alert("Амжилттай нэгдлээ!");
          onJoined(); // Апп-д дахин ачааллах

        } catch (err) {
          setError("Серверт алдаа гарлаа: " + err.message);
        }
        setLoading(false);
      };

      return (
        <div className="lsn-overlay open" onClick={e => e.target===e.currentTarget && onClose()}>
          <div className="lsn-modal" style={{maxWidth: '440px'}}>
            <div className="lsn-modal-head" style={{background: 'linear-gradient(135deg, #07437d 0%, #1d4ed8 100%)'}}>
              <div className="lsn-head-left">
                <div className="lsn-modal-title" style={{display:'flex', alignItems:'center', gap:'8px'}}>
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
                <div style={{
                  background:'#fff2f0', border:'1px solid #ffccc7', color:'#ff4d4f', 
                  padding:'12px', borderRadius:'10px', marginBottom:'15px', fontSize:'13px',
                  display:'flex', alignItems:'center', gap:'8px'
                }}>
                  <i className="fas fa-exclamation-triangle"/> {error}
                </div>
              )}

              <div style={{
                background:'#f8fafc', border:'1px solid #e5e7eb', borderRadius:'12px', 
                padding:'15px', marginBottom:'15px', display:'flex', justifyContent:'space-between', alignItems:'center'
              }}>
                <div>
                  <div className="lsn-info-lbl" style={{marginBottom:'2px'}}>Нэгдэх үнэ</div>
                  <div style={{fontSize:'11px', color:'#64748b'}}>Төлбөр төлсний дараа нэгдэнэ</div>
                </div>
                <div style={{fontSize:'20px', fontWeight:'800', color:'#07437d'}}>
                  {JOIN_COST.toLocaleString()}₮
                </div>
              </div>
              
              <div style={{marginBottom:'20px'}}>
                <label className="lsn-info-lbl" style={{display:'block', marginBottom:'8px'}}>Ангийн код</label>
                <input 
                  type="text" 
                  value={code} 
                  onChange={e => setCode(e.target.value)}
                  placeholder="Жишээ: ALG-7K2M"
                  style={{
                    width:'100%', padding:'12px 14px', border:'1.5px solid #e5e7eb', 
                    borderRadius:'10px', fontSize:'14px', outline:'none', fontFamily:'inherit',
                    transition: 'border .2s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button 
                className="lsn-complete-btn" 
                onClick={handleJoin} 
                disabled={loading || !code.trim()}
                style={{opacity: (loading || !code.trim()) ? 0.6 : 1}}
              >
                <i className="fas fa-wallet"/> {loading ? 'Боловсруулж байна...' : 'Төлбөр төлөж нэгдэх'}
              </button>
            </div>
          </div>
        </div>
      );
    }


    function Ring({ pct, color }) {
      const r = 20, circ = 2 * Math.PI * r;
      const offset = circ - (pct / 100) * circ;
      return (
        <div className="ring-wrap">
          <svg width="52" height="52" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4.5"/>
            <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4.5"
              strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 26 26)"
              style={{transition:'stroke-dashoffset .6s ease'}}/>
          </svg>
          <div className="ring-label">{pct}%</div>
        </div>
      );
    }


    function SummaryBar({ classes }) {
      const totalL  = classes.reduce((s,c) => s + (c.lessons||[]).length, 0);
      const doneL   = classes.reduce((s,c) => s + (c.lessons||[]).filter(l=>l.badge==='done').length, 0);
      const scores  = classes.flatMap(c => (c.exams||[]).filter(e=>e.resultNum).map(e=>e.resultNum));
      const avg     = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
      const pending = classes.reduce((s,c) => s + (c.assignments||[]).filter(a=>a.status==='active').length, 0);

      const kpis = [
        { icon:'fa-book-open',    colorClass:'kpi-blue',   val:totalL,  lbl:'Нийт хичээл'           },
        { icon:'fa-check-circle', colorClass:'kpi-green',  val:doneL,   lbl:'Дуусгасан'              },
        { icon:'fa-star',         colorClass:'kpi-purple', val:avg+'%', lbl:'Дундаж оноо'            },
        { icon:'fa-tasks',        colorClass:'kpi-yellow', val:pending, lbl:'Идэвхтэй даалгавар' },
      ];

      return (
        <div className="cls-summary">
          {kpis.map((k,i) => (
            <div key={i} className={`cls-kpi ${k.colorClass}`}>
              <div className="cls-kpi-icon"><i className={`fas ${k.icon}`}/></div>
              <div>
                <div className="cls-kpi-val">{k.val}</div>
                <div className="cls-kpi-lbl">{k.lbl}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    function ClassCard({ cls, selected, onClick }) {
      const pct  = getProgress(cls);
      const meta = subjectMeta(cls?.subject);
      const doneL    = (cls.lessons||[]).filter(l=>l.badge==='done').length;
      const pending  = (cls.assignments||[]).filter(a=>a.status==='active').length;

      return (
        <div
          className={`cls-card${selected?' selected':''}`}
          style={{'--cc': cls.color || meta.color}}
          onClick={onClick}
        >
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
                <div className="cls-strip-val">{doneL}/{(cls.lessons||[]).length}</div>
                <div className="cls-strip-lbl">Хичээл</div>
              </div>
              <div className="cls-card-strip-item">
                <div className="cls-strip-val">{(cls.exams||[]).length}</div>
                <div className="cls-strip-lbl">Шалгалт</div>
              </div>
              <div className="cls-card-strip-item">
                <div className="cls-strip-val">{pending}</div>
                <div className="cls-strip-lbl">Даалгавар</div>
              </div>
            </div>

            <div className="cls-card-progress-track">
              <div className="cls-card-progress-fill" style={{width: pct+'%', background: cls.color || meta.color}}/>
            </div>
          </div>
        </div>
      );
    }


    function LessonsTab({ cls }) {
      const [modal, setModal] = useState(null);
      const [lessons, setLessons] = useState(cls.lessons || []);
      useEffect(() => { setLessons(cls.lessons || []); setModal(null); }, [cls.id]);

      function markDone(i) {
        setLessons(prev => prev.map((l,idx) => idx===i ? {...l, badge:'done'} : l));
        setModal(null);
      }

      const l = modal !== null ? lessons[modal] : null;
      const BADGE = { done:'Дууссан', upcoming:'Удахгүй', draft:'Ноорог' };

      return (
        <>
          <div className="lesson-list">
            {lessons.map((lsn, i) => (
              <div key={i} className={`lesson-row lesson-row--${lsn.badge}`} onClick={() => setModal(i)}>
                <div className={`lesson-num lesson-num--${lsn.badge}`}>
                  {lsn.badge === 'done' ? <i className="fas fa-check"/> : lsn.badge === 'upcoming' ? <i className="fas fa-play"/> : <span>{i+1}</span>}
                </div>
                <div className="lesson-info">
                  <div className="lesson-title">{lsn.title}</div>
                  <div className="lesson-meta"><span><i className="fas fa-clock"/> {lsn.meta}</span></div>
                </div>
                <div className={`lesson-badge lesson-badge--${lsn.badge}`}>{BADGE[lsn.badge] || lsn.badge}</div>
              </div>
            ))}
          </div>
          {l && (
            <div className="lsn-overlay open" onClick={e => e.target===e.currentTarget && setModal(null)}>
              <div className="lsn-modal">
                <div className="lsn-modal-head" style={{background:`linear-gradient(135deg,${cls.color}ee,${cls.color}88)`}}>
                  <div className="lsn-head-left">
                    <div className={`lsn-status-tag ${l.badge==='done'?'done':'pending'}`}>{l.badge==='done' ? '✓ Дууссан' : '▶ Удахгүй'}</div>
                    <div className="lsn-modal-title">{l.title}</div>
                    <div className="lsn-modal-meta"><span><i className="fas fa-clock"/> {l.meta}</span><span><i className="fas fa-book"/> {cls?.subject}</span></div>
                  </div>
                  <button className="lsn-close-btn" onClick={() => setModal(null)}><i className="fas fa-times"/></button>
                </div>
                <div className="lsn-modal-body">
                  <div className="lsn-video-box">
                    {l.badge==='done' && <div className="lsn-done-ribbon"><i className="fas fa-check-circle"/> Дууссан</div>}
                    <div className="lsn-play-btn"><i className="fas fa-play"/></div>
                    <div className="lsn-video-label">Хичээлийн бичлэг</div>
                  </div>
                  <div className="lsn-info-grid">
                    <div className="lsn-info-card"><div className="lsn-info-lbl">Хугацаа</div><div className="lsn-info-val"><i className="fas fa-clock lsn-info-icon--blue"/> {l.meta}</div></div>
                    <div className="lsn-info-card"><div className="lsn-info-lbl">Хичээл</div><div className="lsn-info-val"><i className="fas fa-book-open lsn-info-icon--green"/> {cls?.subject}</div></div>
                  </div>
                  {l.badge === 'done' ? <div className="lsn-completed-note"><i className="fas fa-check-circle"/> Та энэ хичээлийг амжилттай дүүргэсэн байна.</div> : <button className="lsn-complete-btn" onClick={() => markDone(modal)}><i className="fas fa-check"/> Дуусгасан тэмдэглэх</button>}
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    function ExamsTab({ cls }) {
      return (
        <div className="exam-list">
          {(cls.exams||[]).map((ex, i) => {
            const done = ex.result !== null; const pct = done && ex.resultNum ? ex.resultNum : 0; const g = done ? gradeInfo(pct) : null;
            return (
              <div key={i} className={`exam-card${done?' exam-card--done':''}`}>
                <div className="exam-card-top">
                  <div className="exam-card-info"><div className="exam-title">{ex.title}</div><div className="exam-meta">{ex.meta}</div></div>
                  {done ? <div className={`exam-grade-badge ${g.cls}`}>{g.lbl}</div> : <div className="exam-upcoming-badge">Болоогүй</div>}
                </div>
                {done && (
                  <div className="exam-score-area">
                    <div className="exam-score-row"><span className="exam-score-lbl">Таны оноо</span><span className={`exam-score-val ${g.cls}`}>{ex.result}</span></div>
                    <div className="exam-bar-track"><div className={`exam-bar-fill ${g.cls}`} style={{width: pct+'%'}}/></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    function AssignmentsTab({ cls }) {
      const [filter, setFilter] = useState('all');
      useEffect(() => setFilter('all'), [cls.id]);
      const assigns = cls.assignments || [];
      const visible = filter === 'all' ? assigns : assigns.filter(a => a.status === filter);
      const STATUS_LABEL = { active:'Идэвхтэй', done:'Дууссан', late:'Хоцорсон' };

      if (!assigns.length) return (<div className="cls-empty"><i className="fas fa-tasks"/><p>Даалгавар байхгүй байна</p></div>);
      return (
        <div>
          <div className="asgn-filters">
            {[{ id:'all', lbl:'Бүгд', cnt: assigns.length },{ id:'active', lbl:'Идэвхтэй', cnt: assigns.filter(a=>a.status==='active').length },{ id:'done', lbl:'Дууссан', cnt: assigns.filter(a=>a.status==='done').length },].map(f => (
              <button key={f.id} className={`asgn-filter-btn${filter===f.id?' active':''}`} onClick={() => setFilter(f.id)}>{f.lbl} <span className="asgn-filter-cnt">{f.cnt}</span></button>
            ))}
          </div>
          <div className="asgn-list">
            {visible.map((a, i) => (
              <div key={i} className={`asgn-row asgn-row--${a.status}`}>
                <div className={`asgn-dot asgn-dot--${a.status}`}/>
                <div className="asgn-info"><div className="asgn-title">{a.title}</div><div className="asgn-meta"><span><i className="fas fa-calendar-alt"/> {a.meta}</span></div></div>
                <div className={`asgn-status-badge asgn-status--${a.status}`}>{STATUS_LABEL[a.status] || a.status}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    function GradesTab({ cls }) {
      const scored = (cls.exams||[]).filter(e => e.resultNum);
      const avg = scored.length ? Math.round(scored.reduce((s,e)=>s+e.resultNum,0)/scored.length) : null;
      const g = avg !== null ? gradeInfo(avg) : null;
      const circ = 2 * Math.PI * 48;
      const offset = avg !== null ? circ - (avg/100)*circ : circ;

      return (
        <div>
          {avg !== null && (
            <div className="grade-hero" style={{background:`linear-gradient(135deg,${cls.color},${cls.color}99)`}}>
              <div className="grade-ring-wrap">
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="8"/>
                  <circle cx="55" cy="55" r="48" fill="none" stroke="#fff" strokeWidth="8" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 55 55)" style={{transition:'stroke-dashoffset .7s ease'}}/>
                </svg>
                <div className="grade-ring-center"><div className="grade-ring-num">{avg}</div><div className="grade-ring-lbl">оноо</div></div>
              </div>
              <div className="grade-hero-info">
                <div className="grade-letter-badge">{g.lbl} — {avg>=90?'Онц':avg>=75?'Сайн':avg>=60?'Дунд':'Хангалтгүй'}</div>
                <div className="grade-class-name">{cls.name}</div>
                <div className="grade-exam-count">{scored.length} шалгалт дүгнэгдсэн</div>
              </div>
            </div>
          )}
          <div className="grade-exam-list">
            {(cls.exams||[]).map((ex, i) => {
              const done = !!ex.resultNum; const pct = done ? ex.resultNum : 0; const gi = done ? gradeInfo(pct) : null;
              return (
                <div key={i} className="grade-exam-row">
                  <div className={`grade-exam-badge ${done ? gi.cls : 'grade-empty'}`}>{done ? gi.lbl : '—'}</div>
                  <div className="grade-exam-info"><div className="grade-exam-title">{ex.title}</div><div className="grade-exam-meta">{ex.meta}</div>{done && (<div className="grade-exam-bar"><div className={`grade-exam-fill ${gi.cls}`} style={{width: pct+'%'}}/></div>)}</div>
                  <div className={`grade-exam-score ${done ? gi.cls : 'grade-empty'}`}>{done ? ex.result : 'Болоогүй'}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const TABS = [
      { id:'lessons', icon:'fa-road', lbl:'Хичээлүүд' },
      { id:'exams', icon:'fa-clipboard-list', lbl:'Шалгалт' },
      { id:'assignments', icon:'fa-tasks', lbl:'Даалгавар' },
      { id:'grades', icon:'fa-chart-line', lbl:'Дүн' },
    ];

    function DetailPanel({ cls, onClose }) {
      const [tab, setTab] = useState('lessons');
      useEffect(() => setTab('lessons'), [cls.id]);
      const meta = subjectMeta(cls.subject); const pct = getProgress(cls); const avg = getAvgScore([cls]);
      const doneL = (cls.lessons||[]).filter(l=>l.badge==='done').length;

      return (
        <div className="cls-detail">
          <div className="cls-det-banner" style={{background:`linear-gradient(135deg,${cls.color||meta.color} 0%,${cls.color||meta.color}99 100%)`}}>
            <div className="cls-det-top">
              <div className="cls-det-icon"><i className={`fas ${cls.icon || meta.icon}`}/></div>
              <div className="cls-det-info"><div className="cls-det-subject">{cls?.subject}</div><div className="cls-det-title">{cls.name}</div></div>
              <button className="cls-det-close" onClick={onClose}><i className="fas fa-times"/></button>
            </div>
            <div className="cls-det-kpis">
              {[{ val:`${doneL}/${(cls.lessons||[]).length}`, lbl:'Хичээл' },{ val: pct+'%', lbl:'Явц' },{ val: avg !== null ? avg : '—', lbl:'Дундаж' },{ val:(cls.exams||[]).filter(e=>e.resultNum != null).length, lbl:'Шалгалт' },].map((k,i) => (
                <div key={i} className="cls-det-kpi"><div className="cls-det-kpi-val">{k.val}</div><div className="cls-det-kpi-lbl">{k.lbl}</div></div>
              ))}
            </div>
            <div className="cls-tabs">
              {TABS.map(t => (
                <button key={t.id} className={`cls-tab${tab===t.id?' active':''}`} style={tab===t.id ? {color: cls.color||meta.color, borderColor: cls.color||meta.color} : {}} onClick={() => setTab(t.id)}>
                  <i className={`fas ${t.icon}`}/> {t.lbl}
                </button>
              ))}
            </div>
          </div>
          <div className="cls-tab-body">
            {tab === 'lessons' && <LessonsTab cls={cls}/>}
            {tab === 'exams' && <ExamsTab cls={cls}/>}
            {tab === 'assignments' && <AssignmentsTab cls={cls}/>}
            {tab === 'grades' && <GradesTab cls={cls}/>}
          </div>
        </div>
      );
    }


    function StudentClasses() {
      const [classes, setClasses] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [selected, setSelected] = useState(null);
      const [query, setQuery] = useState('');
      const [joinModal, setJoinModal] = useState(false); // Шинэ: Модалын төлөв

      useEffect(() => {
        const uid = sessionStorage.getItem('user_id') || 'stu_001';
        fetchStudentClasses(uid)
          .then(data => { setClasses(data); setLoading(false); })
          .catch(err => { setError(err.message); setLoading(false); });
      }, []);

      const filtered = classes.filter(c => {
        if (!query) return true;
        const q = query.toLowerCase();
        return c.name.toLowerCase().includes(q) || c?.subject.toLowerCase().includes(q);
      });

      function handleSelect(cls) {
        setSelected(prev => prev?.id === cls.id ? null : cls);
      }

      if (loading) return (<div className="page-container"><div className="page cls-loading"><div className="cls-spinner"/><p>Ачааллаж байна...</p></div></div>);
      if (error) return (<div className="page-container"><div className="page cls-error-wrap"><i className="fas fa-exclamation-circle cls-error-icon"/><p className="cls-error-msg">{error}</p><button className="cls-retry-btn" onClick={() => window.location.reload()}><i className="fas fa-redo"/> Дахин оролдох</button></div></div>);

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
                  
                  {/* Ангид нэгдэх товчлуур */}
                  <div className="cls-hero-chip" onClick={() => setJoinModal(true)} style={{cursor:'pointer', background:'rgba(255,255,255,.25)', border:'1.5px dashed rgba(255,255,255,.5)', transition:'all .2s'}}>
                    <i className="fas fa-plus"/> Анги нэгдэх
                  </div>

                  <div className="cls-hero-chip"><i className="fas fa-calendar-week"/> 2026 оны 2-р улирал</div>
                </div>
              </div>
            </div>

            <SummaryBar classes={classes}/>

            <div className="cls-search-wrap">
              <div className="cls-search-bar">
                <i className="fas fa-search"/>
                <input type="text" placeholder="Хичээл, сэдвээр хайх..." value={query} onChange={e => setQuery(e.target.value)} />
                {query && <button className="cls-search-clear" onClick={() => setQuery('')}><i className="fas fa-times"/></button>}
              </div>
              {query && <span className="cls-search-badge">{filtered.length} үр дүн</span>}
            </div>

            <div className="cls-layout">
              <div className={`cls-grid${selected ? ' has-detail' : ''}`}>
                {filtered.length === 0 && (<div className="cls-no-results"><i className="fas fa-search"/><p>Хайлтад тохирох хичээл олдсонгүй</p></div>)}
                {filtered.map(cls => (<ClassCard key={cls.id} cls={cls} selected={selected?.id === cls.id} onClick={() => handleSelect(cls)} />))}
              </div>
              {selected && <DetailPanel cls={selected} onClose={() => setSelected(null)}/>}
            </div>
          </div>
          {joinModal && (
            <JoinClassModal 
              onClose={() => setJoinModal(false)} 
              onJoined={() => window.location.reload()} // Амжилттай нэгдвэл хуудсыг дахин ачааллаж ангийг харуулна
            />
          )}
        </div>
      );
    }

    window.StudentClasses = StudentClasses;
})();