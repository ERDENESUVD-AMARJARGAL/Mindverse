const SUBJECT_ICONS = {
  'Алгебр':'fa-square-root-variable', 'Геометр':'fa-shapes',
  'Физик':'fa-atom', 'Хими':'fa-flask',
  'Биологи':'fa-seedling', 'Түүх':'fa-landmark',
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
      {name:'Алгебрийн лекц 1–5',          type:'pdf', size:'2.4 MB', date:'2026-03-10', cat:'Лекц'},
      {name:'Дасгал бодлогын цуглуулга',   type:'pdf', size:'1.8 MB', date:'2026-03-18', cat:'Дасгал'},
      {name:'Функцийн графикийн жишээ',    type:'img', size:'840 KB', date:'2026-03-25', cat:'Зураг'},
      {name:'Нэмэлт материал — логарифм',  type:'doc', size:'560 KB', date:'2026-04-02', cat:'Нэмэлт'},
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
      {name:'Геометрийн томьёо',  type:'pdf', size:'1.1 MB', date:'2026-03-05', cat:'Лекц'},
      {name:'Зургийн жишээ',      type:'img', size:'2.2 MB', date:'2026-03-20', cat:'Зураг'},
      {name:'Теоремын баталгаа',  type:'doc', size:'780 KB', date:'2026-04-01', cat:'Нэмэлт'},
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
      {name:'Химийн тэмдгүүд',     type:'pdf', size:'800 KB', date:'2026-03-15', cat:'Лавлах'},
      {name:'Урвалын тэгшитгэл',   type:'doc', size:'640 KB', date:'2026-04-05', cat:'Дасгал'},
    ],
    exams:[
      {name:'1-р улирлын шалгалт', date:'2026-02-28', score:72, total:100, classAvgScore:65},
      {name:'2-р улирлын шалгалт', date:'2026-05-16', score:null, total:100, classAvgScore:null},
    ],
  },
];

let selectedIdx = -1, activeTab = 'lessons';

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
function subjectIcon(subj) {
  return SUBJECT_ICONS[subj] || 'fa-book-open';
}

/* ── Summary KPI bar ── */
function buildSummary() {
  let totalLessons = 0, totalDone = 0, scoreSum = 0, scoreCount = 0, upcoming = 0;
  CLASSES.forEach(c => {
    totalLessons += c.lessons.length;
    totalDone    += c.lessons.filter(l => l.status === 'done').length;
    c.exams.forEach(e => {
      if (e.score !== null) { scoreSum += e.score / e.total * 100; scoreCount++; }
      else upcoming++;
    });
  });
  document.getElementById('kpiLessons').textContent  = totalLessons;
  document.getElementById('kpiDone').textContent     = totalDone;
  document.getElementById('kpiAvg').textContent      = scoreCount ? Math.round(scoreSum / scoreCount) + '%' : '—';
  document.getElementById('kpiUpcoming').textContent = upcoming;
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
    return `
    <div class="cls-card" id="clsCard${realIdx}" style="--cc:${c.color}" onclick="selectClass(${realIdx})">
      <div class="cls-card-top"></div>
      <div class="cls-card-icon-row">
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
            <div class="cls-card-strip-lbl">Дуусгасан</div>
          </div>
          <div class="cls-card-strip-item">
            <div class="cls-card-strip-val">${taken}</div>
            <div class="cls-card-strip-lbl">Шалгалт</div>
          </div>
          <div class="cls-card-strip-item">
            <div class="cls-card-strip-val">${c.materials.length}</div>
            <div class="cls-card-strip-lbl">Файл</div>
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
  const c = CLASSES[idx];

  document.querySelectorAll('.cls-card').forEach(el => {
    el.classList.remove('selected');
    el.style.boxShadow = '';
    el.style.borderColor = '';
    if (el.id === `clsCard${idx}`) {
      el.classList.add('selected');
      el.style.borderColor = c.color;
      const rgb = hexToRgb(c.color);
      el.style.boxShadow = rgb
        ? `0 0 0 3px ${c.color}22, 0 12px 36px ${c.color}44`
        : `0 12px 36px rgba(7,67,125,.3)`;
    }
  });

  document.getElementById('clsGrid').classList.add('has-detail');
  const det = document.getElementById('clsDetail');
  det.classList.add('visible');
  det.style.setProperty('--dcolor', c.color);

  document.getElementById('detIcon').innerHTML = `<i class="fas ${subjectIcon(c.subject)}"></i>`;
  document.getElementById('detIcon').style.background = `color-mix(in srgb, ${c.color} 14%, #fff)`;
  document.getElementById('detIcon').style.color      = c.color;
  document.getElementById('detSubject').textContent   = c.subject;
  document.getElementById('detTitle').textContent     = c.name;
  document.getElementById('detTeacher').innerHTML     = `<i class="fas fa-chalkboard-teacher" style="margin-right:5px;opacity:.7"></i>${c.teacher}`;

  // KPI pills
  const done     = c.lessons.filter(l => l.status==='done').length;
  const total    = c.lessons.length;
  const scoresArr = c.exams.filter(e => e.score!==null);
  const avg      = scoresArr.length ? Math.round(scoresArr.reduce((s,e)=>s+e.score/e.total*100,0)/scoresArr.length) : null;
  const upcoming = c.exams.filter(e => e.score===null).length;

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
      <div class="cls-det-kpi-lbl">Удахгүй</div>
    </div>
    <div class="cls-det-kpi">
      <div class="cls-det-kpi-icon"><i class="fas fa-folder"></i></div>
      <div class="cls-det-kpi-val">${c.materials.length}</div>
      <div class="cls-det-kpi-lbl">Материал</div>
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
  if      (tab === 'lessons')   renderLessonsPane(c);
  else if (tab === 'materials') renderMaterialsPane(c);
  else if (tab === 'exams')     renderExamsPane(c);
}

function renderLessonsPane(c) {
  const done    = c.lessons.filter(l => l.status==='done').length;
  const pending = c.lessons.filter(l => l.status==='pending').length;
  const newL    = c.lessons.filter(l => l.status==='new').length;
  const total   = c.lessons.length;
  const donePct = Math.round(done/total*100);

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
            <div class="cls-tl-card ${l.status==='done'?'done':l.status==='pending'?'pending':''}">
              <div class="cls-tl-card-top">
                <div class="cls-tl-title">${l.title}</div>
                <span class="cls-tl-badge ${l.status}">${l.status==='done'?'Дууссан':l.status==='pending'?'Явагдаж байна':'Удахгүй'}</span>
              </div>
              <div class="cls-tl-meta">
                <div class="cls-tl-meta-item"><i class="fas fa-clock"></i>${l.dur}</div>
                <div class="cls-tl-meta-item"><i class="fas fa-calendar"></i>${l.date}</div>
              </div>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

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
      const headCls = !has ? 'upcoming-head' : 'done-head';
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
                  <div class="cls-exam-bar-fill" style="width:${pct}%;background:${col}">
                  </div>
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
        const today = new Date('2026-04-19');
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

buildSummary();
buildCards();
