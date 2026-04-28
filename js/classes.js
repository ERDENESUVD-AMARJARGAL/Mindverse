const SUBJECT_ICONS = {
  'Алгебр':'fa-square-root-variable', 'Геометр':'fa-shapes',
  'Физик':'fa-atom', 'Хими':'fa-flask',
  'Биологи':'fa-seedling', 'Түүх':'fa-landmark',
};

const SUBJECTS = {
  'Алгебр':  { color:'#3b82f6', bg:'#dbeafe', icon:'fa-calculator' },
  'Геометр': { color:'#10b981', bg:'#d1fae5', icon:'fa-shapes' },
  'Физик':   { color:'#8b5cf6', bg:'#ede9fe', icon:'fa-atom' },
  'Хими':    { color:'#f59e0b', bg:'#fef3c7', icon:'fa-flask' },
};

const CLASSES = [
  {
    id:1, name:'10А Алгебр', subject:'Алгебр', teacher:'Б. Сарантуяа', color:'#3b82f6',
    classAvg: 76,
    lessons:[
      {title:'Тэгшитгэл ба тэгш бус байдал', dur:'45 мин', date:'2026-02-10', status:'done'},
      {title:'Квадрат тэгшитгэл',             dur:'50 мин', date:'2026-02-17', status:'done'},
      {title:'Функц ба график',                dur:'55 мин', date:'2026-02-24', status:'done'},
      {title:'Логарифм',                       dur:'50 мин', date:'2026-03-03', status:'done'},
      {title:'Тригонометрийн тэгшитгэл',       dur:'60 мин', date:'2026-04-21', status:'pending'},
      {title:'Комплекс тоо',                   dur:'50 мин', date:'2026-05-05', status:'new'},
      {title:'Дифференциал тооцоо',            dur:'55 мин', date:'2026-05-12', status:'new'},
    ],
    materials:[
      {name:'Алгебрийн лекц 1–5',         type:'pdf', size:'2.4 MB', date:'2026-03-10', cat:'Лекц'},
      {name:'Дасгал бодлогын цуглуулга',  type:'pdf', size:'1.8 MB', date:'2026-03-18', cat:'Дасгал'},
      {name:'Функцийн графикийн жишээ',   type:'img', size:'840 KB', date:'2026-03-25', cat:'Зураг'},
      {name:'Нэмэлт материал — логарифм', type:'doc', size:'560 KB', date:'2026-04-02', cat:'Нэмэлт'},
    ],
    exams:[
      {name:'1-р улирлын шалгалт',       date:'2026-02-20', score:88, total:100, classAvgScore:76},
      {name:'Квадрат тэгшитгэлийн тест', date:'2026-03-15', score:75, total:100, classAvgScore:69},
      {name:'2-р улирлын шалгалт',       date:'2026-05-10', score:null, total:100, classAvgScore:null},
    ],
  },
  {
    id:2, name:'10А Геометр', subject:'Геометр', teacher:'Д. Мөнхбаяр', color:'#10b981',
    classAvg: 72,
    lessons:[
      {title:'Гурвалжны шинж чанар', dur:'45 мин', date:'2026-02-12', status:'done'},
      {title:'Теорем Пифагор',        dur:'50 мин', date:'2026-02-19', status:'done'},
      {title:'Дугуйн тухай',          dur:'45 мин', date:'2026-02-26', status:'done'},
      {title:'Координатын систем',    dur:'50 мин', date:'2026-04-16', status:'pending'},
      {title:'Векторын тооцоо',       dur:'55 мин', date:'2026-05-07', status:'new'},
      {title:'Орон зайн геометр',     dur:'50 мин', date:'2026-05-14', status:'new'},
    ],
    materials:[
      {name:'Геометрийн томьёо', type:'pdf', size:'1.1 MB', date:'2026-03-05', cat:'Лекц'},
      {name:'Зургийн жишээ',     type:'img', size:'2.2 MB', date:'2026-03-20', cat:'Зураг'},
      {name:'Теоремын баталгаа', type:'doc', size:'780 KB', date:'2026-04-01', cat:'Нэмэлт'},
    ],
    exams:[
      {name:'1-р улирлын шалгалт', date:'2026-02-22', score:92, total:100, classAvgScore:72},
      {name:'Дундын тест',         date:'2026-04-05', score:68, total:100, classAvgScore:74},
      {name:'2-р улирлын шалгалт', date:'2026-05-12', score:null, total:100, classAvgScore:null},
    ],
  },
  {
    id:3, name:'10А Физик', subject:'Физик', teacher:'Н. Батбаяр', color:'#8b5cf6',
    classAvg: 68,
    lessons:[
      {title:'Механик хөдөлгөөн',  dur:'50 мин', date:'2026-02-14', status:'done'},
      {title:'Ньютоны хуулиуд',    dur:'55 мин', date:'2026-02-21', status:'done'},
      {title:'Хүч ба энерги',      dur:'50 мин', date:'2026-04-18', status:'pending'},
      {title:'Дулааны физик',      dur:'55 мин', date:'2026-04-25', status:'new'},
      {title:'Цахилгаан',          dur:'60 мин', date:'2026-05-09', status:'new'},
    ],
    materials:[
      {name:'Физикийн лекц 1–3', type:'pdf', size:'3.1 MB', date:'2026-03-12', cat:'Лекц'},
      {name:'Туршилтын тайлан',  type:'doc', size:'920 KB', date:'2026-03-28', cat:'Тайлан'},
      {name:'Томьёоны хүснэгт',  type:'pdf', size:'450 KB', date:'2026-04-01', cat:'Лавлах'},
    ],
    exams:[
      {name:'1-р улирлын шалгалт', date:'2026-02-25', score:80, total:100, classAvgScore:68},
      {name:'2-р улирлын шалгалт', date:'2026-05-14', score:null, total:100, classAvgScore:null},
    ],
  },
  {
    id:4, name:'10А Хими', subject:'Хими', teacher:'О. Цэцэгмаа', color:'#f59e0b',
    classAvg: 65,
    lessons:[
      {title:'Атом ба молекул',    dur:'45 мин', date:'2026-02-16', status:'done'},
      {title:'Химийн холбоо',      dur:'50 мин', date:'2026-04-20', status:'pending'},
      {title:'Урвалын тэгшитгэл', dur:'55 мин', date:'2026-04-27', status:'new'},
      {title:'Хүчил ба суурь',    dur:'50 мин', date:'2026-05-11', status:'new'},
    ],
    materials:[
      {name:'Химийн тэмдгүүд',   type:'pdf', size:'800 KB', date:'2026-03-15', cat:'Лавлах'},
      {name:'Урвалын тэгшитгэл', type:'doc', size:'640 KB', date:'2026-04-05', cat:'Дасгал'},
    ],
    exams:[
      {name:'1-р улирлын шалгалт', date:'2026-02-28', score:72, total:100, classAvgScore:65},
      {name:'2-р улирлын шалгалт', date:'2026-05-16', score:null, total:100, classAvgScore:null},
    ],
  },
];

const ASSIGNMENTS = [
  {
    id:1, title:'Квадрат тэгшитгэл – Гэрийн даалгавар',
    subject:'Алгебр', desc:'2.5, 3.1-р хэсгийн 12 бодлого бод. Хэрэглэгдэх томъёог тодорхой бичиж ажлаа гаргах.',
    due:'2026-04-22', daysLeft:3, status:'pending', priority:'high',
    teacher:'Б. Сарантуяа',
    teacherFiles:[
      {name:'Квадрат_тэгшитгэл_даалгавар.pdf', size:'312 KB', type:'pdf',
       content:'Доорх 12 бодлогыг шийдэж, хариуг тоо тус бүрт бичнэ үү.\n\n1. x² − 5x + 6 = 0\n2. 2x² + 3x − 2 = 0\n3. x² − 4 = 0\n4. 3x² − 12x = 0\n5. x² + 2x + 1 = 0\n6. x² − 7x + 10 = 0\n7. 4x² − 1 = 0\n8. x² + x − 6 = 0\n9. 2x² − 8 = 0\n10. x² − 9x + 20 = 0\n11. x² + 5x + 4 = 0\n12. 3x² − 5x + 2 = 0'},
      {name:'Лекцийн_материал_Квадрат.pdf', size:'1.2 MB', type:'pdf',
       content:'Квадрат тэгшитгэл: ax² + bx + c = 0\n\nШийдлийн томъёо: x = (−b ± √(b²−4ac)) / 2a\n\nМилл бол: D = b² − 4ac\n\nD > 0 → 2 бодит шийд\nD = 0 → 1 давхар шийд\nD < 0 → Бодит шийдгүй'},
    ],
    studentFile: null, submittedAt: null, studentNotes: '',
  },
  {
    id:2, title:'Функцийн утга – ГД',
    subject:'Алгебр', desc:'График зур, тайлбарла.',
    due:'2026-04-25', daysLeft:6, status:'pending', priority:'medium',
    teacher:'Б. Сарантуяа',
    teacherFiles:[
      {name:'Функц_график_даалгавар.pdf', size:'245 KB', type:'pdf',
       content:'Доорх функцуудын графикийг [-3, 3] завсарт байгуул:\n\n1. f(x) = x² − 2x + 1\n2. g(x) = 2x + 3\n3. h(x) = |x − 1|\n4. k(x) = √x + 1\n\nТус бүрийн орой, тэнхлэгтэй огтлолцох цэгийг тодорхойл.'},
    ],
    studentFile: null, submittedAt: null, studentNotes: '',
  },
  {
    id:3, title:'Векторын тооцоо – Бие даалт',
    subject:'Геометр', desc:'Координатын системд вектор нэмэх, хасах ажилладаг.',
    due:'2026-04-28', daysLeft:9, status:'pending', priority:'medium',
    teacher:'Д. Мөнхбаяр',
    teacherFiles:[], studentFile: null, submittedAt: null, studentNotes: '',
  },
  {
    id:4, title:'Хүч ба энерги – Нэмэлт дасгал',
    subject:'Физик', desc:'Хүчний диаграмм зур, тооцоо хий.',
    due:'2026-04-30', daysLeft:11, status:'pending', priority:'low',
    teacher:'Н. Батбаяр',
    teacherFiles:[
      {name:'Хүч_энерги_бодлого.pdf', size:'188 KB', type:'pdf',
       content:'Нэмэлт даалгавар:\n\n1. 5 kg масстай биет 10 м/с хурдтай хөдлөж байна. Кинетик энергийг ол.\n2. 2 kg масстай биет 3 м өндөрт байна. Потенциал энергийг g=10 м/с² гэж ол.\n3. 100 N хүч 5 м зайд хийсэн ажлыг ол.'},
    ],
    studentFile: null, submittedAt: null, studentNotes: '',
  },
  {
    id:5, title:'Теорем Пифагор – Гэрийн даалгавар',
    subject:'Геометр', desc:'Гурвалжны тооцоо.',
    due:'2026-04-10', daysLeft:-9, status:'done', priority:'medium',
    teacher:'Д. Мөнхбаяр',
    teacherFiles:[{name:'Пифагор_даалгавар.pdf', size:'156 KB', type:'pdf', content:'...'}],
    studentFile: {name:'миний_хариу_пифагор.pdf', size:'210 KB', type:'pdf'}, submittedAt:'2026-04-10 09:32', studentNotes:'Бүх бодлогыг шийдлээ.',
  },
  {
    id:6, title:'Тэгшитгэл ба тэгш бус байдал – ГД',
    subject:'Алгебр', desc:'',
    due:'2026-04-05', daysLeft:-14, status:'done', priority:'low',
    teacher:'Б. Сарантуяа',
    teacherFiles:[], studentFile: null, submittedAt:'2026-04-05 14:20', studentNotes:'',
  },
  {
    id:7, title:'Химийн тэмдгүүд цээжлэх',
    subject:'Хими', desc:'1–20-р элемент.',
    due:'2026-04-08', daysLeft:-11, status:'done', priority:'low',
    teacher:'О. Цэцэгмаа',
    teacherFiles:[], studentFile: null, submittedAt:'2026-04-07 22:15', studentNotes:'',
  },
  {
    id:8, title:'Механик хөдөлгөөн – Тайлан',
    subject:'Физик', desc:'Туршилтын тайлан бич.',
    due:'2026-04-12', daysLeft:-7, status:'done', priority:'medium',
    teacher:'Н. Батбаяр',
    teacherFiles:[{name:'Тайлангийн_загвар.docx', size:'78 KB', type:'doc', content:'Тайлангийн бүтэц:\n1. Зорилго\n2. Онол\n3. Арга зүй\n4. Үр дүн\n5. Дүгнэлт'}],
    studentFile: {name:'механик_тайлан.docx', size:'145 KB', type:'doc'}, submittedAt:'2026-04-12 08:45', studentNotes:'Туршилтыг 3 удаа давтаж гүйцэтгэлээ.',
  },
];

let selectedIdx = -1, activeTab = 'lessons', assignmentFilter = 'all';
let viewerAssignId = null, viewerStudentFile = null;

/* ── helpers ── */
function hexToRgb(h) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : null;
}
function scoreColor(s) {
  if (s >= 80) return '#10b981';
  if (s >= 65) return '#f59e0b';
  return '#ef4444';
}
function scoreLetter(pct) {
  if (pct >= 90) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 60) return 'C';
  return 'D';
}
function subjectIcon(subj) { return SUBJECT_ICONS[subj] || 'fa-book-open'; }

function fileIcon(type) {
  const m = {pdf:'fa-file-pdf', doc:'fa-file-word', docx:'fa-file-word',
             jpg:'fa-file-image', jpeg:'fa-file-image', png:'fa-file-image', zip:'fa-file-archive'};
  return m[type] || 'fa-file';
}
function getDueBadge(a) {
  if (a.status === 'done') return '<span class="due-badge ok"><i class="fas fa-check" style="margin-right:3px"></i>Дуусгасан</span>';
  if (a.daysLeft <= 0)  return `<span class="due-badge overdue"><i class="fas fa-times" style="margin-right:3px"></i>${Math.abs(a.daysLeft)} өдөр хоцорсон</span>`;
  if (a.daysLeft <= 3)  return `<span class="due-badge urgent"><i class="fas fa-fire" style="margin-right:3px"></i>${a.daysLeft} өдөр үлдсэн</span>`;
  if (a.daysLeft <= 7)  return `<span class="due-badge soon">${a.daysLeft} өдөр үлдсэн</span>`;
  return `<span class="due-badge ok">${a.daysLeft} өдөр үлдсэн</span>`;
}
function getStatusPill(a) {
  if (a.status === 'done') return '<span class="status-pill done"><i class="fas fa-check"></i>Дуусгасан</span>';
  if (a.daysLeft <= 3)     return '<span class="status-pill overdue"><i class="fas fa-fire"></i>Яаралтай</span>';
  return '<span class="status-pill pending"><i class="fas fa-clock"></i>Хийгдэж байна</span>';
}

/* ── Summary KPI bar ── */
function buildSummary() {
  let totalLessons = 0, totalDone = 0, scoreSum = 0, scoreCount = 0;
  CLASSES.forEach(c => {
    totalLessons += c.lessons.length;
    totalDone    += c.lessons.filter(l => l.status === 'done').length;
    c.exams.forEach(e => {
      if (e.score !== null) { scoreSum += e.score / e.total * 100; scoreCount++; }
    });
  });
  const pendingAssign = ASSIGNMENTS.filter(a => a.status !== 'done').length;
  document.getElementById('kpiLessons').textContent = totalLessons;
  document.getElementById('kpiDone').textContent    = totalDone;
  document.getElementById('kpiAvg').textContent     = scoreCount ? Math.round(scoreSum / scoreCount) + '%' : '—';
  document.getElementById('kpiAssign').textContent  = pendingAssign;
}

/* ── Card SVG ring ── */
function ringHTML(pct, color, r) {
  const circ = 2 * Math.PI * r;
  const dash  = circ * pct / 100;
  return `<svg width="${r*2+10}" height="${r*2+10}" viewBox="0 0 ${r*2+10} ${r*2+10}">
    <circle cx="${r+5}" cy="${r+5}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="4"/>
    <circle cx="${r+5}" cy="${r+5}" r="${r}" fill="none" stroke="${color}" stroke-width="4"
      stroke-dasharray="${dash} ${circ}" stroke-linecap="round"/>
  </svg>`;
}

/* ── Search ── */
let clsSearchQuery = '';
function filterClasses(q) {
  clsSearchQuery = q.trim().toLowerCase();
  const clearBtn = document.getElementById('clsSearchClear');
  const badge    = document.getElementById('clsSearchBadge');
  if (clearBtn) clearBtn.classList.toggle('visible', !!clsSearchQuery);
  buildCards();
  const count = document.querySelectorAll('.cls-card').length;
  if (badge) {
    badge.style.display = clsSearchQuery ? '' : 'none';
    badge.textContent   = count + ' хичээл олдлоо';
  }
}
function clearClsSearch() {
  const inp = document.getElementById('clsSearch');
  if (inp) inp.value = '';
  filterClasses('');
}

/* ── Build class cards ── */
function buildCards() {
  const grid  = document.getElementById('clsGrid');
  const noRes = document.getElementById('clsNoResults');

  const source = clsSearchQuery
    ? CLASSES.filter(c => (c.name + c.subject + c.teacher).toLowerCase().includes(clsSearchQuery))
    : CLASSES;

  const html = source.map(c => {
    const realIdx = CLASSES.indexOf(c);
    const done    = c.lessons.filter(l => l.status==='done').length;
    const pending = c.lessons.filter(l => l.status==='pending').length;
    const newL    = c.lessons.filter(l => l.status==='new').length;
    const total   = c.lessons.length;
    const pct     = Math.round(done/total*100);
    const taken   = c.exams.filter(e => e.score !== null).length;
    const assignCount = ASSIGNMENTS.filter(a => a.subject === c.subject && a.status !== 'done').length;
    return `
    <div class="cls-card" id="clsCard${realIdx}" style="--cc:${c.color}" onclick="selectClass(${realIdx})">
      <div class="cls-card-header">
        <div class="cls-card-icon-box"><i class="fas ${subjectIcon(c.subject)}"></i></div>
        <div class="cls-card-ring">
          ${ringHTML(pct, c.color, 21)}
          <div class="cls-card-ring-val">${pct}%</div>
        </div>
      </div>
      <div class="cls-card-body">
        <div class="cls-card-subject">${c.subject}</div>
        <div class="cls-card-name">${c.name}</div>
        <div class="cls-card-teacher"><i class="fas fa-chalkboard-teacher"></i>${c.teacher}</div>
        <div class="cls-card-strip">
          <div class="cls-card-strip-item">
            <div class="cls-card-strip-val">${done}</div>
            <div class="cls-card-strip-lbl">Хичээл</div>
          </div>
          <div class="cls-card-strip-item">
            <div class="cls-card-strip-val">${taken}</div>
            <div class="cls-card-strip-lbl">Шалгалт</div>
          </div>
          <div class="cls-card-strip-item">
            <div class="cls-card-strip-val">${assignCount}</div>
            <div class="cls-card-strip-lbl">Даалгавар</div>
          </div>
        </div>
        <div class="cls-card-stacked">
          <div class="cls-card-s-done"    style="width:${done/total*100}%"></div>
          <div class="cls-card-s-pending" style="width:${pending/total*100}%"></div>
          <div class="cls-card-s-new"     style="width:${newL/total*100}%"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.cls-card').forEach(el => el.remove());
  grid.insertAdjacentHTML('afterbegin', html);
  if (noRes) noRes.style.display = source.length === 0 ? 'block' : 'none';
}

/* ── Select class ── */
function selectClass(idx) {
  selectedIdx = idx;
  assignmentFilter = 'all';
  const c = CLASSES[idx];

  document.querySelectorAll('.cls-card').forEach(el => {
    el.classList.remove('selected');
    el.style.boxShadow = '';
    el.style.borderColor = '';
    if (el.id === `clsCard${idx}`) el.classList.add('selected');
  });

  document.getElementById('clsGrid').classList.add('has-detail');
  const det = document.getElementById('clsDetail');
  det.classList.add('visible');
  det.style.setProperty('--dcolor', c.color);

  document.getElementById('detIcon').innerHTML    = `<i class="fas ${subjectIcon(c.subject)}"></i>`;
  document.getElementById('detIcon').style.background = `color-mix(in srgb, ${c.color} 14%, #fff)`;
  document.getElementById('detIcon').style.color      = c.color;
  document.getElementById('detSubject').textContent   = c.subject;
  document.getElementById('detTitle').textContent     = c.name;
  document.getElementById('detTeacher').innerHTML     = `<i class="fas fa-chalkboard-teacher" style="margin-right:5px;opacity:.7"></i>${c.teacher}`;

  const done      = c.lessons.filter(l => l.status==='done').length;
  const total     = c.lessons.length;
  const scoresArr = c.exams.filter(e => e.score!==null);
  const avg       = scoresArr.length ? Math.round(scoresArr.reduce((s,e)=>s+e.score/e.total*100,0)/scoresArr.length) : null;
  const upcoming  = c.exams.filter(e => e.score===null).length;
  const pendingA  = ASSIGNMENTS.filter(a => a.subject===c.subject && a.status!=='done').length;

  document.getElementById('detKpis').innerHTML = `
    <div class="cls-det-kpi">
      <div class="cls-det-kpi-icon"><i class="fas fa-check"></i></div>
      <div class="cls-det-kpi-val">${done}/${total}</div>
      <div class="cls-det-kpi-lbl">Хичээл</div>
    </div>
    <div class="cls-det-kpi">
      <div class="cls-det-kpi-icon"><i class="fas fa-star"></i></div>
      <div class="cls-det-kpi-val">${avg !== null ? avg+'%' : '—'}</div>
      <div class="cls-det-kpi-lbl">Дундаж</div>
    </div>
    <div class="cls-det-kpi">
      <div class="cls-det-kpi-icon"><i class="fas fa-file-alt"></i></div>
      <div class="cls-det-kpi-val">${upcoming}</div>
      <div class="cls-det-kpi-lbl">Шалгалт</div>
    </div>
    <div class="cls-det-kpi">
      <div class="cls-det-kpi-icon"><i class="fas fa-tasks"></i></div>
      <div class="cls-det-kpi-val">${pendingA}</div>
      <div class="cls-det-kpi-lbl">Даалгавар</div>
    </div>`;

  switchTab(activeTab);
}

function closeDetail() {
  selectedIdx = -1;
  document.getElementById('clsGrid').classList.remove('has-detail');
  document.getElementById('clsDetail').classList.remove('visible');
  document.querySelectorAll('.cls-card').forEach(el => {
    el.classList.remove('selected');
    el.style.boxShadow = '';
    el.style.borderColor = '';
  });
}

function switchTab(tab, btn) {
  activeTab = tab;
  document.querySelectorAll('.cls-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.cls-tab-panel').forEach(p => p.classList.remove('active'));
  const target = btn || document.querySelector(`.cls-tab[data-tab="${tab}"]`);
  if (target) target.classList.add('active');
  const panelId = 'tab' + tab.charAt(0).toUpperCase() + tab.slice(1);
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
  if (selectedIdx >= 0) renderTab(tab);
}

/* ── Render tab content ── */
function renderTab(tab) {
  const c = CLASSES[selectedIdx];
  if      (tab === 'lessons')     renderLessonsPane(c);
  else if (tab === 'materials')   renderMaterialsPane(c);
  else if (tab === 'exams')       renderExamsPane(c);
  else if (tab === 'assignments') renderAssignmentsPane(c);
  else if (tab === 'grades')      renderGradesPane(c);
}

/* ── Lessons tab ── */
function renderLessonsPane(c) {
  const done    = c.lessons.filter(l => l.status==='done').length;
  const pending = c.lessons.filter(l => l.status==='pending').length;
  const newL    = c.lessons.filter(l => l.status==='new').length;
  const total   = c.lessons.length;

  document.getElementById('tabLessons').innerHTML = `
    <div class="cls-breakdown-header">
      <span class="cls-breakdown-title">Хичээлийн ахиц</span>
      <span class="cls-breakdown-pct">${done}/${total} дуусгасан</span>
    </div>
    <div class="cls-stacked-bar">
      <div class="cls-sb-done"    style="width:${done/total*100}%"></div>
      <div class="cls-sb-pending" style="width:${pending/total*100}%"></div>
      <div class="cls-sb-new"     style="width:${newL/total*100}%"></div>
    </div>
    <div class="cls-breakdown-legend">
      <div class="cls-bd-item"><div class="cls-bd-dot" style="background:#10b981"></div>Дуусгасан (${done})</div>
      <div class="cls-bd-item"><div class="cls-bd-dot" style="background:#f59e0b"></div>Явагдаж байна (${pending})</div>
      <div class="cls-bd-item"><div class="cls-bd-dot" style="background:#e2e8f0"></div>Удахгүй (${newL})</div>
    </div>
    <div class="cls-lesson-tl">
      ${c.lessons.map((l,i) => `
        <div class="cls-lesson-tl-item">
          <div class="cls-tl-num ${l.status==='done'?'done':l.status==='pending'?'pending':''}">
            ${l.status==='done' ? '<i class="fas fa-check" style="font-size:.7rem"></i>' : i+1}
          </div>
          <div class="cls-tl-body">
            <div class="cls-tl-card ${l.status==='done'?'done':l.status==='pending'?'pending':''}"
              ${l.status!=='new'?`onclick="openLesson(${selectedIdx},${i})" style="cursor:pointer"`:''}
            >
              <div class="cls-tl-card-top">
                <div class="cls-tl-title">${l.title}</div>
                <span class="cls-tl-badge ${l.status}">${l.status==='done'?'Дууссан':l.status==='pending'?'Явагдаж байна':'Удахгүй'}</span>
              </div>
              <div class="cls-tl-meta">
                <div class="cls-tl-meta-item"><i class="fas fa-clock"></i>${l.dur}</div>
                <div class="cls-tl-meta-item"><i class="fas fa-calendar"></i>${l.date}</div>
                ${l.status!=='new'?'<div class="cls-tl-meta-item" style="color:#3b82f6;font-weight:600"><i class="fas fa-play-circle"></i>Нээх</div>':''}
              </div>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

/* ── Materials tab ── */
function renderMaterialsPane(c) {
  const typeIcon = {pdf:'fa-file-pdf', doc:'fa-file-word', img:'fa-file-image', ppt:'fa-file-powerpoint'};
  const pdfCount = c.materials.filter(m=>m.type==='pdf').length;
  const docCount = c.materials.filter(m=>m.type==='doc').length;
  const imgCount = c.materials.filter(m=>m.type==='img').length;

  document.getElementById('tabMaterials').innerHTML = `
    <div class="cls-mat-stats">
      <div class="cls-mat-stat-pill"><i class="fas fa-file-pdf" style="color:#b91c1c"></i>PDF: ${pdfCount}</div>
      <div class="cls-mat-stat-pill"><i class="fas fa-file-word" style="color:#1d4ed8"></i>DOC: ${docCount}</div>
      <div class="cls-mat-stat-pill"><i class="fas fa-file-image" style="color:#065f46"></i>Зураг: ${imgCount}</div>
      <div class="cls-mat-stat-pill" style="margin-left:auto"><i class="fas fa-layer-group"></i>Нийт: ${c.materials.length} файл</div>
    </div>
    <div class="cls-mat-grid">
      ${c.materials.map(m => `
        <div class="cls-mat-card">
          <div class="cls-mat-card-top">
            <div class="cls-mat-icon-box ${m.type}">
              <i class="fas ${typeIcon[m.type]||'fa-file'}"></i>
            </div>
            <div style="flex:1;min-width:0">
              <div class="cls-mat-name">${m.name}</div>
              <div class="cls-mat-meta">${m.type.toUpperCase()} · ${m.size}</div>
            </div>
          </div>
          <div class="cls-mat-card-foot">
            <div>
              <span style="font-size:.68rem;font-weight:600;padding:2px 8px;border-radius:99px;background:#f1f5f9;color:#64748b">${m.cat}</span>
              <span class="cls-mat-date" style="margin-left:7px">${m.date}</span>
            </div>
            <div class="cls-mat-dl"><i class="fas fa-download"></i></div>
          </div>
        </div>`).join('')}
    </div>`;
}

/* ── Exams tab ── */
function renderExamsPane(c) {
  const taken = c.exams.filter(e => e.score !== null);
  const avgPct = taken.length
    ? Math.round(taken.reduce((s,e) => s + e.score/e.total*100, 0) / taken.length)
    : null;
  const best = taken.length ? Math.max(...taken.map(e => Math.round(e.score/e.total*100))) : null;

  document.getElementById('tabExams').innerHTML = `
    <div class="cls-exam-summary">
      <div class="cls-exam-sum-pill">
        <div class="cls-exam-sum-val">${c.exams.length}</div>
        <div class="cls-exam-sum-lbl">Нийт шалгалт</div>
      </div>
      <div class="cls-exam-sum-pill">
        <div class="cls-exam-sum-val">${taken.length}</div>
        <div class="cls-exam-sum-lbl">Өгсөн</div>
      </div>
      <div class="cls-exam-sum-pill">
        <div class="cls-exam-sum-val" style="color:${avgPct?scoreColor(avgPct):'#94a3b8'}">${avgPct !== null ? avgPct+'%' : '—'}</div>
        <div class="cls-exam-sum-lbl">Дундаж</div>
      </div>
      <div class="cls-exam-sum-pill">
        <div class="cls-exam-sum-val" style="color:${best?scoreColor(best):'#94a3b8'}">${best !== null ? best+'%' : '—'}</div>
        <div class="cls-exam-sum-lbl">Хамгийн өндөр</div>
      </div>
    </div>
    ${c.exams.map(e => {
      const has  = e.score !== null;
      const pct  = has ? Math.round(e.score / e.total * 100) : null;
      const col  = has ? scoreColor(pct) : '#94a3b8';
      const ltr  = has ? scoreLetter(pct) : 'up';
      if (has) {
        const avgMark = e.classAvgScore !== null ? Math.round(e.classAvgScore/e.total*100) : null;
        const compare = avgMark !== null
          ? (pct > avgMark ? `<span style="color:#10b981;font-size:.75rem;font-weight:700">▲ ангийн дунджаас +${pct-avgMark}%</span>`
            : pct < avgMark ? `<span style="color:#ef4444;font-size:.75rem;font-weight:700">▼ ангийн дунджаас -${avgMark-pct}%</span>`
            : `<span style="color:#64748b;font-size:.75rem">Ангийн дунджтай тэнцүү</span>`)
          : '';
        return `
          <div class="cls-exam-card">
            <div class="cls-exam-card-head done-head" style="--score-col:${col}">
              <div class="cls-exam-grade-badge ${ltr}">${ltr}</div>
              <div style="flex:1;min-width:0">
                <div class="cls-exam-name">${e.name}</div>
                <div class="cls-exam-date-txt"><i class="fas fa-calendar-alt" style="margin-right:4px;opacity:.6"></i>${e.date}</div>
              </div>
              <div style="text-align:right">
                <div class="cls-exam-score-num" style="--score-col:${col}">${e.score}</div>
                <div class="cls-exam-score-of">/ ${e.total} оноо</div>
              </div>
            </div>
            <div class="cls-exam-card-body">
              <div class="cls-exam-score-row">
                <div class="cls-exam-pct" style="--score-col:${col}">${pct}%</div>
                ${compare}
              </div>
              <div class="cls-exam-bar-wrap">
                <div class="cls-exam-bar-track">
                  <div class="cls-exam-bar-fill" style="width:${pct}%;background:${col}"></div>
                  ${avgMark !== null ? `<div class="cls-exam-avg-marker" style="left:${avgMark}%"></div>` : ''}
                </div>
                <div class="cls-exam-avg-label">
                  <span>0%</span>
                  ${avgMark !== null ? `<span style="color:#475569">Ангийн дундаж: ${avgMark}%</span>` : ''}
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>`;
      } else {
        const today = new Date('2026-04-27');
        const exam  = new Date(e.date);
        const days  = Math.round((exam - today)/(1000*60*60*24));
        return `
          <div class="cls-exam-card">
            <div class="cls-exam-card-head upcoming-head">
              <div class="cls-exam-grade-badge up"><i class="fas fa-clock"></i></div>
              <div style="flex:1;min-width:0">
                <div class="cls-exam-name">${e.name}</div>
                <div class="cls-exam-date-txt"><i class="fas fa-calendar-alt" style="margin-right:4px;opacity:.6"></i>${e.date}</div>
              </div>
            </div>
            <div class="cls-exam-upcoming-body">
              <div class="cls-exam-countdown">
                <i class="fas fa-hourglass-half"></i>
                ${days > 0 ? days + ' хоногийн дараа' : days === 0 ? 'Өнөөдөр!' : 'Өнгөрсөн'}
              </div>
              <span style="font-size:.78rem;color:#64748b">Нийт: ${e.total} оноо</span>
            </div>
          </div>`;
      }
    }).join('')}`;
}

/* ── Grades tab ── */
function renderGradesPane(c) {
  const taken = c.exams.filter(e => e.score !== null);

  if (!taken.length) {
    document.getElementById('tabGrades').innerHTML = `
      <div class="stu-empty" style="padding:52px 20px">
        <div class="stu-empty-icon"><i class="fas fa-chart-line"></i></div>
        <h3>Дүн байхгүй</h3>
        <p>Шалгалт өгсний дараа дүн харагдана</p>
      </div>`;
    return;
  }

  const avgPct = Math.round(taken.reduce((s,e) => s + e.score/e.total*100, 0) / taken.length);
  const best   = Math.max(...taken.map(e => Math.round(e.score/e.total*100)));
  const worst  = Math.min(...taken.map(e => Math.round(e.score/e.total*100)));
  const ltr    = scoreLetter(avgPct);

  const classAvgTaken = taken.filter(e => e.classAvgScore !== null);
  const classAvg = classAvgTaken.length
    ? Math.round(classAvgTaken.reduce((s,e) => s + e.classAvgScore/e.total*100, 0) / classAvgTaken.length)
    : null;

  const ltrMap = {
    A: {bg:'#d1fae5', color:'#065f46'},
    B: {bg:'#dbeafe', color:'#1d4ed8'},
    C: {bg:'#fef3c7', color:'#92400e'},
    D: {bg:'#fee2e2', color:'#b91c1c'},
  };
  const lc = ltrMap[ltr] || ltrMap.B;

  const circ = 2 * Math.PI * 40;
  const dash = circ * avgPct / 100;

  const diff = classAvg !== null ? avgPct - classAvg : null;
  const diffHtml = diff !== null
    ? diff > 0
      ? `<span style="font-size:11px;font-weight:700;color:#10b981">▲ ангийн дунджаас +${diff}%</span>`
      : diff < 0
        ? `<span style="font-size:11px;font-weight:700;color:#ef4444">▼ ангийн дунджаас ${diff}%</span>`
        : `<span style="font-size:11px;color:#94a3b8">Ангийн дунджтай тэнцүү</span>`
    : '';

  document.getElementById('tabGrades').innerHTML = `
    <div class="cls-grade-hero" style="--gcolor:${c.color}">
      <div class="cls-grade-ring-wrap">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="40" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="9"/>
          <circle cx="55" cy="55" r="40" fill="none" stroke="rgba(255,255,255,.88)" stroke-width="9"
            stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}" stroke-linecap="round"
            style="transform:rotate(-90deg);transform-origin:55px 55px"/>
        </svg>
        <div class="cls-grade-ring-center">
          <div class="cls-grade-pct">${avgPct}%</div>
          <div class="cls-grade-lbl">дундаж</div>
        </div>
      </div>
      <div class="cls-grade-info">
        <span class="cls-grade-letter" style="background:${lc.bg};color:${lc.color}">${ltr} зэрэглэл</span>
        <div class="cls-grade-name">${c.name}</div>
        <div class="cls-grade-sub"><i class="fas fa-chalkboard-teacher" style="margin-right:5px;opacity:.7"></i>${c.teacher}</div>
        <div class="cls-grade-kpis">
          <div class="cls-grade-kpi">
            <div class="cls-grade-kpi-val" style="color:${scoreColor(best)}">${best}%</div>
            <div class="cls-grade-kpi-lbl">Хамгийн өндөр</div>
          </div>
          <div class="cls-grade-kpi">
            <div class="cls-grade-kpi-val" style="color:${scoreColor(worst)}">${worst}%</div>
            <div class="cls-grade-kpi-lbl">Хамгийн бага</div>
          </div>
          <div class="cls-grade-kpi">
            <div class="cls-grade-kpi-val">${taken.length}</div>
            <div class="cls-grade-kpi-lbl">Өгсөн шалгалт</div>
          </div>
        </div>
      </div>
    </div>

    ${classAvg !== null ? `
    <div class="cls-grade-section">
      <div class="cls-grade-section-title">Ангийн дунджтай харьцуулалт</div>
      <div style="padding:4px 0 12px">
        <div class="compare-labels">
          <div class="compare-label-name">
            <div style="width:9px;height:9px;border-radius:50%;background:${c.color}"></div>Миний дундаж
          </div>
          <div class="compare-label-pct">${avgPct}% <span style="color:#94a3b8;font-weight:400;font-size:11px">/ анги ${classAvg}%</span></div>
        </div>
        <div class="compare-track">
          <div class="compare-fill-me" style="width:${avgPct}%;background:linear-gradient(90deg,${c.color},${c.color}cc);height:100%;border-radius:99px"></div>
          <div class="compare-fill-avg" style="left:${classAvg}%"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;align-items:center">
          <div class="compare-legend">
            <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${c.color}"></span>Миний дүн</span>
            <span><span style="display:inline-block;width:2px;height:10px;background:#94a3b8;border-radius:1px"></span>Ангийн дундаж</span>
          </div>
          ${diffHtml}
        </div>
      </div>
    </div>` : ''}

    <div class="cls-grade-section">
      <div class="cls-grade-section-title">Шалгалтын дэлгэрэнгүй</div>
      <div style="overflow-x:auto;margin:0 -4px">
        <table class="exam-table">
          <thead>
            <tr>
              <th>Огноо</th>
              <th>Шалгалтын нэр</th>
              <th style="text-align:right">Оноо</th>
              <th style="text-align:right">Ангийн дундаж</th>
            </tr>
          </thead>
          <tbody>
            ${c.exams.map(e => {
              const has = e.score !== null;
              const pct = has ? Math.round(e.score/e.total*100) : null;
              const l   = has ? scoreLetter(pct) : 'np';
              const avg = e.classAvgScore !== null ? Math.round(e.classAvgScore/e.total*100) : null;
              return `<tr>
                <td style="color:#94a3b8;font-size:12px">${e.date}</td>
                <td style="font-weight:600;color:#1e293b">${e.name}</td>
                <td style="text-align:right">
                  ${has
                    ? `<span class="score-chip ${l}">${e.score}/${e.total}</span>`
                    : `<span class="score-chip np"><i class="fas fa-clock"></i> Болоогүй</span>`}
                </td>
                <td style="text-align:right;font-size:12px;color:#64748b">${avg !== null ? avg+'%' : '—'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

/* ── Assignments tab ── */
function renderAssignmentsPane(c) {
  const items = ASSIGNMENTS.filter(a => a.subject === c.subject);

  let filtered = items;
  if (assignmentFilter === 'urgent')  filtered = items.filter(a => a.status !== 'done' && a.daysLeft <= 3);
  else if (assignmentFilter === 'pending') filtered = items.filter(a => a.status !== 'done' && a.daysLeft > 3);
  else if (assignmentFilter === 'done')    filtered = items.filter(a => a.status === 'done');

  const urgentCnt  = items.filter(a => a.status !== 'done' && a.daysLeft <= 3).length;
  const pendingCnt = items.filter(a => a.status !== 'done' && a.daysLeft > 3).length;
  const doneCnt    = items.filter(a => a.status === 'done').length;

  const f = (key, label, cnt) => `
    <button class="cls-asgn-filter ${assignmentFilter===key?'active':''}"
      onclick="setAssignmentFilter('${key}')">
      ${label} <span>${cnt}</span>
    </button>`;

  const filterBar = `<div class="cls-asgn-filters">
    ${f('all', 'Бүгд', items.length)}
    ${f('urgent', '<i class="fas fa-fire"></i> Яаралтай', urgentCnt)}
    ${f('pending', 'Хийгдэж байна', pendingCnt)}
    ${f('done', 'Дуусгасан', doneCnt)}
  </div>`;

  if (!filtered.length) {
    document.getElementById('tabAssignments').innerHTML = filterBar + `
      <div class="stu-empty" style="padding:36px 20px">
        <div class="stu-empty-icon"><i class="fas fa-tasks"></i></div>
        <h3>Даалгавар байхгүй</h3>
        <p>Энэ ангилалд харуулах даалгавар алга</p>
      </div>`;
    return;
  }

  const active   = filtered.filter(a => a.status !== 'done');
  const doneList = filtered.filter(a => a.status === 'done');
  let html = filterBar;
  if (active.length) {
    html += `<div class="asgn-group-label"><i class="fas fa-hourglass-half" style="color:#f59e0b"></i>Хийгдэж буй (${active.length})</div>`;
    html += active.map(renderAssignCard).join('');
  }
  if (doneList.length) {
    html += `<div class="asgn-group-label" style="margin-top:${active.length?'20px':'4px'}"><i class="fas fa-check-circle" style="color:#10b981"></i>Дуусгасан (${doneList.length})</div>`;
    html += doneList.map(renderAssignCard).join('');
  }
  document.getElementById('tabAssignments').innerHTML = html;
}

function setAssignmentFilter(f) {
  assignmentFilter = f;
  if (selectedIdx >= 0) renderAssignmentsPane(CLASSES[selectedIdx]);
}

function renderAssignCard(a) {
  const sub      = SUBJECTS[a.subject] || {color:'#3b82f6', bg:'#dbeafe', icon:'fa-book'};
  const hasFiles = a.teacherFiles && a.teacherFiles.length > 0;
  const submitted= a.status === 'done' && a.submittedAt;
  return `
  <div class="assign-card ${a.status==='done'?'done':''} ${a.status!=='done'&&a.daysLeft<=3?'urgent-glow':''}">
    <div class="assign-card-accent" style="--ac:${sub.color}"></div>
    <div class="assign-card-body">
      <div class="assign-card-top">
        <div class="assign-card-title">${a.title}</div>
        ${getDueBadge(a)}
      </div>
      ${a.desc ? `<div class="assign-card-desc">${a.desc}</div>` : ''}
      ${hasFiles ? `<div class="assign-file-pills">${a.teacherFiles.map(f=>`<span class="assign-file-pill"><i class="fas ${fileIcon(f.type)}"></i>${f.name}</span>`).join('')}</div>` : ''}
      ${submitted ? `<div class="assign-submitted-info"><i class="fas fa-check-circle" style="color:#10b981"></i>Илгээсэн: ${a.submittedAt}${a.studentFile?' · '+a.studentFile.name:''}</div>` : ''}
      <div class="assign-card-footer">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-size:11px;color:#94a3b8"><i class="fas fa-user" style="margin-right:3px"></i>${a.teacher}</span>
          <span style="font-size:11px;color:#94a3b8"><i class="fas fa-calendar-alt" style="margin-right:3px"></i>${a.due}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          ${getStatusPill(a)}
          <button class="av-open-btn" onclick="openAssignmentViewer(${a.id})">
            <i class="fas fa-folder-open"></i>${hasFiles?'Нээх':'Дэлгэрэнгүй'}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── Assignment Viewer Modal ── */
function openAssignmentViewer(id) {
  const a = ASSIGNMENTS.find(x => x.id === id);
  if (!a) return;
  viewerAssignId    = id;
  viewerStudentFile = null;
  const sub = SUBJECTS[a.subject] || {color:'#3b82f6', bg:'#dbeafe', icon:'fa-book'};

  document.getElementById('avTitle').textContent   = a.title;
  document.getElementById('avSubject').textContent = a.subject;
  document.getElementById('avTeacher').textContent = a.teacher;
  document.getElementById('avDue').textContent     = a.due;
  document.getElementById('avSubjectIcon').style.background = sub.bg;
  document.getElementById('avSubjectIcon').style.color      = sub.color;
  document.getElementById('avSubjectIcon').innerHTML = `<i class="fas ${sub.icon}"></i>`;
  document.getElementById('avDesc').textContent = a.desc || '(Тайлбар бичигдээгүй)';

  const fileList = document.getElementById('avTeacherFiles');
  if (a.teacherFiles && a.teacherFiles.length) {
    fileList.innerHTML = a.teacherFiles.map((f, i) =>
      `<div class="av-file-item ${i===0?'active':''}" onclick="selectTeacherFile(${id},${i},this)">
        <div class="av-file-icon ${f.type}"><i class="fas ${fileIcon(f.type)}"></i></div>
        <div class="av-file-info">
          <div class="av-file-name">${f.name}</div>
          <div class="av-file-size">${f.size}</div>
        </div>
        <i class="fas fa-chevron-right av-file-arrow"></i>
      </div>`
    ).join('');
    selectTeacherFile(id, 0, fileList.firstElementChild);
  } else {
    fileList.innerHTML = `<div class="av-no-files"><i class="fas fa-info-circle"></i> Багш файл хавсаргаагүй байна</div>`;
    document.getElementById('avPreviewArea').innerHTML =
      `<div class="av-preview-empty"><i class="fas fa-file-alt"></i><p>Даалгаврын агуулга дэлгэрэнгүй бичигдсэн байна</p></div>`;
  }

  renderSubmitSection(a);
  document.getElementById('assignViewerModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function selectTeacherFile(assignId, fileIdx, el) {
  document.querySelectorAll('.av-file-item').forEach(x => x.classList.remove('active'));
  if (el) el.classList.add('active');
  const a = ASSIGNMENTS.find(x => x.id === assignId);
  const f = a.teacherFiles[fileIdx];
  if (!f) return;
  const prev = document.getElementById('avPreviewArea');
  const isImage = ['jpg','jpeg','png'].includes(f.type);
  if (f._url) {
    if (isImage) {
      prev.innerHTML = `<img src="${f._url}" style="max-width:100%;max-height:460px;object-fit:contain;border-radius:8px">`;
    } else if (f.type === 'pdf') {
      prev.innerHTML = `<iframe src="${f._url}" style="width:100%;height:480px;border:none;border-radius:8px"></iframe>`;
    } else {
      prev.innerHTML = simDocPreview(f);
    }
  } else {
    if (isImage) {
      prev.innerHTML = `<div class="av-sim-image"><i class="fas fa-image"></i><p>${f.name}</p></div>`;
    } else {
      prev.innerHTML = simDocPreview(f);
    }
  }
}

function simDocPreview(f) {
  const lines = (f.content || '').split('\n').map(l => `<div class="sim-line">${l || '&nbsp;'}</div>`).join('');
  return `<div class="av-sim-doc">
    <div class="av-sim-doc-header">
      <i class="fas ${fileIcon(f.type)} av-sim-doc-icon"></i>
      <div>
        <div class="av-sim-doc-name">${f.name}</div>
        <div class="av-sim-doc-meta">${f.size} · ${f.type.toUpperCase()}</div>
      </div>
    </div>
    <div class="av-sim-doc-body">${lines || '<div class="sim-line" style="color:#94a3b8">Агуулга байхгүй байна</div>'}</div>
  </div>`;
}

function renderSubmitSection(a) {
  const wrap = document.getElementById('avSubmitSection');
  if (a.status === 'done') {
    wrap.innerHTML = `
      <div class="av-already-done">
        <i class="fas fa-check-circle"></i>
        <div>
          <div class="av-done-title">Амжилттай илгээгдлээ</div>
          <div class="av-done-meta">${a.submittedAt}${a.studentFile ? ' · ' + a.studentFile.name : ''}</div>
          ${a.studentNotes ? `<div class="av-done-notes">"${a.studentNotes}"</div>` : ''}
        </div>
      </div>`;
    document.getElementById('avSubmitBtn').style.display = 'none';
  } else {
    wrap.innerHTML = `
      <div class="av-submit-field">
        <label class="av-submit-label"><i class="fas fa-edit"></i> Тэмдэглэл / хариу</label>
        <textarea id="avNotes" placeholder="Хариуд тайлбар бичнэ үү..." rows="3"></textarea>
      </div>
      <div class="av-submit-field">
        <label class="av-submit-label"><i class="fas fa-paperclip"></i> Хариу файл хавсаргах</label>
        <div class="av-file-drop" id="avFileDrop"
             onclick="document.getElementById('avFileInput').click()"
             ondragover="event.preventDefault();this.classList.add('drag-over')"
             ondragleave="this.classList.remove('drag-over')"
             ondrop="handleStudentFileDrop(event)">
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Файл чирэх эсвэл <span>сонгох</span></p>
          <small>PDF, DOC, JPG, PNG</small>
          <input type="file" id="avFileInput" style="display:none"
                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onchange="handleStudentFile(this)">
        </div>
        <div id="avSelectedFile"></div>
      </div>`;
    document.getElementById('avSubmitBtn').style.display = '';
  }
}

function handleStudentFile(input) {
  const f = input.files[0];
  if (!f) return;
  viewerStudentFile = f;
  const size = f.size > 1048576 ? (f.size/1048576).toFixed(1)+' MB' : Math.round(f.size/1024)+' KB';
  document.getElementById('avSelectedFile').innerHTML = `
    <div class="av-sel-file">
      <i class="fas ${fileIcon(f.name.split('.').pop().toLowerCase())}"></i>
      <span>${f.name}</span><small>${size}</small>
      <button onclick="clearStudentFile()"><i class="fas fa-times"></i></button>
    </div>`;
}

function handleStudentFileDrop(e) {
  e.preventDefault();
  document.getElementById('avFileDrop').classList.remove('drag-over');
  const f = e.dataTransfer.files[0];
  if (!f) return;
  viewerStudentFile = f;
  const size = f.size > 1048576 ? (f.size/1048576).toFixed(1)+' MB' : Math.round(f.size/1024)+' KB';
  document.getElementById('avSelectedFile').innerHTML = `
    <div class="av-sel-file">
      <i class="fas ${fileIcon(f.name.split('.').pop().toLowerCase())}"></i>
      <span>${f.name}</span><small>${size}</small>
      <button onclick="clearStudentFile()"><i class="fas fa-times"></i></button>
    </div>`;
}

function clearStudentFile() {
  viewerStudentFile = null;
  document.getElementById('avSelectedFile').innerHTML = '';
  document.getElementById('avFileInput').value = '';
}

function submitAssignment() {
  if (!viewerAssignId) return;
  const a = ASSIGNMENTS.find(x => x.id === viewerAssignId);
  if (!a || a.status === 'done') return;
  const notes = document.getElementById('avNotes') ? document.getElementById('avNotes').value.trim() : '';
  const now   = new Date().toLocaleTimeString('mn-MN', {hour:'2-digit', minute:'2-digit'});
  a.status       = 'done';
  a.submittedAt  = `2026/04/27 ${now}`;
  a.studentFile  = viewerStudentFile
    ? {name: viewerStudentFile.name, size: Math.round(viewerStudentFile.size/1024)+' KB', type: viewerStudentFile.name.split('.').pop()}
    : null;
  a.studentNotes = notes;
  const btn = document.getElementById('avSubmitBtn');
  btn.innerHTML = '<i class="fas fa-check"></i> Илгэгдлээ!';
  btn.style.background = '#10b981';
  btn.disabled = true;
  setTimeout(() => {
    closeAssignmentViewer();
    buildSummary();
    buildCards();
    if (selectedIdx >= 0) {
      selectClass(selectedIdx);
      renderAssignmentsPane(CLASSES[selectedIdx]);
    }
  }, 1200);
}

function closeAssignmentViewer() {
  document.getElementById('assignViewerModal').classList.remove('show');
  document.body.style.overflow = '';
  viewerAssignId = null;
  viewerStudentFile = null;
  const btn = document.getElementById('avSubmitBtn');
  if (btn) { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Илгээх'; btn.style.background = ''; btn.disabled = false; }
}

/* ── Lesson Viewer Modal ── */
function openLesson(classIdx, lessonIdx) {
  const c = CLASSES[classIdx];
  const l = c.lessons[lessonIdx];
  const tag   = document.getElementById('lsnStatusTag');
  const title = document.getElementById('lsnModalTitle');
  const meta  = document.getElementById('lsnModalMeta');
  const body  = document.getElementById('lsnModalBody');

  tag.textContent = l.status === 'done' ? '✓ Дууссан' : '▶ Явагдаж байна';
  tag.className   = 'lsn-status-tag ' + (l.status === 'done' ? 'done' : 'pending');
  title.textContent = l.title;
  meta.innerHTML  = `
    <span><i class="fas fa-clock"></i>${l.dur}</span>
    <span><i class="fas fa-calendar"></i>${l.date}</span>
    <span><i class="fas fa-book"></i>${c.subject}</span>`;

  const doneRibbon = l.status === 'done'
    ? `<div class="lsn-done-ribbon"><i class="fas fa-check-circle"></i>Дууссан</div>` : '';

  body.innerHTML = `
    <div class="lsn-video-box">
      ${doneRibbon}
      <div class="lsn-play-btn"><i class="fas fa-play"></i></div>
      <div class="lsn-video-label">Хичээлийн бичлэг</div>
    </div>
    <div class="lsn-info-grid">
      <div class="lsn-info-card">
        <div class="lsn-info-card-lbl">Үргэлжлэх хугацаа</div>
        <div class="lsn-info-card-val"><i class="fas fa-clock" style="color:#3b82f6;margin-right:6px"></i>${l.dur}</div>
      </div>
      <div class="lsn-info-card">
        <div class="lsn-info-card-lbl">Огноо</div>
        <div class="lsn-info-card-val"><i class="fas fa-calendar" style="color:#8b5cf6;margin-right:6px"></i>${l.date}</div>
      </div>
      <div class="lsn-info-card">
        <div class="lsn-info-card-lbl">Хичээл</div>
        <div class="lsn-info-card-val"><i class="fas fa-book-open" style="color:#10b981;margin-right:6px"></i>${c.subject}</div>
      </div>
      <div class="lsn-info-card">
        <div class="lsn-info-card-lbl">Багш</div>
        <div class="lsn-info-card-val"><i class="fas fa-chalkboard-teacher" style="color:#f59e0b;margin-right:6px"></i>${c.teacher.split(' ')[0]}</div>
      </div>
    </div>
    ${l.status === 'done'
      ? `<div class="lsn-completed-note"><i class="fas fa-check-circle"></i>Та энэ хичээлийг амжилттай дүүргэсэн байна.</div>`
      : `<button class="lsn-complete-btn" onclick="markLessonDone(${classIdx},${lessonIdx})">
           <i class="fas fa-check"></i>Дуусгасан тэмдэглэх
         </button>`
    }`;

  document.getElementById('lsnOverlay').classList.add('open');
}

function closeLsnModal() {
  document.getElementById('lsnOverlay').classList.remove('open');
}

function markLessonDone(classIdx, lessonIdx) {
  CLASSES[classIdx].lessons[lessonIdx].status = 'done';
  closeLsnModal();
  buildSummary();
  buildCards();
  if (selectedIdx === classIdx) selectClass(classIdx);
}

/* ── Init ── */
buildSummary();
buildCards();
