const { useState, useEffect } = React;

function TeacherMain() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{"id": "teacher_1", "firstName": "Багш"}');
    const teacherId = user.id;

    const [stats, setStats] = useState({ 
        classes: 0, 
        students: 0, 
        upcoming: 0, 
        examAvg: '0%', 
        newStudents: 0 
    });
    const [recentClasses, setRecentClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingAssignments, setPendingAssignments] = useState([]);
    const [upcomingSchedules, setUpcomingSchedules] = useState([]);

    useEffect(() => {
        fetch(`${window.API_URL}/classes?teacherId=${teacherId}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const totalStudents = data.reduce((sum, c) => {
                        const count = (c.studentList && Array.isArray(c.studentList)) 
                                    ? c.studentList.length 
                                    : (c.students || 0);
                        return sum + count;
                    }, 0);
                    
                    const upcomingExamsCount = data.flatMap(cls => (cls.exams || []))
                                                   .filter(exam => exam.status === 'upcoming').length;
                                                   
                    const totalAvgSum = data.reduce((sum, c) => sum + (c.avgNum || 0), 0);
                    const finalAvg = Math.round(totalAvgSum / data.length);

                    const lastCheck = localStorage.getItem('last_check') || new Date().toISOString();
                    const allStudentList = data.flatMap(c => c.studentList || []);
                    const newOnes = allStudentList.filter(s => new Date(s.joinedAt) > new Date(lastCheck)).length;

                    setStats({
                        classes: data.length,
                        students: totalStudents,
                        upcoming: upcomingExamsCount,
                        examAvg: finalAvg + '%',
                        newStudents: newOnes
                    });

                    setRecentClasses(data.slice(0, 4));

                    const allAssignments = data.flatMap(cls => 
                        (cls.assignments || []).map(asn => ({
                            ...asn,
                            className: cls.name
                        }))
                    );
                    setPendingAssignments(allAssignments.filter(asn => asn.status === 'active').slice(0, 3));

                   
                    const allSchedules = data.flatMap(cls => 
                        (cls.exams || []).map(exam => {
                            const dateParts = (exam.date || "").split('-');
                            return {
                                ...exam,
                                className: cls.name,
                                day: dateParts[2] || "00",
                                month: dateParts[1] ? parseInt(dateParts[1]) + " сар" : "Тун удахгүй"
                            };
                        })
                    );
                    setUpcomingSchedules(allSchedules.filter(ex => ex.status === 'upcoming').slice(0, 3));
                    
                    localStorage.setItem('last_check', new Date().toISOString());
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Дата татахад алдаа гарлаа:", err);
                setLoading(false);
            });
    }, [teacherId]);

    if (loading) return <div className="page-loading">Ачаалж байна...</div>;

    return (
        <div className="page">
            <div className="teacher-banner">
                <div className="teacher-banner-text">
                    <div className="banner-eyebrow"><i className="fas fa-chalkboard-teacher"></i> Багшийн самбар</div>
                    
                    <h1 className="banner-title">Сайн байна уу, <span>{user.firstName}</span>!</h1>
                    <p className="banner-sub">Өнөөдрийн байдлаарх сургалтын нэгдсэн мэдээлэл</p>
                </div>
                <div className="banner-actions">
                    <button className="btn-banner" onClick={() => window.location.hash = '#/teacher-classes'}>
                        <i className="fas fa-plus"></i> Хичээл нэмэх
                    </button>
                    <button className="btn-banner outline" onClick={() => window.location.hash = '#/teacher-classes'}>
                        <i className="fas fa-pen"></i> Шалгалт үүсгэх
                    </button>
                </div>
            </div>

            <div className="teacher-stats">
                <div className="t-stat-card">
                    <div className="t-stat-icon" style={{background:'#d1fae5', color:'#065f46'}}><i className="fas fa-layer-group"></i></div>
                    <div className="t-stat-body">
                        <div className="t-stat-val">{stats.classes}</div>
                        <div className="t-stat-lbl">Идэвхтэй анги</div>
                    </div>
                </div>
                <div className="t-stat-card">
                    <div className="t-stat-icon" style={{background:'#dbeafe', color:'#1d4ed8'}}><i className="fas fa-users"></i></div>
                    <div className="t-stat-body">
                        <div className="t-stat-val">{stats.students}</div>
                        <div className="t-stat-lbl">Нийт сурагч</div>
                    </div>
                    {stats.newStudents > 0 && (
                        <div className="t-stat-trend up"><i className="fas fa-arrow-up"></i> +{stats.newStudents}</div>
                    )}
                </div>
                <div className="t-stat-card">
                    <div className="t-stat-icon" style={{background:'#fef3c7', color:'#92400e'}}><i className="fas fa-tasks"></i></div>
                    <div className="t-stat-body">
                        <div className="t-stat-val">{stats.upcoming}</div>
                        <div className="t-stat-lbl">Хүлээгдэж буй</div>
                    </div>
                </div>
                <div className="t-stat-card">
                    <div className="t-stat-icon" style={{background:'#ede9fe', color:'#5b21b6'}}><i className="fas fa-chart-bar"></i></div>
                    <div className="t-stat-body">
                        <div className="t-stat-val">{stats.examAvg}</div>
                        <div className="t-stat-lbl">Шалгалтын дундаж</div>
                    </div>
                </div>
            </div>

            <div className="teacher-grid">
                <div className="teacher-col-main">
                    <div className="t-card">
                        <div className="t-card-head">
                            <div><h3><i className="fas fa-layer-group"></i> Миний ангиуд</h3><p>Идэвхтэй {recentClasses.length} анги</p></div>
                            <button className="t-btn-sm" onClick={() => window.location.hash = '#/teacher-classes'}>
                                Бүгдийг харах <i className="fas fa-arrow-right"></i>
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
                            <div><h3><i className="fas fa-tasks"></i> Даалгаварууд</h3><p>Шалгах шаардлагатай</p></div>
                            <button className="t-btn-sm" onClick={() => window.location.hash = '#/teacher-classes'}>
                                Бүгдийг харах <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                        <div className="assign-list">
                            {pendingAssignments.length > 0 ? (
                                pendingAssignments.map(asn => (
                                    <div className="assign-row" key={asn.id}>
                                        <div className="assign-status-dot active"></div>
                                        <div className="assign-info">
                                            <div className="assign-title">{asn.title}</div>
                                            
                                            <div className="assign-meta">{asn.className} · Дуусах: {asn.dueDate || 'Хугацаагүй'}</div>
                                        </div>
                                        <span className="assign-badge active">Идэвхтэй</span>
                                    </div>
                                ))
                            ) : <p className="empty-msg">Шалгах даалгавар байхгүй.</p>}
                        </div>
                    </div>
                </div>

                <div className="teacher-col-side">
                    <div className="t-card">
                        <div className="t-card-head">
                            <div><h3><i className="fas fa-pen-square"></i> Шалгалтууд</h3><p>Ойрын хуваарь</p></div>
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
    );
}

function TeacherClassCard({ color, icon, name, subject, avg, students, lessons }) {
   
    const lessonCount = Array.isArray(lessons) ? lessons.length : 0;
    
    return (
        <div className="t-cls-card" style={{"--cc": color}}>
            <div className="t-cls-top">
                <div className="t-cls-icon" style={{background: `${color}20`, color: color}}>
                    <i className={`fas ${icon || 'fa-book'}`}></i>
                </div>
                <span className="t-cls-avg">{avg}</span>
            </div>
            <div className="t-cls-content">
                <div className="t-cls-name">{name} - {subject}</div>
                <div className="t-cls-meta">{students} сурагч · {lessonCount} хичээл</div>
                <div className="t-cls-bar-wrap">
                    <div className="t-cls-bar-fill" style={{width: avg?.includes('%') ? avg : `${avg}%`, background: color}}></div>
                </div>
            </div>
        </div>
    );
}

window.TeacherMain = TeacherMain;