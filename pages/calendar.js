const { useState, useEffect } = React;

// Демо дататай тохируулахын тулд (2026 оны 4-р сарын 19-нд гэж үзүүлэх)
const DEMO_TODAY = new Date(2026, 3, 19); 

const MN_MONTHS = ['1-р сар','2-р сар','3-р сар','4-р сар','5-р сар','6-р сар','7-р сар','8-р сар','9-р сар','10-р сар','11-р сар','12-р сар'];
const MN_DAYS_FULL = ['Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба','Ням'];

function Calendar() {
    const userId = sessionStorage.getItem('user_id') || 'stu_001';
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [curYear, setCurYear] = useState(DEMO_TODAY.getFullYear());
    const [curMonth, setCurMonth] = useState(DEMO_TODAY.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);

    // ── Date Helpers ──
    const pad2 = (n) => String(n).padStart(2, '0');
    const mkDate = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
    const todayStr = mkDate(DEMO_TODAY.getFullYear(), DEMO_TODAY.getMonth(), DEMO_TODAY.getDate());
    const getEvs = (ds) => events.filter(e => e.date === ds);

    // ── Fetch Data from DB ──
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // 1. Хэрэглэгчийн мэдээлэл авах (classId-г олж авах)
                const uRes = await fetch(`${window.API_URL}/users/${userId}`);
                const user = await uRes.json();
                const ids = Array.isArray(user.classId) ? user.classId : [user.classId].filter(Boolean);

                // 2. Бүх ангиудын мэдээлэл татах
                const cRes = await fetch(`${window.API_URL}/classes`);
                const allClasses = await cRes.json();
                const myClasses = allClasses.filter(c => ids.includes(c.id));

                let normalizedEvents = [];

                // 3. Анги тус бүрээс шалгалт, даалгавар, хичээлийг ялгаж авах
                myClasses.forEach(cls => {
                    // Шалгалтууд
                    (cls.exams || []).forEach(ex => {
                        normalizedEvents.push({
                            date: ex.date,
                            type: 'exam',
                            title: ex.title,
                            subject: cls.subject,
                            color: cls.color,
                            time: ex.date ? `${ex.date.split('-')[2]}:00` : '—',
                            duration: `${ex.duration || 0} мин`,
                            questions: ex.totalQuestions || 0
                        });
                    });

                    // Даалгаварууд
                    (cls.assignments || []).forEach(asn => {
                        const dueDate = new Date(asn.dueDate);
                        const diffTime = Math.ceil((dueDate - DEMO_TODAY) / 86400000);
                        normalizedEvents.push({
                            date: asn.dueDate,
                            type: 'assignment',
                            title: asn.title,
                            subject: cls.subject,
                            color: cls.color,
                            daysLeft: diffTime,
                            urgent: diffTime <= 3 && asn.status === 'active'
                        });
                    });

                    // Хичээлүүд (зөвхөн календарь дээр цэг тавихын тулд)
                    (cls.lessons || []).forEach(lsn => {
                        normalizedEvents.push({
                            date: lsn.date,
                            type: 'lesson',
                            title: lsn.title,
                            subject: cls.subject,
                            color: cls.color
                        });
                    });
                });

                setEvents(normalizedEvents);
            } catch (err) {
                console.error("Calendar fetch error:", err);
            }
            setLoading(false);
        }
        
        if (userId) loadData();
    }, [userId]);

    // ── Navigation Handlers ──
    const prevMonth = () => {
        let m = curMonth - 1;
        let y = curYear;
        if (m < 0) { m = 11; y--; }
        setCurMonth(m); setCurYear(y); setSelectedDate(null);
    };

    const nextMonth = () => {
        let m = curMonth + 1;
        let y = curYear;
        if (m > 11) { m = 0; y++; }
        setCurMonth(m); setCurYear(y); setSelectedDate(null);
    };

    // ── Derived State (Stats & Next Exam) ──
    const monthEvents = events.filter(e => {
        const d = new Date(e.date + 'T00:00:00');
        return d.getFullYear() === curYear && d.getMonth() === curMonth;
    });

    const statExams = monthEvents.filter(e => e.type === 'exam').length;
    const statAssigns = monthEvents.filter(e => e.type === 'assignment').length;
    const statUrgent = monthEvents.filter(e => e.urgent).length;

    const nextExam = events
        .filter(e => e.type === 'exam' && e.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date))[0];

    // ── Build Calendar Grid ──
    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
    const prevMonthDays = new Date(curYear, curMonth, 0).getDate();
    const offset = (firstDay + 6) % 7; // Даваа гаригаас эхлэх

    let cells = [];
    
    // Өмнөх сарын өдрүүд
    for (let i = offset - 1; i >= 0; i--) {
        cells.push(<div key={`p-${i}`} className="cal-cell cal-other"><div className="cal-date-num">{prevMonthDays - i}</div></div>);
    }

    // Энэ сарын өдрүүд
    for (let d = 1; d <= daysInMonth; d++) {
        const ds = mkDate(curYear, curMonth, d);
        const evs = getEvs(ds);
        const isToday = ds === todayStr;
        const isSelected = ds === selectedDate;
        
        let cls = "cal-cell";
        if (isToday) cls += " cal-today";
        if (isSelected) cls += " cal-selected";

        const dots = evs.slice(0, 4).map((e, i) => 
            <div key={i} className="cal-dot" style={{ background: e.color }}></div>
        );

        cells.push(
            <div key={ds} className={cls} onClick={() => setSelectedDate(ds)}>
                <div className="cal-date-num">{d}</div>
                {dots.length > 0 && <div className="cal-dots">{dots}</div>}
            </div>
        );
    }

    // Дараагийн сарын өдрүүд
    const totalFilled = offset + daysInMonth;
    const tail = totalFilled % 7 === 0 ? 0 : 7 - (totalFilled % 7);
    for (let d = 1; d <= tail; d++) {
        cells.push(<div key={`n-${d}`} className="cal-cell cal-other"><div className="cal-date-num">{d}</div></div>);
    }

    // ── Selected Day Details ──
    let detailHead, detailList;
    if (selectedDate) {
        const date = new Date(selectedDate + 'T00:00:00');
        const evs = getEvs(selectedDate);
        const dow = MN_DAYS_FULL[(date.getDay() + 6) % 7];
        const day = date.getDate();
        const month = MN_MONTHS[date.getMonth()];

        detailHead = (
            <>
                <div className="cal-detail-date-box">
                    <div className="cal-dnum">{day}</div>
                    <div className="cal-dmonth">{month}</div>
                </div>
                <div className="cal-detail-info">
                    <h4>{dow}</h4>
                    <p>{evs.length ? evs.length + ' үйл явдал' : 'Чөлөөтэй өдөр'}</p>
                </div>
            </>
        );

        detailList = evs.length > 0 ? evs.map((e, i) => {
            const isExam = e.type === 'exam';
            const icon = e.type === 'lesson' ? 'fa-book' : isExam ? 'fa-pen-square' : 'fa-tasks';
            let badgeCls = e.type;
            let badgeTxt = e.type === 'lesson' ? '📖 Хичээл' : isExam ? '📝 Шалгалт' : '📋 Даалгавар';
            
            if (e.urgent) { badgeCls = 'urgent'; badgeTxt = '🔥 Яаралтай'; }

            let meta = <span style={{color: e.color}}><i className="fas fa-book" style={{marginRight:'3px'}}></i>{e.subject}</span>;
            if (isExam) {
                meta = <>
                    <span><i className="fas fa-clock" style={{marginRight:'3px', color: e.color}}></i>{e.time}</span>
                    <span>{e.duration}</span>
                    <span>{e.questions} асуулт</span>
                </>;
            } else if (e.type === 'assignment') {
                meta = <>
                    <span style={{color: e.color}}><i className="fas fa-book" style={{marginRight:'3px'}}></i>{e.subject}</span>
                    <span style={{ color: e.daysLeft <= 0 ? '#ef4444' : '#64748b', fontWeight: e.daysLeft <= 0 ? 700 : 400 }}>
                        {e.daysLeft <= 0 ? 'Хоцорсон' : `${e.daysLeft} өдөр үлдсэн`}
                    </span>
                </>;
            }

            return (
                <div key={i} className="cal-event-item" style={{"--ec": e.color}}>
                    <div className="cal-event-icon" style={{ background: e.color + '22', color: e.color }}>
                        <i className={`fas ${icon}`}></i>
                    </div>
                    <div className="cal-event-body">
                        <div className="cal-event-title">{e.title}</div>
                        <div className="cal-event-meta">{meta}</div>
                    </div>
                    <span className={`cal-event-badge ${badgeCls}`}>{badgeTxt}</span>
                </div>
            );
        }) : (
            <div className="cal-no-events">
                <i className="fas fa-check-circle"></i>
                <p>Энэ өдөр тэмдэглэгдсэн зүйл байхгүй байна</p>
            </div>
        );
    } else {
        detailHead = (
            <>
                <div className="cal-detail-date-box" style={{ background: 'linear-gradient(135deg,#94a3b8,#64748b)' }}>
                    <div className="cal-dnum" style={{ fontSize: '14px' }}><i className="fas fa-hand-pointer"></i></div>
                </div>
                <div className="cal-detail-info">
                    <h4>Өдөр сонгоно уу</h4>
                    <p>Хуваарийг харахын тулд өдөрт дарна уу</p>
                </div>
            </>
        );
        detailList = (
            <div className="cal-no-events">
                <i className="fas fa-calendar"></i>
                <p>Харахыг хүсэж буй өдрийг дарна уу</p>
            </div>
        );
    }

    // ── Next Exam Countdown Logic ──
    let countdownUI = null;
    if (nextExam) {
        const diff = Math.round((new Date(nextExam.date + 'T00:00:00') - new Date(todayStr + 'T00:00:00')) / 86400000);
        const prep = 14;
        const pct = Math.max(0, Math.min(100, Math.round((prep - diff) / prep * 100)));
        const urgCls = diff <= 3 ? 'urgent' : diff <= 7 ? 'soon' : 'ok';
        const urgTxt = diff === 0 ? 'Өнөөдөр!' : diff <= 3 ? 'Яаралтай' : diff + ' өдөр';
        const d = new Date(nextExam.date + 'T00:00:00');
        const dateStr = `${d.getDate()} · ${MN_MONTHS[d.getMonth()]}`;

        countdownUI = (
            <div className="cal-countdown-card" style={{"--ec": nextExam.color}}>
                <div className="cal-countdown-top">
                    <span className="cal-countdown-tag"><i className="fas fa-bell"></i> Дараагийн шалгалт</span>
                    <span className="cal-countdown-subj" style={{ color: nextExam.color }}>{nextExam.subject}</span>
                </div>
                <div className="cal-countdown-title">{nextExam.title}</div>
                <div className="cal-countdown-center">
                    <div className="cal-countdown-ring" style={{"--rc": nextExam.color}}>
                        <span className={`cal-countdown-num ${urgCls}`}>{diff === 0 ? '!' : diff}</span>
                        <span className="cal-countdown-unit">өдөр</span>
                    </div>
                    <div className="cal-countdown-right">
                        <div className={`cal-countdown-badge ${urgCls}`}>{urgTxt}</div>
                        <div className="cal-countdown-detail"><i className="fas fa-calendar-alt"></i>{dateStr}</div>
                        <div className="cal-countdown-detail"><i className="fas fa-clock"></i>{nextExam.time}</div>
                        <div className="cal-countdown-detail"><i className="fas fa-list-ol"></i>{nextExam.questions} асуулт · {nextExam.duration}</div>
                    </div>
                </div>
                <div className="cal-countdown-prep-label">
                    <span>Бэлтгэлийн явц</span><span>{pct}%</span>
                </div>
                <div className="cal-countdown-bar-wrap">
                    <div className="cal-countdown-bar" style={{ width: `${pct}%`, background: nextExam.color }}></div>
                </div>
            </div>
        );
    }

    if (loading) return <div className="page" style={{ textAlign: 'center', paddingTop: '60px', color: '#64748b' }}>Ачааллаж байна...</div>;

    return (
        <div className="page">
            {/* Header */}
            <div className="cal-page-header">
                <div>
                    <div className="cal-page-title"><i className="fas fa-calendar-alt" style={{ color: '#3b82f6', marginRight: '10px' }}></i>Хуваарь</div>
                    <div className="cal-page-sub">Шалгалт болон даалгаврын дуусах хугацааг хянаарай</div>
                </div>
            </div>

            <div className="cal-layout">
                {/* Left: Calendar */}
                <div className="cal-card">
                    <div className="cal-month-header">
                        <div className="cal-month-nav">
                            <button className="cal-nav-btn" onClick={prevMonth}><i className="fas fa-chevron-left"></i></button>
                            <div className="cal-month-label">{curYear} оны {MN_MONTHS[curMonth]}</div>
                            <button className="cal-nav-btn" onClick={nextMonth}><i className="fas fa-chevron-right"></i></button>
                        </div>
                        <div className="cal-legend">
                            <div className="cal-legend-item"><div className="cal-legend-dot" style={{ background: '#3b82f6' }}></div>Шалгалт</div>
                            <div className="cal-legend-item"><div className="cal-legend-dot" style={{ background: '#f59e0b' }}></div>Даалгавар</div>
                            <div className="cal-legend-item"><div className="cal-legend-dot" style={{ background: '#ef4444' }}></div>Яаралтай</div>
                        </div>
                    </div>

                    <div className="cal-day-names">
                        <div className="cal-dname">Да</div>
                        <div className="cal-dname">Мя</div>
                        <div className="cal-dname">Лх</div>
                        <div className="cal-dname">Пү</div>
                        <div className="cal-dname">Ба</div>
                        <div className="cal-dname">Бя</div>
                        <div className="cal-dname">Ня</div>
                    </div>

                    <div className="cal-grid">
                        {cells}
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="cal-sidebar">
                    {/* Day Detail Panel */}
                    <div className="cal-detail">
                        <div className="cal-detail-head">
                            {detailHead}
                        </div>
                        <div className="cal-event-list">
                            {detailList}
                        </div>
                    </div>

                    {/* Countdown Card */}
                    {countdownUI}

                    {/* Month Stats */}
                    <div className="cal-month-stats">
                        <div className="cal-ms-head"><i className="fas fa-chart-pie"></i>Сарын хураангуй</div>
                        <div className="cal-ms-row">
                            <div className="cal-ms-dot" style={{ background: '#3b82f6' }}></div>
                            <div className="cal-ms-lbl">Шалгалт</div>
                            <div className="cal-ms-val">{statExams}</div>
                        </div>
                        <div className="cal-ms-row">
                            <div className="cal-ms-dot" style={{ background: '#f59e0b' }}></div>
                            <div className="cal-ms-lbl">Даалгавар</div>
                            <div className="cal-ms-val">{statAssigns}</div>
                        </div>
                        <div className="cal-ms-row" style={{ marginBottom: 0 }}>
                            <div className="cal-ms-dot" style={{ background: '#ef4444' }}></div>
                            <div className="cal-ms-lbl">Яаралтай</div>
                            <div className="cal-ms-val">{statUrgent}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

window.Calendar = Calendar;