const PALETTE = [
  { bg: '#dbeafe', tc: '#1d4ed8', btn: '#3b82f6', tag: '#eff6ff', tagTc: '#1d4ed8' },
  { bg: '#d1fae5', tc: '#065f46', btn: '#10b981', tag: '#f0fdf4', tagTc: '#065f46' },
  { bg: '#fef3c7', tc: '#92400e', btn: '#f59e0b', tag: '#fffbeb', tagTc: '#b45309' },
  { bg: '#ede9fe', tc: '#5b21b6', btn: '#8b5cf6', tag: '#f5f3ff', tagTc: '#5b21b6' },
  { bg: '#fee2e2', tc: '#991b1b', btn: '#ef4444', tag: '#fef2f2', tagTc: '#dc2626' },
  { bg: '#cffafe', tc: '#164e63', btn: '#06b6d4', tag: '#ecfeff', tagTc: '#0e7490' },
  { bg: '#fce7f3', tc: '#831843', btn: '#ec4899', tag: '#fdf2f8', tagTc: '#9d174d' },
  { bg: '#d1fae5', tc: '#064e3b', btn: '#059669', tag: '#ecfdf5', tagTc: '#065f46' },
];

function buildClassColors(students) {
  const map = {};
  let i = 0;
  students.forEach(s => {
    if (!map[s.cls]) { map[s.cls] = PALETTE[i % PALETTE.length]; i++; }
  });
  return map;
}

let CLASS_COLORS = {};

const ALL_STUDENTS = [
  { name: 'Болд Бат',        cls: '10А', exams: 4, assigns: 5, score: 92 },
  { name: 'Сарнай Гантулга', cls: '10А', exams: 4, assigns: 5, score: 87 },
  { name: 'Анхбаяр',         cls: '10А', exams: 4, assigns: 4, score: 81 },
  { name: 'Мөнхбаяр',        cls: '10А', exams: 3, assigns: 4, score: 74 },
  { name: 'Цэцэгмаа',        cls: '10А', exams: 3, assigns: 3, score: 63 },
  { name: 'Ариунболд',       cls: '10А', exams: 4, assigns: 5, score: 88 },
  { name: 'Дэлгэрмаа',       cls: '10А', exams: 3, assigns: 4, score: 76 },
  { name: 'Батзориг',        cls: '10А', exams: 4, assigns: 3, score: 69 },
  { name: 'Оюунцэцэг',       cls: '10А', exams: 2, assigns: 3, score: 55 },
  { name: 'Номин Цэцэг',     cls: '9Б',  exams: 3, assigns: 4, score: 88 },
  { name: 'Баярмаа',         cls: '9Б',  exams: 2, assigns: 3, score: 77 },
  { name: 'Сувд',            cls: '9Б',  exams: 2, assigns: 4, score: 72 },
  { name: 'Ундрал',          cls: '9Б',  exams: 2, assigns: 2, score: 65 },
  { name: 'Дорж',            cls: '9Б',  exams: 3, assigns: 4, score: 80 },
  { name: 'Энхтуяа',         cls: '9Б',  exams: 2, assigns: 3, score: 58 },
  { name: 'Мөнгөнцэцэг',    cls: '9Б',  exams: 3, assigns: 4, score: 84 },
  { name: 'Батбаяр',         cls: '9Б',  exams: 1, assigns: 2, score: 51 },
  { name: 'Гэрэлмаа',        cls: '11А', exams: 2, assigns: 3, score: 85 },
  { name: 'Нарантуяа',       cls: '11А', exams: 2, assigns: 3, score: 79 },
  { name: 'Энхбаяр',         cls: '11А', exams: 2, assigns: 2, score: 76 },
  { name: 'Дулгуун',         cls: '11А', exams: 2, assigns: 3, score: 61 },
  { name: 'Лхагвасүрэн',    cls: '11А', exams: 2, assigns: 2, score: 73 },
  { name: 'Алтанцэцэг',     cls: '11А', exams: 1, assigns: 2, score: 57 },
  { name: 'Алтантуяа',       cls: '8В',  exams: 1, assigns: 2, score: 73 },
  { name: 'Оюунчимэг',       cls: '8В',  exams: 1, assigns: 2, score: 68 },
  { name: 'Мөнхзул',         cls: '8В',  exams: 1, assigns: 1, score: 65 },
  { name: 'Төгөлдөр',        cls: '8В',  exams: 1, assigns: 2, score: 54 },
  { name: 'Ганзориг',        cls: '8В',  exams: 1, assigns: 2, score: 60 },
  { name: 'Батсүх',          cls: '8В',  exams: 1, assigns: 1, score: 47 },
];

// class metadata for left panel cards
const CLASS_META = {
  '10А': { subject: 'Алгебр',       avg: '84%', avgCls: 'good' },
  '9Б':  { subject: 'Геометр',      avg: '71%', avgCls: 'mid'  },
  '11А': { subject: 'Тригонометр',  avg: '79%', avgCls: 'good' },
  '8В':  { subject: 'Арифметик',    avg: '62%', avgCls: 'low'  },
};
const AVG_COLORS = {
  good: { bg: '#d1fae5', tc: '#065f46' },
  mid:  { bg: '#fef3c7', tc: '#92400e' },
  low:  { bg: '#fee2e2', tc: '#991b1b' },
};

const selectedClasses = new Set();
let searchTerm = '';
let sortKey    = 'score-desc';

function scoreClass(s) { return s >= 80 ? 'score-high' : s >= 65 ? 'score-mid' : 'score-low'; }
function barClass(s)   { return s >= 80 ? 'bar-high'   : s >= 65 ? 'bar-mid'   : 'bar-low';   }
function rankClass(r)  { return r === 1 ? 'rank-1' : r === 2 ? 'rank-2' : r === 3 ? 'rank-3' : 'rank-n'; }

function renderTable() {
  let data = ALL_STUDENTS.filter(s => {
    const matchClass  = selectedClasses.size === 0 || selectedClasses.has(s.cls);
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  if (sortKey === 'score-desc') data.sort((a, b) => b.score - a.score);
  else if (sortKey === 'score-asc') data.sort((a, b) => a.score - b.score);
  else if (sortKey === 'name-asc') data.sort((a, b) => a.name.localeCompare(b.name, 'mn'));
  else if (sortKey === 'class') data.sort((a, b) => a.cls.localeCompare(b.cls));

  const tbody  = document.getElementById('studentTableBody');
  const noRes  = document.getElementById('noResults');
  const cntEl  = document.getElementById('rpCountNum');
  if (cntEl) cntEl.textContent = data.length;

  if (!data.length) {
    tbody.innerHTML = '';
    noRes.style.display = '';
    return;
  }
  noRes.style.display = 'none';

  tbody.innerHTML = data.map((s, i) => {
    const c   = CLASS_COLORS[s.cls] || { bg: '#f1f5f9', tc: '#475569', tag: '#f1f5f9', tagTc: '#475569' };
    const av  = s.name.charAt(0).toUpperCase();
    const sc  = scoreClass(s.score);
    const bc  = barClass(s.score);
    const rk  = i + 1;
    const rkC = rankClass(rk);
    const rkL = rk <= 3 ? (rk === 1 ? '🥇' : rk === 2 ? '🥈' : '🥉') : rk;
    return `
    <tr>
      <td><div class="rank-badge ${rkC}">${rkL}</div></td>
      <td>
        <div class="st-name-cell">
          <div class="st-av" style="background:${c.bg};color:${c.tc}">${av}</div>
          <div>
            <div class="st-name">${s.name}</div>
            <div class="st-email">${s.name.toLowerCase().replace(/ /g,'')}@school.edu</div>
          </div>
        </div>
      </td>
      <td><span class="class-tag" style="background:${c.tag};color:${c.tagTc}">${s.cls} анги</span></td>
      <td><span style="font-weight:600">${s.exams}</span> <span style="color:#94a3b8;font-size:12px">шалгалт</span></td>
      <td><span style="font-weight:600">${s.assigns}</span> <span style="color:#94a3b8;font-size:12px">даалгавар</span></td>
      <td class="score-cell">
        <div class="score-val ${sc}">${s.score}%</div>
        <div class="score-bar-wrap">
          <div class="score-bar-track">
            <div class="score-bar-fill ${bc}" style="width:${s.score}%"></div>
          </div>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function filterStudents() {
  searchTerm = document.getElementById('searchInput').value;
  renderTable();
}
function sortStudents(val) {
  sortKey = val;
  renderTable();
}

function buildClassFilterCards() {
  const wrap = document.getElementById('classFilterCards');

  // Collect class counts
  const classMap = {};
  ALL_STUDENTS.forEach(s => { classMap[s.cls] = (classMap[s.cls] || 0) + 1; });

  // ── "Бүгд" card ──
  const allCard = document.createElement('div');
  allCard.className = 'cls-filter-card cls-filter-all active';
  allCard.style.setProperty('--cls-color', '#07437d');
  allCard.innerHTML = `
    <div class="cls-fc-icon" style="background:rgba(255,255,255,.2);color:#fff">
      <i class="fas fa-layer-group"></i>
    </div>
    <div class="cls-fc-info">
      <div class="cls-fc-name">
        Бүх анги
        <div class="cls-fc-check" style="border-color:rgba(255,255,255,.4);background:rgba(255,255,255,.2);color:#fff"><i class="fas fa-check"></i></div>
      </div>
      <div class="cls-fc-meta">
        <span><i class="fas fa-users" style="margin-right:3px"></i>${ALL_STUDENTS.length} сурагч</span>
        <span><i class="fas fa-layer-group" style="margin-right:3px"></i>${Object.keys(classMap).length} анги</span>
      </div>
    </div>`;
  allCard.addEventListener('click', () => {
    selectedClasses.clear();
    wrap.querySelectorAll('.cls-filter-card').forEach(c => c.classList.remove('active'));
    allCard.classList.add('active');
    renderTable();
  });
  wrap.appendChild(allCard);

  // ── Per-class cards ──
  Object.entries(classMap).forEach(([cls, count]) => {
    const c    = CLASS_COLORS[cls] || PALETTE[0];
    const meta = CLASS_META[cls] || { subject: '', avg: '—', avgCls: 'mid' };
    const avgC = AVG_COLORS[meta.avgCls];

    const card = document.createElement('div');
    card.className = 'cls-filter-card';
    card.style.setProperty('--cls-color', c.btn);
    card.innerHTML = `
      <div class="cls-fc-icon" style="background:${c.bg};color:${c.tc}">${cls.charAt(0)}</div>
      <div class="cls-fc-info">
        <div class="cls-fc-name">
          ${cls} анги
          <div class="cls-fc-check"><i class="fas fa-check"></i></div>
        </div>
        <div class="cls-fc-meta">
          <span><i class="fas fa-users" style="margin-right:3px"></i>${count}</span>
          <span style="background:${avgC.bg};color:${avgC.tc};padding:1px 7px;border-radius:20px;font-weight:700">${meta.avg}</span>
        </div>
      </div>`;

    card.addEventListener('click', () => {
      if (selectedClasses.has(cls)) {
        selectedClasses.delete(cls);
        card.classList.remove('active');
      } else {
        selectedClasses.add(cls);
        card.classList.add('active');
        allCard.classList.remove('active');
      }
      if (selectedClasses.size === 0) allCard.classList.add('active');
      renderTable();
    });
    wrap.appendChild(card);
  });
}

// ── Init ──
CLASS_COLORS = buildClassColors(ALL_STUDENTS);
buildClassFilterCards();
renderTable();
