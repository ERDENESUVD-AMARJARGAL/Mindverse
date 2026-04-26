/* ══════════════════════════════════════
   Teacher Analytics — Dynamic JS
══════════════════════════════════════ */

const PERIOD_DATA = {
  week: {
    kpis: [
      { icon:'users',            bg:'#dbeafe', ic:'#1d4ed8', val:'84',  lbl:'Нийт сурагч',                  trend:'up',   txt:'+3 энэ сар' },
      { icon:'chart-bar',        bg:'#d1fae5', ic:'#065f46', val:'76%', lbl:'Нийт дундаж оноо',             trend:'up',   txt:'+1% өнгөрсөн 7 хоногтой' },
      { icon:'clipboard-check',  bg:'#fef3c7', ic:'#92400e', val:'72%', lbl:'Даалгаврын дундаж илгээлт',    trend:'down', txt:'-5% өмнөх 7 хоногтой' },
      { icon:'pen-square',       bg:'#ede9fe', ic:'#5b21b6', val:'3',   lbl:'Нийт шалгалт (энэ долоо)',     trend:'flat', txt:'Өөрчлөлтгүй' },
    ],
    bars: [
      { label:'10А', pct:82, grad:'#3b82f6,#60a5fa', tc:'#1d4ed8' },
      { label:'11А', pct:77, grad:'#f59e0b,#fbbf24', tc:'#92400e' },
      { label:'9Б',  pct:69, grad:'#10b981,#34d399', tc:'#065f46' },
      { label:'8В',  pct:58, grad:'#8b5cf6,#a78bfa', tc:'#5b21b6' },
    ],
    seg: { good:12, fair:9, ok:4, warn:3 },
    exams: [
      { up:true,  title:'Алгебрийн дундын шалгалт', meta:'10А · 2026/04/22 · 20 асуулт', score:null },
      { up:true,  title:'Геометрийн шалгалт',        meta:'9Б · 2026/04/25 · 15 асуулт',  score:null },
      { up:false, title:'Тригонометрийн тест',        meta:'11А · 2026/04/21',              score:'74%', good:true },
    ],
    subs: [
      { label:'Квадрат тэгшитгэл – ГД',  sub:'10А · Дуусах: 2026/04/22', done:18, total:24, pct:75 },
      { label:'Теорем нотлох – ГД',       sub:'9Б · Дуусах: 2026/04/24',  done:14, total:18, pct:78 },
      { label:'График байгуулах',          sub:'11А · Дуусах: 2026/04/29', done:4,  total:22, pct:18, danger:true },
    ],
    deadlines: [
      { exam:true,  title:'Алгебрийн дундын шалгалт', meta:'10А анги',             date:'4/22 · 3 өдөр', soon:true },
      { exam:false, title:'Квадрат тэгшитгэл – ГД',   meta:'10А · 18/24 илгэсэн', date:'4/22 · 3 өдөр', soon:true },
      { exam:false, title:'Теорем нотлох – ГД',        meta:'9Б · 14/18 илгэсэн',  date:'4/24 · 5 өдөр', soon:true },
      { exam:true,  title:'Геометрийн шалгалт',         meta:'9Б анги',             date:'4/25 · 6 өдөр', soon:false },
    ],
  },
  month: {
    kpis: [
      { icon:'users',           bg:'#dbeafe', ic:'#1d4ed8', val:'84',  lbl:'Нийт сурагч',                 trend:'up',   txt:'+3 энэ сар' },
      { icon:'chart-bar',       bg:'#d1fae5', ic:'#065f46', val:'74%', lbl:'Нийт дундаж оноо',            trend:'up',   txt:'+2% өмнөх улиралтай' },
      { icon:'clipboard-check', bg:'#fef3c7', ic:'#92400e', val:'78%', lbl:'Даалгаврын дундаж илгээлт',   trend:'down', txt:'-4% өмнөх 7 хоногтой' },
      { icon:'pen-square',      bg:'#ede9fe', ic:'#5b21b6', val:'8',   lbl:'Нийт шалгалт (энэ сар)',      trend:'flat', txt:'Өөрчлөлтгүй' },
    ],
    bars: [
      { label:'10А', pct:84, grad:'#3b82f6,#60a5fa', tc:'#1d4ed8' },
      { label:'11А', pct:79, grad:'#f59e0b,#fbbf24', tc:'#92400e' },
      { label:'9Б',  pct:71, grad:'#10b981,#34d399', tc:'#065f46' },
      { label:'8В',  pct:62, grad:'#8b5cf6,#a78bfa', tc:'#5b21b6' },
    ],
    seg: { good:38, fair:28, ok:10, warn:8 },
    exams: [
      { up:true,  title:'Алгебрийн дундын шалгалт', meta:'10А · 2026/04/22 · 20 асуулт', score:null },
      { up:true,  title:'Геометрийн шалгалт',        meta:'9Б · 2026/04/25 · 15 асуулт',  score:null },
      { up:false, title:'Тригонометрийн тест',        meta:'11А · 2026/04/16',              score:'74%', good:true },
      { up:false, title:'Тэгшитгэлийн тест',          meta:'10А · 2026/04/07',              score:'82%', good:true },
      { up:false, title:'Теорем нотлолтын тест',      meta:'9Б · 2026/04/05',               score:'68%', good:false },
      { up:false, title:'Арифметикийн тест',           meta:'8В · 2026/04/10',               score:'59%', bad:true },
    ],
    subs: [
      { label:'Квадрат тэгшитгэл – ГД',  sub:'10А · Дуусах: 2026/04/22', done:18, total:24, pct:75 },
      { label:'Функцийн утга – ГД',        sub:'10А · Дуусах: 2026/04/25', done:10, total:24, pct:42, warn:true },
      { label:'Теорем нотлох – ГД',        sub:'9Б · Дуусах: 2026/04/24',  done:14, total:18, pct:78 },
      { label:'Давхардлын томъёо – ГД',    sub:'11А · Дуусах: 2026/04/23', done:16, total:22, pct:73 },
      { label:'График байгуулах',           sub:'11А · Дуусах: 2026/04/29', done:4,  total:22, pct:18, danger:true },
      { label:'Хуваагдах чанар – дасгал',  sub:'8В · Дуусах: 2026/04/22',  done:8,  total:20, pct:40, warn:true },
    ],
    deadlines: [
      { exam:true,  title:'Алгебрийн дундын шалгалт', meta:'10А анги',             date:'4/22 · 3 өдөр', soon:true  },
      { exam:false, title:'Квадрат тэгшитгэл – ГД',   meta:'10А · 18/24 илгэсэн', date:'4/22 · 3 өдөр', soon:true  },
      { exam:false, title:'Теорем нотлох – ГД',        meta:'9Б · 14/18 илгэсэн',  date:'4/24 · 5 өдөр', soon:true  },
      { exam:true,  title:'Геометрийн шалгалт',         meta:'9Б анги',             date:'4/25 · 6 өдөр', soon:false },
      { exam:false, title:'Давхардлын томъёо – ГД',    meta:'11А · 16/22 илгэсэн', date:'4/23 · 4 өдөр', soon:false },
    ],
  },
  quarter: {
    kpis: [
      { icon:'users',           bg:'#dbeafe', ic:'#1d4ed8', val:'84',  lbl:'Нийт сурагч',                 trend:'up',   txt:'+5 энэ улиралд' },
      { icon:'chart-bar',       bg:'#d1fae5', ic:'#065f46', val:'72%', lbl:'Нийт дундаж оноо',            trend:'up',   txt:'+3% өмнөх улиралтай' },
      { icon:'clipboard-check', bg:'#fef3c7', ic:'#92400e', val:'81%', lbl:'Даалгаврын дундаж илгээлт',   trend:'up',   txt:'+6% өмнөх улиралтай' },
      { icon:'pen-square',      bg:'#ede9fe', ic:'#5b21b6', val:'18',  lbl:'Нийт шалгалт (улиралд)',      trend:'flat', txt:'Өмнөхтэй ижил' },
    ],
    bars: [
      { label:'10А', pct:86, grad:'#3b82f6,#60a5fa', tc:'#1d4ed8' },
      { label:'11А', pct:80, grad:'#f59e0b,#fbbf24', tc:'#92400e' },
      { label:'9Б',  pct:73, grad:'#10b981,#34d399', tc:'#065f46' },
      { label:'8В',  pct:65, grad:'#8b5cf6,#a78bfa', tc:'#5b21b6' },
    ],
    seg: { good:42, fair:25, ok:11, warn:6 },
    exams: [
      { up:false, title:'1-р улирлын шалгалт (10А)', meta:'10А · 2026/03/20', score:'86%', good:true  },
      { up:false, title:'1-р улирлын шалгалт (11А)', meta:'11А · 2026/03/22', score:'80%', good:true  },
      { up:false, title:'1-р улирлын шалгалт (9Б)',  meta:'9Б · 2026/03/24',  score:'73%', good:false },
      { up:false, title:'1-р улирлын шалгалт (8В)',  meta:'8В · 2026/03/26',  score:'65%', bad:true   },
    ],
    subs: [
      { label:'Хичээлийн дунд шалгалт', sub:'10А · Нийт 12 даалгавар', done:11, total:12, pct:92 },
      { label:'Улирлын нэгтгэл',         sub:'11А · Нийт 10 даалгавар', done:9,  total:10, pct:90 },
      { label:'Туршилтын ажил',           sub:'9Б · Нийт 8 даалгавар',   done:7,  total:8,  pct:88 },
      { label:'Практик даалгавар',        sub:'8В · Нийт 8 даалгавар',   done:5,  total:8,  pct:63, warn:true },
    ],
    deadlines: [
      { exam:true, title:'Алгебрийн дундын шалгалт', meta:'10А анги', date:'4/22', soon:true  },
      { exam:true, title:'Геометрийн шалгалт',         meta:'9Б анги', date:'4/25', soon:false },
    ],
  },
  year: {
    kpis: [
      { icon:'users',           bg:'#dbeafe', ic:'#1d4ed8', val:'84',  lbl:'Нийт сурагч',               trend:'up',   txt:'+12 жилийн эхнээс' },
      { icon:'chart-bar',       bg:'#d1fae5', ic:'#065f46', val:'73%', lbl:'Жилийн дундаж оноо',         trend:'up',   txt:'+4% өмнөх жилтэй' },
      { icon:'clipboard-check', bg:'#fef3c7', ic:'#92400e', val:'83%', lbl:'Даалгаврын нийт илгээлт',    trend:'up',   txt:'+8% өмнөх жилтэй' },
      { icon:'pen-square',      bg:'#ede9fe', ic:'#5b21b6', val:'32',  lbl:'Жилийн нийт шалгалт',        trend:'flat', txt:'Өмнөхтэй ижил' },
    ],
    bars: [
      { label:'10А', pct:85, grad:'#3b82f6,#60a5fa', tc:'#1d4ed8' },
      { label:'11А', pct:80, grad:'#f59e0b,#fbbf24', tc:'#92400e' },
      { label:'9Б',  pct:72, grad:'#10b981,#34d399', tc:'#065f46' },
      { label:'8В',  pct:64, grad:'#8b5cf6,#a78bfa', tc:'#5b21b6' },
    ],
    seg: { good:45, fair:22, ok:12, warn:5 },
    exams: [
      { up:false, title:'Жилийн эцсийн шалгалт (10А)', meta:'10А · 2025/12/18', score:'85%', good:true  },
      { up:false, title:'Жилийн эцсийн шалгалт (11А)', meta:'11А · 2025/12/20', score:'80%', good:true  },
      { up:false, title:'Жилийн эцсийн шалгалт (9Б)',  meta:'9Б · 2025/12/22',  score:'72%', good:false },
      { up:false, title:'Жилийн эцсийн шалгалт (8В)',  meta:'8В · 2025/12/24',  score:'64%', bad:true   },
    ],
    subs: [
      { label:'Нийт илгээлт',  sub:'10А · Жилийн нийт', done:22, total:24, pct:92 },
      { label:'Нийт илгээлт',  sub:'11А · Жилийн нийт', done:19, total:22, pct:86 },
      { label:'Нийт илгээлт',  sub:'9Б · Жилийн нийт',  done:16, total:20, pct:80 },
      { label:'Нийт илгээлт',  sub:'8В · Жилийн нийт',  done:14, total:20, pct:70, warn:true },
    ],
    deadlines: [],
  },
};

const PERIOD_KEYS = ['week', 'month', 'quarter', 'year'];
let currentPeriod = 'month';

/* ── KPI cards ── */
function renderKpis(d) {
  const row = document.getElementById('kpiRow');
  if (!row) return;
  row.innerHTML = d.kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-icon" style="background:${k.bg};color:${k.ic}"><i class="fas fa-${k.icon}"></i></div>
      <div class="kpi-val">${k.val}</div>
      <div class="kpi-lbl">${k.lbl}</div>
      <span class="kpi-trend ${k.trend}">
        <i class="fas fa-${k.trend==='up'?'arrow-up':k.trend==='down'?'arrow-down':'minus'}"></i>
        ${k.txt}
      </span>
    </div>`).join('');
}

/* ── Bar chart ── */
function renderBars(d) {
  const box = document.getElementById('barChart');
  if (!box) return;
  box.innerHTML = d.bars.map(b => `
    <div class="bar-row">
      <div class="bar-label">${b.label}</div>
      <div class="bar-track">
        <div class="bar-fill bar-fill-anim" style="width:0%;background:linear-gradient(90deg,${b.grad})"
             data-target="${b.pct}"></div>
      </div>
      <div class="bar-pct" style="color:${b.tc}">${b.pct}%</div>
    </div>`).join('');

  const seg = d.seg;
  document.getElementById('segGood').textContent = seg.good;
  document.getElementById('segFair').textContent = seg.fair;
  document.getElementById('segOk').textContent   = seg.ok;
  document.getElementById('segWarn').textContent = seg.warn;

  requestAnimationFrame(() => {
    box.querySelectorAll('.bar-fill-anim').forEach(el => {
      el.style.transition = 'width .6s ease';
      el.style.width = el.dataset.target + '%';
    });
  });
}

/* ── Exam results ── */
function renderExams(d) {
  const list = document.getElementById('examList');
  if (!list) return;
  list.innerHTML = d.exams.map(e => {
    if (e.up) return `
      <div class="result-item">
        <div class="result-icon" style="background:#dbeafe;color:#1d4ed8"><i class="fas fa-clock"></i></div>
        <div class="result-info">
          <div class="result-title">${e.title}</div>
          <div class="result-meta">${e.meta}</div>
        </div>
        <div class="result-score" style="color:#94a3b8">Удахгүй</div>
      </div>`;
    const col = e.bad ? '#991b1b' : e.good ? '#065f46' : '#92400e';
    const bg  = e.bad ? '#fee2e2' : e.good ? '#d1fae5' : '#fef3c7';
    return `
      <div class="result-item">
        <div class="result-icon" style="background:${bg};color:${col}"><i class="fas fa-check-circle"></i></div>
        <div class="result-info">
          <div class="result-title">${e.title}</div>
          <div class="result-meta">${e.meta}</div>
        </div>
        <div class="result-score" style="color:${col}">${e.score}</div>
      </div>`;
  }).join('');
}

/* ── Assignment submissions ── */
function renderSubs(d) {
  const box = document.getElementById('subList');
  if (!box) return;
  box.innerHTML = d.subs.map(s => {
    const fill = s.danger
      ? `background:linear-gradient(90deg,#ef4444,#f87171)`
      : s.warn
        ? `background:linear-gradient(90deg,#f59e0b,#fbbf24)`
        : `background:linear-gradient(90deg,#10b981,#34d399)`;
    return `
      <div class="so-item">
        <div class="so-row">
          <div>
            <div class="so-label">${s.label}</div>
            <div class="so-sub">${s.sub}</div>
          </div>
          <div class="so-pct">${s.done}/${s.total}</div>
        </div>
        <div class="so-track">
          <div class="so-fill so-fill-anim" style="width:0%;${fill}" data-target="${s.pct}"></div>
        </div>
      </div>`;
  }).join('');

  requestAnimationFrame(() => {
    box.querySelectorAll('.so-fill-anim').forEach(el => {
      el.style.transition = 'width .6s ease';
      el.style.width = el.dataset.target + '%';
    });
  });
}

/* ── Deadlines ── */
function renderDeadlines(d) {
  const list = document.getElementById('deadlineList');
  if (!list) return;
  if (!d.deadlines.length) {
    list.innerHTML = '<div style="text-align:center;padding:32px;color:#94a3b8;font-size:13px"><i class="fas fa-check-circle" style="display:block;font-size:24px;margin-bottom:8px;color:#10b981"></i>Ойрын хугацаанд дуусах зүйл байхгүй байна</div>';
    return;
  }
  list.innerHTML = d.deadlines.map(dl => `
    <div class="deadline-item ${dl.exam ? 'exam' : 'assign'}">
      <div class="deadline-info">
        <div class="deadline-title">${dl.title}</div>
        <div class="deadline-meta">
          <i class="fas fa-layer-group" style="color:${dl.exam?'#3b82f6':'#10b981'};margin-right:4px"></i>${dl.meta}
        </div>
      </div>
      <span class="deadline-date ${dl.soon ? 'soon' : 'ok'}">${dl.date}</span>
    </div>`).join('');
}

/* ── Full render ── */
function renderPeriod(key) {
  const d = PERIOD_DATA[key];
  renderKpis(d);
  renderBars(d);
  renderExams(d);
  renderSubs(d);
  renderDeadlines(d);
}

/* ── Period button ── */
function setPeriod(btn) {
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const idx = [...btn.parentElement.children].indexOf(btn);
  currentPeriod = PERIOD_KEYS[idx] || 'month';
  renderPeriod(currentPeriod);
}

/* ── Wire HTML element IDs (update static HTML ids) ── */
function patchHTML() {
  // KPI row — add id if missing
  const kpiRow = document.querySelector('.kpi-row');
  if (kpiRow && !kpiRow.id) kpiRow.id = 'kpiRow';

  const barChart = document.querySelector('.bar-chart');
  if (barChart && !barChart.id) barChart.id = 'barChart';

  const resultList = document.querySelector('.result-list');
  if (resultList && !resultList.id) resultList.id = 'examList';

  const subList = document.querySelector('.submit-overview');
  if (subList && !subList.id) subList.id = 'subList';

  const dlList = document.querySelector('.deadline-list');
  if (dlList && !dlList.id) dlList.id = 'deadlineList';

  // Seg items
  const segs = document.querySelectorAll('.seg-val');
  const ids = ['segGood','segFair','segOk','segWarn'];
  segs.forEach((el, i) => { if (ids[i]) el.id = ids[i]; });
}

patchHTML();
renderPeriod(currentPeriod);
