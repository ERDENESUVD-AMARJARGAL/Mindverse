
    const { useState, useEffect } = React;

    async function fetchDashboard(studentId) {
      try {
        const [usersRes, classesRes] = await Promise.all([
          fetch(`${window.API_URL}/users/${studentId}`),
          fetch(`${window.API_URL}/classes`),
        ]);

        if (!usersRes.ok || !classesRes.ok) {
          throw new Error("Серверээс өгөгдөл татахад алдаа гарлаа");
        }

        const user = await usersRes.json();
        const allCls = await classesRes.json();

        //  Сурагчийн ангиудыг аюулгүй шүүх (user.classId байхгүй бол хоосон массив)
        const classIds = user && user.classId 
          ? (Array.isArray(user.classId) ? user.classId : [user.classId]) 
          : [];
        
        const classes = allCls.filter(c => classIds.includes(c.id));

        //  Буцаахдаа user объект дотор firstName, lastName байгаа эсэхийг баталгаажуулах
        return { 
          user: {
            ...user,
            firstName: user.firstName || user.name || "Сурагч",
            lastName: user.lastName || ""
          }, 
          classes: classes || [] 
        };
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        throw err;
      }
    }

    function getProgress(cls) {
      const total = (cls.lessons || []).length;
      const done  = (cls.lessons || []).filter(l => l.badge === 'done').length;
      return total ? Math.round(done / total * 100) : 0;
    }

    function getAvgScore(classes) {
      const nums = classes.flatMap(c =>
        (c.exams || []).filter(e => e.resultNum).map(e => e.resultNum)
      );
      return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : 0;
    }

    function getUpcomingExams(classes) {
      return classes
        .flatMap(c => (c.exams || [])
          .filter(e => e.status === 'upcoming')
          .map(e => ({ ...e, classColor: c.color, subject: c.subject }))
        )
        .slice(0, 4);
    }

    function getActiveAssigns(classes) {
      return classes.flatMap(c =>
        (c.assignments || []).filter(a => a.status === 'active')
      ).length;
    }


    function parseExamDate(meta) {
      const match = (meta || '').match(/(\d{4})\/(\d{2})\/(\d{2})/);
      if (!match) return { day: '—', month: '—' };
      const d = new Date(match[1], match[2] - 1, match[3]);
      return {
        day:   d.getDate(),
        month: `${d.getMonth() + 1}-р сар`,
      };
    }

    function daysUntil(meta) {
      const match = (meta || '').match(/(\d{4})\/(\d{2})\/(\d{2})/);
      if (!match) return null;
      const diff = Math.ceil(
        (new Date(match[1], match[2] - 1, match[3]) - new Date()) / 86400000
      );
      return diff > 0 ? diff : 0;
    }

 
    function Spinner() {
      return (
        <div className="sm-loading">
          <div className="sm-spinner"/>
          <p>Ачааллаж байна...</p>
        </div>
      );
    }

  
    function Banner({ user, classes }) {
      const examCount  = classes.flatMap(c => (c.exams||[]).filter(e=>e.result)).length;
      const streak     = parseInt(sessionStorage.getItem('streak') || '7', 10);

      const pills = [
        { icon:'fa-book-open',  val: classes.length, lbl:'Хичээл'         },
        { icon:'fa-pen-square', val: examCount,       lbl:'Шалгалт өгсөн'  },
        { icon:'fa-fire',       val: streak,          lbl:'Өдрийн streak', fireIcon: true },
      ];

      return (
        <div className="stu-banner">
          <div className="stu-banner-blob"/>
          <div className="stu-banner-inner">
            <div className="stu-banner-left">
              <div className="stu-banner-tag">
                <i className="fas fa-graduation-cap"/> Сурагчийн самбар
              </div>
              <div className="stu-banner-title">
                Сайн байна уу, <em>{user.firstName || 'Сурагч'}</em>!
              </div>
              <div className="stu-banner-pills">
                {pills.map((p, i) => (
                  <div className="stu-banner-pill" key={i}>
                    <div className="stu-banner-pill-icon">
                      <i className={`fas ${p.icon}${p.fireIcon ? ' sm-fire-icon' : ''}`}/>
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
              <a href="#/student-classes" className="stu-btn solid">
                <i className="fas fa-book-open"/> Хичээлүүд
              </a>
              <a href="#/student-classes" className="stu-btn">
                <i className="fas fa-tasks"/> Даалгавар
              </a>
            </div>
          </div>
        </div>
      );
    }


    function Stats({ classes }) {
      const avgScore    = getAvgScore(classes);
      const activeAssign = getActiveAssigns(classes);
      const examsDone   = classes.flatMap(c=>(c.exams||[]).filter(e=>e.result)).length;

      const items = [
        { colorCls:'sm-stat-blue',   icon:'fa-layer-group', val: classes.length, lbl:'Миний хичээл',           trend:'neutral', trendTxt:'2026 хичээлийн жил' },
        { colorCls:'sm-stat-green',  icon:'fa-pen-square',  val: examsDone,       lbl:'Өгсөн шалгалт',          trend:'up',      trendTxt:'+1 энэ долоо хоног' },
        { colorCls:'sm-stat-yellow', icon:'fa-tasks',       val: activeAssign,    lbl:'Хүлээгдэж буй даалгавар',trend:'down',    trendTxt: activeAssign > 0 ? `${activeAssign} нь идэвхтэй` : 'Даалгаваргүй' },
        { colorCls:'sm-stat-purple', icon:'fa-chart-bar',   val: avgScore+'%',    lbl:'Дундаж оноо',             trend:'up',      trendTxt:'Бүх шалгалтын дундаж' },
      ];

      return (
        <div className="stu-stats">
          {items.map((s, i) => (
            <div className={`stu-stat ${s.colorCls}`} key={i}>
              <div className="stu-stat-icon">
                <i className={`fas ${s.icon}`}/>
              </div>
              <div className="stu-stat-body">
                <div className="stu-stat-val">{s.val}</div>
                <div className="stu-stat-lbl">{s.lbl}</div>
                <div className={`stu-stat-trend ${s.trend}`}>{s.trendTxt}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }


    function ClassCards({ classes }) {
      if (!classes.length) return (
        <div className="stu-card">
          <div className="sm-empty">
            <i className="fas fa-layer-group"/>
            <p>Бүртгэлтэй хичээл байхгүй байна</p>
          </div>
        </div>
      );

      return (
        <div className="stu-card">
          <div className="stu-card-head">
            <div>
              <div className="stu-card-title">
                <i className="fas fa-layer-group"/> Миний хичээлүүд
              </div>
              <div className="stu-card-sub">Бүртгэлтэй хичээл, ахиц дэвшил</div>
            </div>
            <a href="#/Student-classes" className="stu-see-all">Бүгдийг харах →</a>
          </div>

          <div className="my-cls-grid">
            {classes.map((c, i) => {
              const pct     = getProgress(c);
              const pending = (c.assignments||[]).filter(a=>a.status==='active').length;
              const nextLsn = (c.lessons||[]).find(l=>l.badge==='upcoming');

              return (
                <a
                  key={i}
                  href="Student-classes.html"
                  className="my-cls-card"
                  style={{'--cc': c.color}}
                >
                  <div className="my-cls-top">
                    <div className="my-cls-icon" style={{background:`color-mix(in srgb,${c.color} 15%,#fff)`, color:c.color}}>
                      <i className={`fas ${c.icon || 'fa-book'}`}/>
                    </div>
                    <span className="my-cls-pct">{pct}%</span>
                  </div>
                  <div className="my-cls-name">{c.name}</div>
                  <div className="my-cls-bar-wrap">
                    <div className="my-cls-bar-fill" style={{width:`${pct}%`, background:c.color}}/>
                  </div>
                  <div className="my-cls-footer">
                    <span className="my-cls-next">
                      <i className="fas fa-play-circle"/>
                      {nextLsn ? nextLsn.title : 'Хичээл байхгүй'}
                    </span>
                    {pending > 0
                      ? <span className="my-cls-assign-chip">{pending} даалгавар</span>
                      : <span className="my-cls-assign-chip no-assign">Даалгаваргүй</span>
                    }
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      );
    }


    function ExamCard({ classes }) {
      const exams = getUpcomingExams(classes);

      if (!exams.length) return (
        <div className="stu-card">
          <div className="stu-card-head">
            <div>
              <div className="stu-card-title"><i className="fas fa-pen-square"/> Ойрын шалгалтууд</div>
              <div className="stu-card-sub">Бэлдэж байгаарай</div>
            </div>
          </div>
          <div className="sm-empty">
            <i className="fas fa-calendar-check"/>
            <p>Ойрын шалгалт байхгүй байна</p>
          </div>
        </div>
      );

      return (
        <div className="stu-card">
          <div className="stu-card-head">
            <div>
              <div className="stu-card-title"><i className="fas fa-pen-square"/> Ойрын шалгалтууд</div>
              <div className="stu-card-sub">Бэлдэж байгаарай</div>
            </div>
            <a href="#/calendar" className="stu-see-all" >Дэлгэрэнгүй →</a>
          </div>

          <div>
            {exams.map((ex, i) => {
              const { day, month } = parseExamDate(ex.meta);
              const days           = daysUntil(ex.meta);
              const urgent         = days !== null && days <= 3;

              return (
                <div className="exam-upcoming-row" key={i}>
                  <div className="exam-date-box" style={{background:`linear-gradient(135deg,${ex.classColor},${ex.classColor}99)`}}>
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
              );
            })}
          </div>
        </div>
      );
    }


    function StudentMain() {
      const [data,    setData]    = useState(null);
      const [loading, setLoading] = useState(true);
      const [error,   setError]   = useState(null);

      useEffect(() => {
        const uid = sessionStorage.getItem('user_id') || 'stu_001';
        fetchDashboard(uid)
          .then(d  => { setData(d);          setLoading(false); })
          .catch(e => { setError(e.message); setLoading(false); });
      }, []);

      if (loading) return (
        <div className="page-layout">
          <main className="main-content"><Spinner/></main>
        </div>
      );

      if (error) return (
        <div className="page-layout">
          <main className="main-content">
            <div className="sm-error">
              <i className="fas fa-exclamation-circle"/>
              <p>{error}</p>
              <button className="sm-retry-btn" onClick={() => window.location.reload()}>
                <i className="fas fa-redo"/> Дахин оролдох
              </button>
            </div>
          </main>
        </div>
      );

      const { user, classes } = data;

      return (
        <div className="page">
          <main >
            <Banner  user={user}    classes={classes}/>
            <Stats   classes={classes}/>
            <div className="stu-grid">
              <ClassCards classes={classes}/>
              <ExamCard   classes={classes}/>
            </div>
          </main>
        </div>
      );
    }

    window.StudentMain = StudentMain;

