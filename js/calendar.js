const TODAY = new Date(2026, 3, 19); // April 19 2026 (demo)

const MN_MONTHS = ['1-р сар','2-р сар','3-р сар','4-р сар','5-р сар','6-р сар','7-р сар','8-р сар','9-р сар','10-р сар','11-р сар','12-р сар'];
const MN_DAYS_SHORT = ['Да','Мя','Лх','Пү','Ба','Бя','Ня'];
const MN_DAYS_FULL  = ['Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба','Ням'];

const EVENTS = [
  // April 2026
  { date:'2026-04-22', type:'exam',       title:'Алгебрийн дундын шалгалт',      subject:'Алгебр',       color:'#3b82f6', time:'10:00', duration:'45 мин', questions:20 },
  { date:'2026-04-22', type:'assignment', title:'Квадрат тэгшитгэл – ГД',         subject:'Алгебр',       color:'#3b82f6', daysLeft:3,  urgent:true },
  { date:'2026-04-23', type:'assignment', title:'Функцийн утга – ГД',              subject:'Алгебр',       color:'#3b82f6', daysLeft:4 },
  { date:'2026-04-24', type:'assignment', title:'Теорем нотлох – ГД',              subject:'Геометр',      color:'#10b981', daysLeft:5 },
  { date:'2026-04-25', type:'exam',       title:'Геометрийн шалгалт',             subject:'Геометр',      color:'#10b981', time:'09:00', duration:'30 мин', questions:15 },
  { date:'2026-04-28', type:'assignment', title:'Векторын тооцоо – Бие даалт',    subject:'Геометр',      color:'#10b981', daysLeft:9 },
  { date:'2026-04-29', type:'assignment', title:'Давхардлын томъёо – ГД',          subject:'Тригонометр',  color:'#f59e0b', daysLeft:10 },
  { date:'2026-04-30', type:'exam',       title:'Физикийн явцын шалгалт',          subject:'Физик',        color:'#8b5cf6', time:'14:00', duration:'40 мин', questions:18 },
  { date:'2026-04-30', type:'assignment', title:'Хүч ба энерги – Нэмэлт дасгал', subject:'Физик',        color:'#8b5cf6', daysLeft:11 },
  // May 2026
  { date:'2026-05-10', type:'exam',       title:'Алгебрийн 2-р улирлын шалгалт', subject:'Алгебр',       color:'#3b82f6', time:'10:00', duration:'60 мин', questions:30 },
  { date:'2026-05-12', type:'assignment', title:'График байгуулах',               subject:'Тригонометр',  color:'#f59e0b', daysLeft:23 },
  { date:'2026-05-12', type:'exam',       title:'Геометрийн 2-р улирлын шалгалт',subject:'Геометр',      color:'#10b981', time:'09:00', duration:'60 мин', questions:30 },
  { date:'2026-05-14', type:'exam',       title:'Физикийн 2-р улирлын шалгалт',  subject:'Физик',        color:'#8b5cf6', time:'14:00', duration:'60 мин', questions:30 },
  { date:'2026-05-16', type:'exam',       title:'Химийн 2-р улирлын шалгалт',    subject:'Хими',         color:'#f59e0b', time:'10:00', duration:'60 мин', questions:30 },
];

let curYear  = TODAY.getFullYear();
let curMonth = TODAY.getMonth();
let selDate  = null;

function pad2(n) { return String(n).padStart(2,'0'); }
function mkDate(y, m, d) { return `${y}-${pad2(m+1)}-${pad2(d)}`; }
function getEvs(ds) { return EVENTS.filter(e => e.date === ds); }

function renderCalendar() {
  document.getElementById('calMonthLabel').textContent = `${curYear} оны ${MN_MONTHS[curMonth]}`;

  const firstDay     = new Date(curYear, curMonth, 1).getDay();
  const daysInMonth  = new Date(curYear, curMonth + 1, 0).getDate();
  const prevDays     = new Date(curYear, curMonth, 0).getDate();
  const offset       = (firstDay + 6) % 7; // Mon-based

  const todayStr = mkDate(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
  let html = '';

  // Prev month filler
  for (let i = offset - 1; i >= 0; i--) {
    const d  = prevDays - i;
    const pm = curMonth === 0 ? 11 : curMonth - 1;
    const py = curMonth === 0 ? curYear - 1 : curYear;
    html += `<div class="cal-cell cal-other"><div class="cal-date-num">${d}</div></div>`;
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const ds  = mkDate(curYear, curMonth, d);
    const evs = getEvs(ds);
    const cls = ['cal-cell',
      ds === todayStr  ? 'cal-today'    : '',
      ds === selDate   ? 'cal-selected' : '',
    ].filter(Boolean).join(' ');

    const dots = evs.slice(0,4).map(e =>
      `<div class="cal-dot" style="background:${e.color}"></div>`
    ).join('');

    html += `<div class="${cls}" data-date="${ds}" onclick="selectDay('${ds}')">
      <div class="cal-date-num">${d}</div>
      ${dots ? `<div class="cal-dots">${dots}</div>` : ''}
    </div>`;
  }

  // Next month filler
  const filled  = offset + daysInMonth;
  const tail    = filled % 7 === 0 ? 0 : 7 - (filled % 7);
  for (let d = 1; d <= tail; d++) {
    html += `<div class="cal-cell cal-other"><div class="cal-date-num">${d}</div></div>`;
  }

  document.getElementById('calGrid').innerHTML = html;
  updateStats();
  renderUpcoming();
}

function selectDay(ds) {
  selDate = ds;
  renderCalendar();

  const date = new Date(ds + 'T00:00:00');
  const evs  = getEvs(ds);
  const dow  = MN_DAYS_FULL[(date.getDay() + 6) % 7];
  const d    = date.getDate();
  const m    = MN_MONTHS[date.getMonth()];

  document.getElementById('calDetailHead').innerHTML = `
    <div class="cal-detail-date-box">
      <div class="cal-dnum">${d}</div>
      <div class="cal-dmonth">${m}</div>
    </div>
    <div class="cal-detail-info">
      <h4>${dow}</h4>
      <p>${evs.length ? evs.length + ' үйл явдал' : 'Чөлөөтэй өдөр'}</p>
    </div>`;

  document.getElementById('calEventList').innerHTML = evs.length
    ? evs.map(renderEventItem).join('')
    : `<div class="cal-no-events"><i class="fas fa-check-circle"></i><p>Энэ өдөр тэмдэглэгдсэн зүйл байхгүй байна</p></div>`;
}

function renderEventItem(e) {
  const isExam  = e.type === 'exam';
  const icon    = isExam ? 'fa-pen-square' : 'fa-tasks';
  const badgeCls= e.urgent ? 'urgent' : e.type;
  const badgeTxt= e.urgent ? '🔥 Яаралтай' : isExam ? '📝 Шалгалт' : '📋 Даалгавар';
  const meta    = isExam
    ? `<span><i class="fas fa-clock" style="margin-right:3px;color:${e.color}"></i>${e.time || '—'}</span>
       <span>${e.duration}</span>
       <span>${e.questions} асуулт</span>`
    : `<span><i class="fas fa-book" style="margin-right:3px;color:${e.color}"></i>${e.subject}</span>
       ${e.daysLeft <= 0 ? '<span style="color:#ef4444;font-weight:700">Хоцорсон</span>'
                         : `<span>${e.daysLeft} өдөр үлдсэн</span>`}`;

  return `<div class="cal-event-item" style="--ec:${e.color}">
    <div class="cal-event-icon" style="background:${e.color}22;color:${e.color}">
      <i class="fas ${icon}"></i>
    </div>
    <div class="cal-event-body">
      <div class="cal-event-title">${e.title}</div>
      <div class="cal-event-meta">${meta}</div>
    </div>
    <span class="cal-event-badge ${badgeCls}">${badgeTxt}</span>
  </div>`;
}

function updateStats() {
  const evs     = EVENTS.filter(e => {
    const d = new Date(e.date + 'T00:00:00');
    return d.getFullYear() === curYear && d.getMonth() === curMonth;
  });
  document.getElementById('calStatExams').textContent   = evs.filter(e => e.type === 'exam').length;
  document.getElementById('calStatAssigns').textContent = evs.filter(e => e.type === 'assignment').length;
  document.getElementById('calStatUrgent').textContent  = evs.filter(e => e.urgent).length;
}

function renderUpcoming() {
  const todayStr = mkDate(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
  const upcoming = EVENTS
    .filter(e => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  document.getElementById('calUpcoming').innerHTML = upcoming.length
    ? upcoming.map(e => {
        const diff = Math.round((new Date(e.date + 'T00:00:00') - new Date(todayStr + 'T00:00:00')) / 86400000);
        const dayCls = diff <= 3 ? 'soon' : diff <= 7 ? 'medium' : 'ok';
        const dayTxt = diff === 0 ? 'Өнөөдөр' : diff + ' өдөр';
        return `<div class="cal-up-item">
          <div class="cal-up-dot" style="background:${e.color}"></div>
          <div class="cal-up-body">
            <div class="cal-up-title">${e.title}</div>
            <div class="cal-up-sub">${e.subject} · ${e.type === 'exam' ? 'Шалгалт' : 'Даалгавар'}</div>
          </div>
          <span class="cal-up-days ${dayCls}">${dayTxt}</span>
        </div>`;
      }).join('')
    : '<div class="cal-no-events"><i class="fas fa-check"></i><p>Ойрын хуваарь байхгүй</p></div>';
}

function prevMonth() {
  curMonth--; if (curMonth < 0) { curMonth = 11; curYear--; }
  selDate = null; renderCalendar(); resetDetail();
}
function nextMonth() {
  curMonth++; if (curMonth > 11) { curMonth = 0; curYear++; }
  selDate = null; renderCalendar(); resetDetail();
}
function resetDetail() {
  document.getElementById('calDetailHead').innerHTML = `
    <div class="cal-detail-date-box" style="background:linear-gradient(135deg,#94a3b8,#64748b)">
      <div class="cal-dnum" style="font-size:14px"><i class="fas fa-hand-pointer"></i></div>
    </div>
    <div class="cal-detail-info">
      <h4>Өдөр сонгоно уу</h4>
      <p>Хуваарийг харахын тулд өдөрт дарна уу</p>
    </div>`;
  document.getElementById('calEventList').innerHTML =
    `<div class="cal-no-events"><i class="fas fa-calendar"></i><p>Харахыг хүсэж буй өдрийг дарна уу</p></div>`;
}

// Init — auto-select today
renderCalendar();
selectDay(mkDate(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()));
