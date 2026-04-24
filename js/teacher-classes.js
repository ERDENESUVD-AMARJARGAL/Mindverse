const CLASSES = [
  {
    name:'10А анги', subject:'Алгебр', icon:'fa-calculator', color:'#3b82f6',
    students:24, avg:'84%', avgClass:'good', avgNum:84,
    lessons:[
      {title:'Квадрат тэгшитгэл',                   meta:'45 мин · 2026/04/10', badge:'done'},
      {title:'Тэгшитгэлийн систем',                 meta:'50 мин · 2026/04/14', badge:'done'},
      {title:'Үл мэдэгдэгчтэй тэгш бус байдал',    meta:'45 мин · 2026/04/18', badge:'done'},
      {title:'Функцийн утга',                        meta:'40 мин · 2026/04/22', badge:'upcoming'},
      {title:'Параболын график',                     meta:'50 мин · 2026/04/28', badge:'upcoming'},
      {title:'Дундын шалгалтын давтлага',            meta:'60 мин · 2026/05/02', badge:'draft'},
      {title:'Экспоненциал функц',                   meta:'45 мин · 2026/05/06', badge:'draft'},
      {title:'Логарифм',                             meta:'45 мин · 2026/05/10', badge:'draft'},
    ],
    exams:[
      {title:'Алгебрийн дундын шалгалт', meta:'2026/04/22 · 20 асуулт · 45 мин', status:'upcoming', result:null},
      {title:'Тэгшитгэлийн тест',        meta:'2026/04/07 · 15 асуулт · 30 мин · Дундаж: 82%', status:'done', result:'82%', resultNum:82},
      {title:'Эхний улирлын шалгалт',    meta:'2026/03/15 · 30 асуулт · 60 мин · Дундаж: 78%', status:'done', result:'78%', resultNum:78},
    ],
    assignments:[
      {title:'Квадрат тэгшитгэл – ГД',      meta:'Дуусах: 2026/04/22', status:'active', submitted:18, total:24},
      {title:'Функцийн утга – ГД',           meta:'Дуусах: 2026/04/25', status:'active', submitted:10, total:24},
      {title:'Тэгшитгэлийн систем – ГД',    meta:'Дуусах: 2026/04/14', status:'done',   submitted:24, total:24},
      {title:'Тэгш бус байдал – практик',   meta:'Дуусах: 2026/04/18', status:'done',   submitted:22, total:24},
      {title:'Экспоненциал дасгал',          meta:'Дуусах: 2026/03/28', status:'late',   submitted:12, total:24},
    ],
    studentList:[
      {name:'Болд Бат',       av:'Б', color:'#dbeafe', tc:'#1d4ed8', score:92},
      {name:'Сарнай Гантулга',av:'С', color:'#ede9fe', tc:'#5b21b6', score:87},
      {name:'Анхбаяр',        av:'А', color:'#d1fae5', tc:'#065f46', score:81},
      {name:'Мөнхбаяр',       av:'М', color:'#fef3c7', tc:'#92400e', score:74},
      {name:'Цэцэгмаа',       av:'Ц', color:'#fee2e2', tc:'#991b1b', score:63},
    ],
  },
  {
    name:'9Б анги', subject:'Геометр', icon:'fa-shapes', color:'#10b981',
    students:18, avg:'71%', avgClass:'mid', avgNum:71,
    lessons:[
      {title:'Теорем нотлох',          meta:'45 мин · 2026/04/08', badge:'done'},
      {title:'Гурвалжны өнцгүүд',     meta:'40 мин · 2026/04/12', badge:'done'},
      {title:'Пифагорын теорем',       meta:'50 мин · 2026/04/17', badge:'done'},
      {title:'Тойргийн шинж чанар',   meta:'45 мин · 2026/04/23', badge:'upcoming'},
      {title:'Хавтгай дүрсийн талбай',meta:'50 мин · 2026/04/29', badge:'upcoming'},
      {title:'Биетийн эзэлхүүн',      meta:'45 мин · 2026/05/05', badge:'draft'},
    ],
    exams:[
      {title:'Геометрийн шалгалт',    meta:'2026/04/25 · 15 асуулт · 30 мин', status:'upcoming', result:null},
      {title:'Теорем нотлолтын тест', meta:'2026/04/05 · 10 асуулт · 20 мин · Дундаж: 68%', status:'done', result:'68%', resultNum:68},
    ],
    assignments:[
      {title:'Теорем нотлох – ГД',   meta:'Дуусах: 2026/04/24', status:'active', submitted:14, total:18},
      {title:'Гурвалжны дасгал',     meta:'Дуусах: 2026/04/18', status:'done',   submitted:18, total:18},
      {title:'Тойргийн бодлого',     meta:'Дуусах: 2026/04/12', status:'late',   submitted:9,  total:18},
      {title:'Пифагор – гэрийн ажил',meta:'Дуусах: 2026/04/17', status:'done',   submitted:17, total:18},
    ],
    studentList:[
      {name:'Номин Цэцэг', av:'Н', color:'#d1fae5', tc:'#065f46', score:88},
      {name:'Баярмаа',     av:'Б', color:'#dbeafe', tc:'#1d4ed8', score:77},
      {name:'Сувд',        av:'С', color:'#ede9fe', tc:'#5b21b6', score:72},
      {name:'Ундрал',      av:'У', color:'#fef3c7', tc:'#92400e', score:65},
    ],
  },
  {
    name:'11А анги', subject:'Тригонометр', icon:'fa-wave-square', color:'#f59e0b',
    students:22, avg:'79%', avgClass:'good', avgNum:79,
    lessons:[
      {title:'Синус, косинус тодорхойлолт',meta:'45 мин · 2026/04/05', badge:'done'},
      {title:'Тригонометрийн нэгдэл',      meta:'50 мин · 2026/04/11', badge:'done'},
      {title:'Давхардлын томъёо',           meta:'45 мин · 2026/04/16', badge:'done'},
      {title:'Тригонометрийн тэгшитгэл',   meta:'50 мин · 2026/04/22', badge:'upcoming'},
      {title:'График байгуулах',            meta:'55 мин · 2026/04/28', badge:'draft'},
    ],
    exams:[
      {title:'Тригонометрийн тест',      meta:'2026/04/16 · 15 асуулт · 30 мин · Дундаж: 74%', status:'done', result:'74%', resultNum:74},
      {title:'Улирлын эцсийн шалгалт',   meta:'2026/05/20 · 30 асуулт · 60 мин', status:'draft', result:null},
    ],
    assignments:[
      {title:'Тригонометрийн нэгдэл',    meta:'Дуусах: 2026/04/18', status:'done',   submitted:21, total:22},
      {title:'Давхардлын томъёо – ГД',   meta:'Дуусах: 2026/04/23', status:'active', submitted:16, total:22},
      {title:'График байгуулах',          meta:'Дуусах: 2026/04/29', status:'active', submitted:4,  total:22},
    ],
    studentList:[
      {name:'Гэрэлмаа',   av:'Г', color:'#d1fae5', tc:'#065f46', score:85},
      {name:'Нарантуяа',  av:'Н', color:'#dbeafe', tc:'#1d4ed8', score:79},
      {name:'Энхбаяр',    av:'Э', color:'#fef3c7', tc:'#92400e', score:76},
      {name:'Дулгуун',    av:'Д', color:'#fee2e2', tc:'#991b1b', score:61},
    ],
  },
  {
    name:'8В анги', subject:'Арифметик', icon:'fa-hashtag', color:'#8b5cf6',
    students:20, avg:'62%', avgClass:'low', avgNum:62,
    lessons:[
      {title:'Натурал тооны шинж', meta:'40 мин · 2026/04/09', badge:'done'},
      {title:'Хуваагдах чанар',    meta:'40 мин · 2026/04/15', badge:'done'},
      {title:'Нийтлэг хуваагч',   meta:'45 мин · 2026/04/22', badge:'upcoming'},
      {title:'Нийтлэг үржвэр',    meta:'45 мин · 2026/04/28', badge:'draft'},
    ],
    exams:[
      {title:'Арифметикийн тест', meta:'2026/04/10 · 12 асуулт · 25 мин · Дундаж: 59%', status:'done', result:'59%', resultNum:59},
    ],
    assignments:[
      {title:'Натурал тооны шинж чанар', meta:'Дуусах: 2026/04/15', status:'done',   submitted:19, total:20},
      {title:'Хуваагдах чанар – дасгал', meta:'Дуусах: 2026/04/22', status:'active', submitted:8,  total:20},
    ],
    studentList:[
      {name:'Алтантуяа', av:'А', color:'#d1fae5', tc:'#065f46', score:73},
      {name:'Оюунчимэг', av:'О', color:'#ede9fe', tc:'#5b21b6', score:68},
      {name:'Мөнхзул',   av:'М', color:'#dbeafe', tc:'#1d4ed8', score:65},
      {name:'Төгөлдөр',  av:'Т', color:'#fee2e2', tc:'#991b1b', score:54},
    ],
  },
];

let selectedClass = -1;
const badgeLabel = {done:'Дууссан', upcoming:'Удахгүй', draft:'Ноорог'};
const badgeCols   = {done:'#10b981', upcoming:'#3b82f6', draft:'#94a3b8'};
const assignLabels= {active:'Идэвхтэй', done:'Дууссан', late:'Хоцорсон'};
const examIcons   = {upcoming:'fa-clock', done:'fa-check-circle', draft:'fa-edit'};

let classSearchQuery = '';

function filterClasses(q) {
  classSearchQuery = q.trim().toLowerCase();
  const clearBtn = document.getElementById('searchClearBtn');
  const badge    = document.getElementById('searchBadge');
  if (clearBtn) clearBtn.style.display = classSearchQuery ? 'flex' : 'none';
  buildCards();
  const visible = document.querySelectorAll('.class-card:not([style*="display: none"])').length;
  if (badge) {
    badge.style.display = classSearchQuery ? '' : 'none';
    badge.textContent   = visible + ' анги олдлоо';
  }
  const noRes = document.getElementById('classNoResults');
  if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';
}

function clearClassSearch() {
  const inp = document.getElementById('classSearch');
  if (inp) inp.value = '';
  filterClasses('');
}

function buildCards() {
  const grid  = document.getElementById('classGrid');
  const noRes = document.getElementById('classNoResults');

  const filtered = classSearchQuery
    ? CLASSES.filter(c => (c.name + c.subject).toLowerCase().includes(classSearchQuery))
    : CLASSES;

  const html = filtered.map(c => {
    const realIdx      = CLASSES.indexOf(c);
    const doneLessons  = c.lessons.filter(l => l.badge === 'done').length;
    const upLessons    = c.lessons.filter(l => l.badge === 'upcoming').length;
    const draftLessons = c.lessons.filter(l => l.badge === 'draft').length;
    const total   = c.lessons.length || 1;
    const donePct = Math.round(doneLessons / total * 100);
    return `
    <div class="class-card" id="card${realIdx}" onclick="selectClass(${realIdx})">
      <div class="class-card-top" style="background:${c.color}"></div>
      <div class="class-card-body">
        <div class="cc-subject-row">
          <div class="cc-subject-icon" style="background:color-mix(in srgb,${c.color} 13%,#fff);color:${c.color}">
            <i class="fas ${c.icon}"></i>
          </div>
          <div class="cc-subject-text">
            <div class="cc-class-name">${c.name}</div>
            <div class="cc-subject-name">${c.subject}</div>
          </div>
        </div>
        <div class="class-card-stats">
          <div class="cc-stat"><strong>${c.students}</strong><span>Сурагч</span></div>
          <div class="cc-stat"><strong>${c.lessons.length}</strong><span>Хичээл</span></div>
          <div class="cc-stat"><strong>${c.exams.length}</strong><span>Шалгалт</span></div>
          <div class="cc-stat"><strong>${c.assignments.length}</strong><span>Даалгавар</span></div>
        </div>
        <div class="cc-progress">
          <div class="cc-progress-header">
            <span>Хөтөлбөрийн ахиц</span><span>${donePct}%</span>
          </div>
          <div class="cc-progress-track">
            <div class="cc-progress-fill" style="width:${donePct}%;background:${c.color}"></div>
          </div>
          <div class="cc-progress-segs">
            <span class="cc-seg"><span class="cc-seg-dot" style="background:${c.color}"></span>${doneLessons} дууссан</span>
            <span class="cc-seg"><span class="cc-seg-dot" style="background:#93c5fd"></span>${upLessons} удахгүй</span>
            <span class="cc-seg"><span class="cc-seg-dot" style="background:#e2e8f0"></span>${draftLessons} ноорог</span>
          </div>
        </div>
      </div>
      <div class="class-card-footer">
        <span class="cc-avg ${c.avgClass}"><i class="fas fa-chart-bar" style="margin-right:4px"></i>Дундаж: ${c.avg}</span>
        <i class="fas fa-chevron-down cc-arrow"></i>
      </div>
    </div>`;
  }).join('');

  // Replace existing cards (keep #classNoResults in DOM)
  grid.querySelectorAll('.class-card').forEach(el => el.remove());
  grid.insertAdjacentHTML('afterbegin', html);
  if (noRes) noRes.style.display = filtered.length === 0 ? 'block' : 'none';
}

function selectClass(idx) {
  if (selectedClass === idx) { clearSelection(); return; }
  selectedClass = idx;
  const c = CLASSES[idx];

  document.querySelectorAll('.class-card').forEach((card, i) => {
    card.classList.remove('selected');
    card.style.boxShadow = ''; card.style.borderColor = '';
    if (i === idx) {
      card.classList.add('selected');
      card.style.borderColor = c.color;
      card.style.boxShadow = `0 8px 0 ${c.color}22, 0 14px 38px ${c.color}55`;
    }
  });

  renderDetail(idx);
  document.getElementById('classDetail').classList.add('visible');
  document.getElementById('classDetail').scrollIntoView({ behavior:'smooth', block:'nearest' });
  switchTab('lessons', document.querySelectorAll('.cd-tab')[0]);
}

function clearSelection() {
  document.querySelectorAll('.class-card').forEach(c => {
    c.classList.remove('selected'); c.style.boxShadow = ''; c.style.borderColor = '';
  });
  document.getElementById('classDetail').classList.remove('visible');
  selectedClass = -1;
}

function renderDetail(idx) {
  const c = CLASSES[idx];
  const det = document.getElementById('classDetail');
  det.style.setProperty('--dc', c.color);

  document.getElementById('cdIcon').innerHTML = `<i class="fas ${c.icon}"></i>`;
  document.getElementById('cdIcon').style.background = `color-mix(in srgb,${c.color} 14%,#fff)`;
  document.getElementById('cdIcon').style.color = c.color;
  document.getElementById('cdTitle').textContent = c.name + ' – ' + c.subject;
  document.getElementById('cdStudents').textContent = c.students;
  document.getElementById('cdLessons').textContent = c.lessons.length;
  document.getElementById('cdAvg').textContent = c.avg;
  document.getElementById('tcLessons').textContent = c.lessons.length;
  document.getElementById('tcExams').textContent = c.exams.length;
  document.getElementById('tcAssign').textContent = c.assignments.length;
  document.getElementById('tcStudents').textContent = c.students;

  const done = c.lessons.filter(l=>l.badge==='done').length;
  const pct  = Math.round(done/c.lessons.length*100)||0;
  const activeAssign = c.assignments.filter(a=>a.status==='active').length;
  document.getElementById('cdKpis').innerHTML = `
    <div class="cd-kpi"><div class="cd-kpi-val">${pct}%</div><div class="cd-kpi-lbl">Хөтөлбөр</div></div>
    <div class="cd-kpi"><div class="cd-kpi-val">${done}/${c.lessons.length}</div><div class="cd-kpi-lbl">Хичээл дууссан</div></div>
    <div class="cd-kpi"><div class="cd-kpi-val">${activeAssign}</div><div class="cd-kpi-lbl">Идэвхтэй даалгавар</div></div>
    <div class="cd-kpi" style="border-color:${c.avgNum>=75?'#bbf7d0':c.avgNum>=60?'#fde68a':'#fecaca'}">
      <div class="cd-kpi-val">${c.avg}</div><div class="cd-kpi-lbl">Ангийн дундаж</div>
    </div>`;

  renderLessonsPane(idx);
  renderExamsPane(idx);
  renderAssignmentsPane(idx);
  renderStudentsPane(idx);
}

function renderLessonsPane(idx) {
  const c = CLASSES[idx];
  const doneLessons = c.lessons.filter(l=>l.badge==='done').length;
  const upLessons   = c.lessons.filter(l=>l.badge==='upcoming').length;
  const drLessons   = c.lessons.filter(l=>l.badge==='draft').length;
  const total = c.lessons.length || 1;
  const donePct= Math.round(doneLessons/total*100);
  const upPct  = Math.round(upLessons/total*100);
  const drPct  = 100 - donePct - upPct;

  document.getElementById('pane-lessons').innerHTML = `
    <div class="cd-pane-head">
      <div><h4>Хичээлүүд</h4><p>Хөтөлбөрийн хэрэгжилт ба хичээл бүрийн статус</p></div>
      <button class="t-btn-sm" onclick="openModal('lessonModal')"><i class="fas fa-plus"></i> Нэмэх</button>
    </div>
    <div class="cd-lesson-ov">
      <div class="cd-ov-seg"><div class="cd-ov-val" style="color:#10b981">${doneLessons}</div><div class="cd-ov-lbl">Дууссан</div></div>
      <div class="cd-ov-seg"><div class="cd-ov-val" style="color:#3b82f6">${upLessons}</div><div class="cd-ov-lbl">Удахгүй</div></div>
      <div class="cd-ov-seg"><div class="cd-ov-val" style="color:#94a3b8">${drLessons}</div><div class="cd-ov-lbl">Ноорог</div></div>
      <div class="cd-ov-seg"><div class="cd-ov-val">${total}</div><div class="cd-ov-lbl">Нийт</div></div>
      <div class="cd-ov-bar-wrap" style="flex:2;align-self:center">
        <div style="font-size:10.5px;color:#64748b;margin-bottom:5px">Ахиц — ${donePct}%</div>
        <div class="cd-ov-stacked">
          <div class="cd-ov-stacked-seg" style="width:${donePct}%;background:#10b981"></div>
          <div class="cd-ov-stacked-seg" style="width:${upPct}%;background:#93c5fd"></div>
          <div class="cd-ov-stacked-seg" style="width:${drPct}%;background:#e2e8f0"></div>
        </div>
      </div>
    </div>
    <div class="lesson-list">${c.lessons.length ? c.lessons.map((l,i) => `
      <div class="lesson-item">
        <div class="lesson-num ${l.badge==='done'?'done-num':''}">${i+1}</div>
        <div class="lesson-info">
          <div class="lesson-title">${l.title}</div>
          <div class="lesson-meta"><i class="fas fa-clock" style="margin-right:4px;color:${CLASSES[idx].color}"></i>${l.meta}</div>
        </div>
        <span class="lesson-badge ${l.badge}">${badgeLabel[l.badge]}</span>
        <div style="display:flex;gap:5px">
          <button class="t-btn-icon" title="Засах"><i class="fas fa-edit"></i></button>
          <button class="t-btn-icon red" title="Устгах" onclick="deleteLesson(${idx},${i})"><i class="fas fa-trash"></i></button>
        </div>
      </div>`).join('') : '<div class="empty-state"><i class="fas fa-book-open"></i><p>Хичээл байхгүй байна</p></div>'}</div>`;
}

function renderExamsPane(idx) {
  const c = CLASSES[idx];
  document.getElementById('pane-exams').innerHTML = `
    <div class="cd-pane-head">
      <div><h4>Шалгалтууд</h4><p>Ангийн шалгалтын жагсаалт ба үр дүн</p></div>
      <button class="t-btn-sm" onclick="openModal('examModal')"><i class="fas fa-plus"></i> Нэмэх</button>
    </div>
    <div class="detail-exam-list">${c.exams.length ? c.exams.map((e,i) => `
      <div class="detail-exam-item">
        <div class="exam-icon ${e.status}"><i class="fas ${examIcons[e.status]}"></i></div>
        <div class="detail-exam-info">
          <div class="detail-exam-title">${e.title}</div>
          <div class="detail-exam-meta">${e.meta}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          ${e.result ? `<div class="exam-score-bar">
            <div style="font-size:15px;font-weight:800;color:var(--dc,#07437d);text-align:right">${e.result}</div>
            <div class="esb-track"><div class="esb-fill" style="width:${e.resultNum||0}%"></div></div>
          </div>` : `<span class="assign-badge ${e.status==='upcoming'?'active':'done'}">${e.status==='upcoming'?'Удахгүй':'Ноорог'}</span>`}
          ${e.scheduled ? `<span class="exam-scheduled-badge"><i class="fas fa-clock"></i>Хуваарьт</span>` : ''}
          ${e.files && e.files.length ? `<span class="assign-file-badge"><i class="fas fa-paperclip"></i>${e.files.length} файл</span>` : ''}
        </div>
        <div style="display:flex;gap:5px">
          <button class="t-btn-icon" title="Засах"><i class="fas fa-edit"></i></button>
          <button class="t-btn-icon red" title="Устгах" onclick="deleteExam(${idx},${i})"><i class="fas fa-trash"></i></button>
        </div>
      </div>`).join('') : '<div class="empty-state"><i class="fas fa-pen-square"></i><p>Шалгалт байхгүй байна</p></div>'}</div>`;
}

function renderAssignmentsPane(idx) {
  const c = CLASSES[idx];
  document.getElementById('pane-assignments').innerHTML = `
    <div class="cd-pane-head">
      <div><h4>Даалгаварууд</h4><p>Илгээлтийн явц ба статус</p></div>
      <button class="t-btn-sm" onclick="openModal('assignModal')"><i class="fas fa-plus"></i> Нэмэх</button>
    </div>
    <div class="detail-assign-list">${c.assignments.length ? c.assignments.map((a,i) => {
    const pct = Math.round(a.submitted/a.total*100);
    return `<div class="detail-assign-item">
      <div class="assign-icon ${a.status}"><i class="fas ${a.status==='active'?'fa-spinner':a.status==='done'?'fa-check':'fa-exclamation'}"></i></div>
      <div class="detail-assign-info">
        <div class="detail-assign-title">${a.title}</div>
        <div class="detail-assign-meta">${a.meta}</div>
      </div>
      <div class="assign-submit-stat">
        <div class="submit-bar-label">${a.submitted}/${a.total} илгээсэн</div>
        <div class="submit-bar-track"><div class="submit-bar-fill" style="width:${pct}%"></div></div>
        <div class="submit-pct">${pct}%</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <span class="assign-badge ${a.status}">${assignLabels[a.status]}</span>
        ${a.files && a.files.length ? `<span class="assign-file-badge"><i class="fas fa-paperclip"></i>${a.files.length} файл</span>` : ''}
      </div>
      <button class="t-btn-icon red" title="Устгах" onclick="deleteAssign(${idx},${i})"><i class="fas fa-trash"></i></button>
    </div>`;
  }).join('') : '<div class="empty-state"><i class="fas fa-tasks"></i><p>Даалгавар байхгүй байна</p></div>'}</div>`;
}

function renderStudentsPane(idx) {
  const c = CLASSES[idx];
  const sorted = [...c.studentList].sort((a,b) => b.score - a.score);
  const rankIcon = i => i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
  const rankClass = i => i===0?'gold':i===1?'silver':i===2?'bronze':'';
  const scoreColor = s => s>=80?'#065f46':s>=65?'#92400e':'#991b1b';
  const fillColor  = s => s>=80?'#10b981':s>=65?'#f59e0b':'#ef4444';
  const scClass    = s => s>=80?'high':s>=65?'mid':'low';

  document.getElementById('pane-students').innerHTML = `
    <div class="cd-pane-head">
      <div><h4>Сурагчид</h4><p>${c.students} сурагч · Дундаж оноогоор эрэмблэсэн</p></div>
    </div>
    <div class="student-table-header">
      <div class="stu-search">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Нэрээр хайх..." oninput="filterStudents(${idx},this.value)">
      </div>
      <span style="font-size:12px;color:#64748b;margin-left:4px">${sorted.length} сурагч</span>
    </div>
    <div class="student-grid" id="stuGrid${idx}">
      ${sorted.map((s,i) => `
        <div class="student-card">
          <div class="student-rank ${rankClass(i)}">${rankIcon(i)||i+1}</div>
          <div class="student-av" style="background:${s.color};color:${s.tc}">${s.av}</div>
          <div class="student-info">
            <div class="student-name">${s.name}</div>
            <div class="student-score-row">
              <div class="student-score-bar">
                <div class="student-score-fill" style="width:${s.score}%;background:${fillColor(s.score)}"></div>
              </div>
              <div class="student-score-pct ${scClass(s.score)}" style="color:${scoreColor(s.score)}">${s.score}%</div>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

function filterStudents(idx, q) {
  const c      = CLASSES[idx];
  const sorted = [...c.studentList].sort((a,b)=>b.score-a.score);
  const scoreColor  = s => s>=80?'#065f46':s>=65?'#92400e':'#991b1b';
  const fillColor   = s => s>=80?'#10b981':s>=65?'#f59e0b':'#ef4444';
  const rankClass   = i => i===0?'gold':i===1?'silver':i===2?'bronze':'';
  const rankIcon    = i => i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
  const scClass     = s => s>=80?'high':s>=65?'mid':'low';
  const filtered    = sorted.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
  document.getElementById(`stuGrid${idx}`).innerHTML = filtered.map((s,i) => `
    <div class="student-card">
      <div class="student-rank ${rankClass(i)}">${rankIcon(i)||i+1}</div>
      <div class="student-av" style="background:${s.color};color:${s.tc}">${s.av}</div>
      <div class="student-info">
        <div class="student-name">${s.name}</div>
        <div class="student-score-row">
          <div class="student-score-bar">
            <div class="student-score-fill" style="width:${s.score}%;background:${fillColor(s.score)}"></div>
          </div>
          <div class="student-score-pct ${scClass(s.score)}" style="color:${scoreColor(s.score)}">${s.score}%</div>
        </div>
      </div>
    </div>`).join('');
}

function switchTab(tab, btn) {
  document.querySelectorAll('.cd-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cd-pane').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('pane-' + tab).classList.add('active');
}

function deleteLesson(ci,li){ CLASSES[ci].lessons.splice(li,1); renderLessonsPane(ci); document.getElementById('tcLessons').textContent=CLASSES[ci].lessons.length; }
function deleteExam(ci,ei)  { CLASSES[ci].exams.splice(ei,1);   renderExamsPane(ci);   document.getElementById('tcExams').textContent=CLASSES[ci].exams.length; }
function deleteAssign(ci,ai){ CLASSES[ci].assignments.splice(ai,1); renderAssignmentsPane(ci); document.getElementById('tcAssign').textContent=CLASSES[ci].assignments.length; }

function openModal(id)  { document.getElementById(id).classList.add('show');    document.body.style.overflow='hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('show'); document.body.style.overflow=''; }

function addLesson() {
  if (selectedClass<0) { closeModal('lessonModal'); return; }
  const title=document.getElementById('lsnTitle').value.trim();
  const dur  =document.getElementById('lsnDuration').value;
  const date =document.getElementById('lsnDate').value;
  if (!title) return;
  CLASSES[selectedClass].lessons.push({title, meta:(dur?dur+' мин':'')+(date?' · '+date:''), badge:'upcoming'});
  renderDetail(selectedClass);
  ['lsnTitle','lsnDuration','lsnDate','lsnDesc','lsnUrl'].forEach(id=>document.getElementById(id).value='');
  closeModal('lessonModal');
  switchTab('lessons', document.querySelectorAll('.cd-tab')[0]);
}

/* ── Schedule mode ── */
let examScheduleMode = 'now';
function setScheduleMode(mode) {
  examScheduleMode = mode;
  document.getElementById('smodeNow').classList.toggle('active', mode === 'now');
  document.getElementById('smodeScheduled').classList.toggle('active', mode === 'scheduled');
  document.getElementById('exmScheduleFields').style.display = mode === 'scheduled' ? '' : 'none';
}

function updateSchedulePreview() {
  const openAt = document.getElementById('exmOpenAt').value;
  const closeAt= document.getElementById('exmCloseAt').value;
  const prev   = document.getElementById('schedulePreview');
  const txt    = document.getElementById('schedulePreviewText');
  if (openAt) {
    const fmt = dt => new Date(dt).toLocaleString('mn-MN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    prev.style.display = '';
    txt.textContent = `Нээгдэх: ${fmt(openAt)}${closeAt ? '  →  Хаагдах: ' + fmt(closeAt) : ''}`;
  } else {
    prev.style.display = 'none';
  }
}

/* ── File handling ── */
const attachedFiles = { asnFiles: [], exmFiles: [] };

function handleFileSelect(input, listId) {
  const key = input.id;
  Array.from(input.files).forEach(f => {
    if (!attachedFiles[key].find(x => x.name === f.name)) attachedFiles[key].push(f);
  });
  renderFileList(key, listId);
  input.value = '';
}

function handleFileDrop(e, inputId, listId) {
  e.preventDefault();
  document.getElementById(inputId.replace('Files','DropZone') || '').classList.remove('drag-over');
  const key = inputId;
  Array.from(e.dataTransfer.files).forEach(f => {
    if (!attachedFiles[key].find(x => x.name === f.name)) attachedFiles[key].push(f);
  });
  renderFileList(key, listId);
}

function renderFileList(key, listId) {
  const iconMap = { pdf:'fa-file-pdf', doc:'fa-file-word', docx:'fa-file-word', jpg:'fa-file-image', jpeg:'fa-file-image', png:'fa-file-image', zip:'fa-file-archive' };
  document.getElementById(listId).innerHTML = attachedFiles[key].map((f, i) => {
    const ext  = f.name.split('.').pop().toLowerCase();
    const icon = iconMap[ext] || 'fa-file';
    const size = f.size > 1048576 ? (f.size/1048576).toFixed(1)+' MB' : Math.round(f.size/1024)+' KB';
    return `<div class="fdz-file-item">
      <i class="fas ${icon} fdz-file-icon"></i>
      <span class="fdz-file-name">${f.name}</span>
      <span class="fdz-file-size">${size}</span>
      <button class="fdz-file-remove" onclick="removeFile('${key}','${listId}',${i})"><i class="fas fa-times"></i></button>
    </div>`;
  }).join('');
}

function removeFile(key, listId, idx) {
  attachedFiles[key].splice(idx, 1);
  renderFileList(key, listId);
}

function clearFileList(key, listId) {
  attachedFiles[key] = [];
  const el = document.getElementById(listId);
  if (el) el.innerHTML = '';
}

/* ── Add exam (updated) ── */
function addExam() {
  if (selectedClass<0) { closeModal('examModal'); return; }
  const title  = document.getElementById('exmTitle').value.trim();
  const date   = document.getElementById('exmDate').value;
  const dur    = document.getElementById('exmDuration').value;
  const q      = document.getElementById('exmQuestions').value;
  const openAt = examScheduleMode === 'scheduled' ? document.getElementById('exmOpenAt').value : null;
  const closeAt= examScheduleMode === 'scheduled' ? document.getElementById('exmCloseAt').value : null;
  const files  = [...attachedFiles.exmFiles];
  if (!title) return;

  let meta = [date, q?q+' асуулт':'', dur?dur+' мин':''].filter(Boolean).join(' · ');
  if (openAt) meta += ` · Нээгдэх: ${new Date(openAt).toLocaleString('mn-MN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}`;

  CLASSES[selectedClass].exams.push({ title, meta, status:'upcoming', result:null, scheduled: !!openAt, openAt, closeAt, files });
  renderDetail(selectedClass);
  ['exmTitle','exmDate','exmDuration','exmQuestions','exmScore','exmDesc','exmOpenAt','exmCloseAt'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  clearFileList('exmFiles','exmFileList');
  setScheduleMode('now');
  document.getElementById('schedulePreview').style.display = 'none';
  closeModal('examModal');
  switchTab('exams', document.querySelectorAll('.cd-tab')[1]);
}

/* ── Add assignment (updated) ── */
function addAssignment() {
  if (selectedClass<0) { closeModal('assignModal'); return; }
  const title = document.getElementById('asnTitle').value.trim();
  const date  = document.getElementById('asnDate').value;
  const files = [...attachedFiles.asnFiles];
  if (!title) return;
  const total = CLASSES[selectedClass].students;
  CLASSES[selectedClass].assignments.push({ title, meta:date?'Дуусах: '+date:'Хугацаа тодорхойгүй', status:'active', submitted:0, total, files });
  renderDetail(selectedClass);
  ['asnTitle','asnDate','asnScore','asnDesc'].forEach(id=>document.getElementById(id).value='');
  clearFileList('asnFiles','asnFileList');
  closeModal('assignModal');
  switchTab('assignments', document.querySelectorAll('.cd-tab')[2]);
}

let pickedColor='#3b82f6';
function pickColor(btn) {
  document.querySelectorAll('.color-pick').forEach(b=>b.style.borderColor='transparent');
  btn.style.borderColor='#0f172a';
  pickedColor=btn.dataset.color;
  document.getElementById('clsColor').value=pickedColor;
}

function addClass() {
  const name=document.getElementById('clsName').value.trim();
  const subj=document.getElementById('clsSubject').value;
  const color=document.getElementById('clsColor').value||'#3b82f6';
  if (!name) return;
  CLASSES.push({name,subject:subj,icon:'fa-layer-group',color,students:0,avg:'—',avgClass:'mid',avgNum:0,lessons:[],exams:[],assignments:[],studentList:[]});
  buildCards();
  ['clsName','clsMax','clsDesc'].forEach(id=>document.getElementById(id).value='');
  closeModal('classModal');
}

buildCards();
setTimeout(()=>document.querySelectorAll('.color-pick')[0].style.borderColor='#0f172a', 0);
