const MN_MONTHS_SHORT = ['1-р сар','2-р сар','3-р сар','4-р сар','5-р сар','6-р сар','7-р сар','8-р сар','9-р сар','10-р сар','11-р сар','12-р сар'];
const MN_DAYS_FULL    = ['Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба','Ням'];

const SCHEDULE_EVENTS = [
  { date:'2026-04-22', type:'exam', title:'Алгебрийн дундын шалгалт',    subject:'Алгебр',  color:'#3b82f6', time:'10:00', duration:'45 мин' },
  { date:'2026-04-25', type:'exam', title:'Геометрийн шалгалт',           subject:'Геометр', color:'#10b981', time:'09:00', duration:'30 мин' },
  { date:'2026-04-30', type:'exam', title:'Физикийн явцын шалгалт',       subject:'Физик',   color:'#8b5cf6', time:'14:00', duration:'40 мин' },
];

const SUBJECTS = {
  'Алгебр':  {color:'#3b82f6', bg:'#dbeafe', icon:'fa-calculator'},
  'Геометр': {color:'#10b981', bg:'#d1fae5', icon:'fa-shapes'},
  'Физик':   {color:'#8b5cf6', bg:'#ede9fe', icon:'fa-atom'},
  'Хими':    {color:'#f59e0b', bg:'#fef3c7', icon:'fa-flask'},
};

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
       content:'Квадрат тэгшитгэл: ax² + bx + c = 0\n\nШийдлийн томъёо: x = (−b ± √(b²−4ac)) / 2a\n\nМилл бол: D = b² − 4ac\n\nD > 0 → 2 бодит шийд\nD = 0 → 1 давхар шийд\nD < 0 → Бодит шийдгүй'}
    ],
    studentFile: null, submittedAt: null, studentNotes: ''
  },
  {
    id:2, title:'Функцийн утга – ГД',
    subject:'Алгебр', desc:'График зур, тайлбарла.',
    due:'2026-04-25', daysLeft:6, status:'pending', priority:'medium',
    teacher:'Б. Сарантуяа',
    teacherFiles:[
      {name:'Функц_график_даалгавар.pdf', size:'245 KB', type:'pdf',
       content:'Доорх функцуудын графикийг [-3, 3] завсарт байгуул:\n\n1. f(x) = x² − 2x + 1\n2. g(x) = 2x + 3\n3. h(x) = |x − 1|\n4. k(x) = √x + 1\n\nТус бүрийн орой, тэнхлэгтэй огтлолцох цэгийг тодорхойл.'}
    ],
    studentFile: null, submittedAt: null, studentNotes: ''
  },
  {
    id:3, title:'Векторын тооцоо – Бие даалт',
    subject:'Геометр', desc:'Координатын системд вектор нэмэх, хасах ажилладаг.',
    due:'2026-04-28', daysLeft:9, status:'pending', priority:'medium',
    teacher:'Д. Мөнхбаяр',
    teacherFiles:[],
    studentFile: null, submittedAt: null, studentNotes: ''
  },
  {
    id:4, title:'Хүч ба энерги – Нэмэлт дасгал',
    subject:'Физик', desc:'Хүчний диаграмм зур, тооцоо хий.',
    due:'2026-04-30', daysLeft:11, status:'pending', priority:'low',
    teacher:'Н. Батбаяр',
    teacherFiles:[
      {name:'Хүч_энерги_бодлого.pdf', size:'188 KB', type:'pdf',
       content:'Нэмэлт даалгавар:\n\n1. 5 kg масстай биет 10 м/с хурдтай хөдлөж байна. Кинетик энергийг ол.\n2. 2 kg масстай биет 3 м өндөрт байна. Потенциал энергийг g=10 м/с² гэж ол.\n3. 100 N хүч 5 м зайд хийсэн ажлыг ол.'}
    ],
    studentFile: null, submittedAt: null, studentNotes: ''
  },
  {
    id:5, title:'Теорем Пифагор – Гэрийн даалгавар',
    subject:'Геометр', desc:'Гурвалжны тооцоо.',
    due:'2026-04-10', daysLeft:-9, status:'done', priority:'medium',
    teacher:'Д. Мөнхбаяр',
    teacherFiles:[{name:'Пифагор_даалгавар.pdf', size:'156 KB', type:'pdf', content:'...'}],
    studentFile: {name:'миний_хариу_пифагор.pdf', size:'210 KB', type:'pdf'}, submittedAt:'2026-04-10 09:32', studentNotes:'Бүх бодлогыг шийдлээ.'
  },
  {
    id:6, title:'Тэгшитгэл ба тэгш бус байдал – ГД',
    subject:'Алгебр', desc:'',
    due:'2026-04-05', daysLeft:-14, status:'done', priority:'low',
    teacher:'Б. Сарантуяа',
    teacherFiles:[], studentFile: null, submittedAt:'2026-04-05 14:20', studentNotes:''
  },
  {
    id:7, title:'Химийн тэмдгүүд цээжлэх',
    subject:'Хими', desc:'1–20-р элемент.',
    due:'2026-04-08', daysLeft:-11, status:'done', priority:'low',
    teacher:'О. Цэцэгмаа',
    teacherFiles:[], studentFile: null, submittedAt:'2026-04-07 22:15', studentNotes:''
  },
  {
    id:8, title:'Механик хөдөлгөөн – Тайлан',
    subject:'Физик', desc:'Туршилтын тайлан бич.',
    due:'2026-04-12', daysLeft:-7, status:'done', priority:'medium',
    teacher:'Н. Батбаяр',
    teacherFiles:[{name:'Тайлангийн_загвар.docx', size:'78 KB', type:'doc', content:'Тайлангийн бүтэц:\n1. Зорилго\n2. Онол\n3. Арга зүй\n4. Үр дүн\n5. Дүгнэлт'}],
    studentFile: {name:'механик_тайлан.docx', size:'145 KB', type:'doc'}, submittedAt:'2026-04-12 08:45', studentNotes:'Туршилтыг 3 удаа давтаж гүйцэтгэлээ.'
  },
];

let currentFilter = 'all';

/* ── Due badge ── */
function getDueBadge(a) {
  if (a.status === 'done') return '<span class="due-badge ok"><i class="fas fa-check" style="margin-right:3px"></i>Дуусгасан</span>';
  if (a.daysLeft <= 0)  return `<span class="due-badge overdue"><i class="fas fa-times" style="margin-right:3px"></i>${Math.abs(a.daysLeft)} өдөр хоцорсон</span>`;
  if (a.daysLeft <= 3)  return `<span class="due-badge urgent"><i class="fas fa-fire" style="margin-right:3px"></i>${a.daysLeft} өдөр үлдсэн</span>`;
  if (a.daysLeft <= 7)  return `<span class="due-badge soon">${a.daysLeft} өдөр үлдсэн</span>`;
  return `<span class="due-badge ok">${a.daysLeft} өдөр үлдсэн</span>`;
}

function getPriorityClass(a) {
  if (a.status === 'done') return '';
  return a.daysLeft <= 3 ? 'urgent-glow' : '';
}

function getStatusPill(a) {
  if (a.status === 'done') return '<span class="status-pill done"><i class="fas fa-check"></i>Дуусгасан</span>';
  if (a.daysLeft <= 3)     return '<span class="status-pill overdue"><i class="fas fa-fire"></i>Яаралтай</span>';
  return '<span class="status-pill pending"><i class="fas fa-clock"></i>Хийгдэж байна</span>';
}

/* ── Render card ── */
function renderCard(a) {
  const sub      = SUBJECTS[a.subject] || {color:'#3b82f6', bg:'#dbeafe', icon:'fa-book'};
  const hasFiles = a.teacherFiles && a.teacherFiles.length > 0;
  const submitted= a.status === 'done' && a.submittedAt;
  return `
  <div class="assign-card ${a.status==='done'?'done':''} ${getPriorityClass(a)}">
    <div class="assign-card-accent" style="--ac:${sub.color}"></div>
    <div class="assign-card-body">
      <div class="assign-card-top">
        <div class="assign-card-title">${a.title}</div>
        ${getDueBadge(a)}
      </div>
      ${a.desc ? `<div class="assign-card-desc">${a.desc}</div>` : ''}
      ${hasFiles ? `<div class="assign-file-pills">
        ${a.teacherFiles.map(f => `<span class="assign-file-pill"><i class="fas ${fileIcon(f.type)}"></i>${f.name}</span>`).join('')}
      </div>` : ''}
      ${submitted ? `<div class="assign-submitted-info">
        <i class="fas fa-check-circle" style="color:#10b981"></i>
        Илгээсэн: ${a.submittedAt}
        ${a.studentFile ? `· <i class="fas fa-paperclip"></i>${a.studentFile.name}` : ''}
      </div>` : ''}
      <div class="assign-card-footer">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="sub-tag" style="--tc:${sub.color}">
            <i class="fas ${sub.icon}" style="font-size:10px"></i>${a.subject}
          </span>
          <span style="font-size:11px;color:#94a3b8"><i class="fas fa-user" style="margin-right:3px"></i>${a.teacher}</span>
          <span style="font-size:11px;color:#94a3b8"><i class="fas fa-calendar-alt" style="margin-right:3px"></i>${a.due}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          ${getStatusPill(a)}
          <button class="av-open-btn" onclick="openAssignmentViewer(${a.id})">
            <i class="fas fa-folder-open"></i>
            ${hasFiles ? 'Нээх' : 'Дэлгэрэнгүй'}
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function fileIcon(type) {
  const m = {pdf:'fa-file-pdf', doc:'fa-file-word', docx:'fa-file-word', jpg:'fa-file-image', jpeg:'fa-file-image', png:'fa-file-image', zip:'fa-file-archive'};
  return m[type] || 'fa-file';
}

/* ── Render list ── */
function renderList() {
  const list = document.getElementById('assignList');
  let filtered = ASSIGNMENTS;
  if (currentFilter === 'urgent') filtered = ASSIGNMENTS.filter(a => a.status !== 'done' && a.daysLeft <= 3);
  if (currentFilter === 'pending') filtered = ASSIGNMENTS.filter(a => a.status !== 'done' && a.daysLeft > 3);
  if (currentFilter === 'done')   filtered = ASSIGNMENTS.filter(a => a.status === 'done');

  if (!filtered.length) {
    list.innerHTML = `<div class="stu-empty">
      <div class="stu-empty-icon"><i class="fas fa-tasks"></i></div>
      <h3>Даалгавар байхгүй байна</h3>
      <p>Энэ ангилалд харуулах даалгавар алга</p>
    </div>`;
    return;
  }

  const active = filtered.filter(a => a.status !== 'done');
  const done   = filtered.filter(a => a.status === 'done');
  let html = '';
  if (active.length) {
    html += `<div class="asgn-group-label"><i class="fas fa-hourglass-half" style="color:#f59e0b"></i>Хийгдэж буй (${active.length})</div>`;
    html += active.map(renderCard).join('');
  }
  if (done.length) {
    html += `<div class="asgn-group-label" style="margin-top:${active.length?'22px':'4px'}"><i class="fas fa-check-circle" style="color:#10b981"></i>Дуусгасан (${done.length})</div>`;
    html += done.map(renderCard).join('');
  }
  list.innerHTML = html;
}

function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderList();
}

/* ── Stats ── */
function updateStats() {
  const total   = ASSIGNMENTS.length;
  const done    = ASSIGNMENTS.filter(a => a.status==='done').length;
  const pending = ASSIGNMENTS.filter(a => a.status!=='done' && a.daysLeft > 3).length;
  const urgent  = ASSIGNMENTS.filter(a => a.status!=='done' && a.daysLeft <= 3).length;
  document.getElementById('statTotal').textContent   = total;
  document.getElementById('statDone').textContent    = done;
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statUrgent').textContent  = urgent;
  document.getElementById('pillDone').textContent    = done;
  document.getElementById('pillPending').textContent = pending;
  document.getElementById('pillUrgent').textContent  = urgent;
  document.getElementById('cntAll').textContent      = total;
  document.getElementById('cntDone').textContent     = done;
  document.getElementById('cntPending').textContent  = pending;
  document.getElementById('cntUrgent').textContent   = urgent;
  const pct = total ? done/total*100 : 0;
  document.getElementById('barDone').style.width    = pct + '%';
  document.getElementById('barPending').style.width = (total ? pending/total*100 : 0) + '%';
  document.getElementById('barUrgent').style.width  = (total ? urgent/total*100 : 0) + '%';
  document.getElementById('sumDone').textContent    = done;
  document.getElementById('sumPending').textContent = pending;
  document.getElementById('sumUrgent').textContent  = urgent;
}

function buildSubjectLegend() {
  const counts = {};
  ASSIGNMENTS.forEach(a => { counts[a.subject] = (counts[a.subject]||0)+1; });
  document.getElementById('subLegend').innerHTML = Object.entries(counts).map(([sub, cnt]) => {
    const s = SUBJECTS[sub] || {color:'#3b82f6'};
    return `<div class="sub-legend-item">
      <div class="sub-legend-dot" style="background:${s.color}"></div>
      <div class="sub-legend-name">${sub}</div>
      <span class="sub-legend-cnt">${cnt}</span>
    </div>`;
  }).join('');
}

function buildCalendar() {
  const year = 2026, month = 3;
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const today       = 19;
  const deadlineDays = new Set(ASSIGNMENTS.filter(a=>a.status!=='done').map(a=>parseInt(a.due.split('-')[2])));
  const examDays     = new Set(SCHEDULE_EVENTS.map(e=>parseInt(e.date.split('-')[2])));
  const pad = n => String(n).padStart(2,'0');
  const dayNames = ['Да','Мя','Лх','Пү','Ба','Бя','Ня'];
  let html = `<div class="cal-days-head">${dayNames.map(d=>`<div class="cal-day-name">${d}</div>`).join('')}</div>`;
  html += '<div class="cal-days">';
  const start = (firstDay + 6) % 7;
  for (let i=0; i<start; i++) html += '<div class="cal-day other-month"></div>';
  for (let d=1; d<=daysInMonth; d++) {
    const ds      = `${year}-${pad(month+1)}-${pad(d)}`;
    const isToday = d === today;
    const hasDL   = deadlineDays.has(d);
    const hasExam = examDays.has(d);
    html += `<div class="cal-day ${isToday?'today':''} ${hasDL?'has-deadline':''} ${hasExam?'has-exam':''}"
      onclick="openDaySchedule('${ds}')" title="${MN_MONTHS_SHORT[month]} ${d}-ний хуваарь">${d}</div>`;
  }
  html += '</div>';
  document.getElementById('miniCal').innerHTML = html;
}

/* ════════════════════════════════════════
   ASSIGNMENT VIEWER MODAL (Student)
════════════════════════════════════════ */
let viewerAssignId = null;
let viewerStudentFile = null;

function openAssignmentViewer(id) {
  const a   = ASSIGNMENTS.find(x => x.id === id);
  if (!a) return;
  viewerAssignId  = id;
  viewerStudentFile = null;

  const sub = SUBJECTS[a.subject] || {color:'#3b82f6', bg:'#dbeafe', icon:'fa-book'};

  // ── Header
  document.getElementById('avTitle').textContent   = a.title;
  document.getElementById('avSubject').textContent = a.subject;
  document.getElementById('avTeacher').textContent = a.teacher;
  document.getElementById('avDue').textContent     = a.due;
  document.getElementById('avSubjectIcon').style.background = sub.bg;
  document.getElementById('avSubjectIcon').style.color      = sub.color;
  document.getElementById('avSubjectIcon').innerHTML = `<i class="fas ${sub.icon}"></i>`;

  // ── Teacher desc
  document.getElementById('avDesc').textContent = a.desc || '(Тайлбар бичигдээгүй)';

  // ── Teacher files list
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
    // Show first file preview
    selectTeacherFile(id, 0, fileList.firstElementChild);
  } else {
    fileList.innerHTML = `<div class="av-no-files"><i class="fas fa-info-circle"></i> Багш файл хавсаргаагүй байна</div>`;
    document.getElementById('avPreviewArea').innerHTML =
      `<div class="av-preview-empty"><i class="fas fa-file-alt"></i><p>Даалгаврын агуулга дэлгэрэнгүй бичигдсэн байна</p></div>`;
  }

  // ── Student submission area
  renderSubmitSection(a);

  // ── Open modal
  document.getElementById('assignViewerModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function selectTeacherFile(assignId, fileIdx, el) {
  // Highlight selected file item
  document.querySelectorAll('.av-file-item').forEach(x => x.classList.remove('active'));
  if (el) el.classList.add('active');

  const a = ASSIGNMENTS.find(x => x.id === assignId);
  const f = a.teacherFiles[fileIdx];
  if (!f) return;

  // ── Render preview
  const prev = document.getElementById('avPreviewArea');
  const isImage = ['jpg','jpeg','png'].includes(f.type);

  if (f._url) {
    // Real File object with object URL
    if (isImage) {
      prev.innerHTML = `<img src="${f._url}" style="max-width:100%;max-height:460px;object-fit:contain;border-radius:8px">`;
    } else if (f.type === 'pdf') {
      prev.innerHTML = `<iframe src="${f._url}" style="width:100%;height:480px;border:none;border-radius:8px"></iframe>`;
    } else {
      prev.innerHTML = simDocPreview(f);
    }
  } else {
    // Simulated preview
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
      <span>${f.name}</span>
      <small>${size}</small>
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
      <span>${f.name}</span>
      <small>${size}</small>
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
  const a     = ASSIGNMENTS.find(x => x.id === viewerAssignId);
  if (!a || a.status === 'done') return;
  const notes = document.getElementById('avNotes') ? document.getElementById('avNotes').value.trim() : '';
  const now   = new Date().toLocaleString('mn-MN', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit'});

  a.status      = 'done';
  a.submittedAt = `2026/04/${String(19).padStart(2,'0')} ${now.split(' ')[1] || '00:00'}`;
  a.studentFile = viewerStudentFile
    ? {name: viewerStudentFile.name, size: Math.round(viewerStudentFile.size/1024)+' KB', type: viewerStudentFile.name.split('.').pop()}
    : null;
  a.studentNotes = notes;

  // Show success flash then close
  const btn = document.getElementById('avSubmitBtn');
  btn.innerHTML = '<i class="fas fa-check"></i> Илгэгдлээ!';
  btn.style.background = '#10b981';
  btn.disabled = true;
  setTimeout(() => {
    closeAssignmentViewer();
    updateStats();
    renderList();
    buildCalendar();
  }, 1200);
}

function closeAssignmentViewer() {
  document.getElementById('assignViewerModal').classList.remove('show');
  document.body.style.overflow = '';
  viewerAssignId   = null;
  viewerStudentFile = null;
  // Reset submit button
  const btn = document.getElementById('avSubmitBtn');
  if (btn) { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Илгээх'; btn.style.background = ''; btn.disabled = false; }
}

/* ════════════════════════════════════════
   SCHEDULE VIEW (mini-calendar click)
════════════════════════════════════════ */
function openDaySchedule(ds) {
  const date  = new Date(ds + 'T00:00:00');
  const d     = date.getDate();
  const m     = MN_MONTHS_SHORT[date.getMonth()];
  const dow   = MN_DAYS_FULL[(date.getDay() + 6) % 7];

  document.getElementById('schedDateTitle').textContent = `${d} ${m}`;
  document.getElementById('schedDateSub').textContent   = dow;

  const assigns = ASSIGNMENTS.filter(a => a.due === ds && a.status !== 'done');
  const exams   = SCHEDULE_EVENTS.filter(e => e.date === ds);

  const all = [
    ...exams,
    ...assigns.map(a => ({
      type:    'assignment',
      title:   a.title,
      subject: a.subject,
      color:   (SUBJECTS[a.subject] || {color:'#3b82f6'}).color,
      daysLeft: a.daysLeft,
      urgent:  a.daysLeft <= 3
    }))
  ];

  const body = document.getElementById('schedBody');
  if (!all.length) {
    body.innerHTML = `<div class="sched-empty">
      <i class="fas fa-check-circle"></i>
      <p>Энэ өдөр тэмдэглэгдсэн зүйл байхгүй байна</p>
    </div>`;
  } else {
    body.innerHTML = all.map(ev => {
      if (ev.type === 'exam') {
        return `<div class="sched-item">
          <div class="sched-item-icon" style="background:${ev.color}22;color:${ev.color}">
            <i class="fas fa-pen-square"></i>
          </div>
          <div class="sched-item-body">
            <div class="sched-item-title">${ev.title}</div>
            <div class="sched-item-meta">
              <span style="color:${ev.color}">${ev.subject}</span> &middot; ${ev.time || '—'} &middot; ${ev.duration}
            </div>
          </div>
          <span class="sched-badge exam">📝 Шалгалт</span>
        </div>`;
      }
      const badgeCls = ev.urgent ? 'urgent' : 'assignment';
      const badgeTxt = ev.urgent ? '🔥 Яаралтай' : '📋 Даалгавар';
      const dayTxt   = ev.daysLeft <= 0
        ? '<span style="color:#ef4444;font-weight:700">Хоцорсон</span>'
        : ev.daysLeft + ' өдөр үлдсэн';
      return `<div class="sched-item">
        <div class="sched-item-icon" style="background:${ev.color}22;color:${ev.color}">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="sched-item-body">
          <div class="sched-item-title">${ev.title}</div>
          <div class="sched-item-meta">
            <span style="color:${ev.color}">${ev.subject}</span> &middot; ${dayTxt}
          </div>
        </div>
        <span class="sched-badge ${badgeCls}">${badgeTxt}</span>
      </div>`;
    }).join('');
  }

  document.getElementById('schedModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSchedModal() {
  document.getElementById('schedModal').classList.remove('show');
  document.body.style.overflow = '';
}

/* ── Init ── */
updateStats();
buildSubjectLegend();
buildCalendar();
renderList();
