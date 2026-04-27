/* ══════════════════════════════════════
   Task Market — Teacher Logic
══════════════════════════════════════ */

function getTasks() {
  return JSON.parse(localStorage.getItem('task_market') || '[]');
}
function saveTasks(tasks) {
  localStorage.setItem('task_market', JSON.stringify(tasks));
}
function getMyName() {
  return sessionStorage.getItem('user_firstname') ||
         sessionStorage.getItem('user_name') || 'Багш';
}

/* ── Seed demo tasks if not seeded ── */
(function seedDemoTasks() {
  if (localStorage.getItem('task_market_seeded')) return;
  const demo = [
    {
      id: 'demo_1', studentId: 'Энхбаяр', studentName: 'Энхбаяр',
      subject: 'Алгебр', title: 'Квадрат функцийн оргил цэгийг олох',
      description: 'f(x) = -2x² + 8x - 3 функцийн оргил цэгийн координатыг олохыг ойлгохгүй байна. Томъёогоор ч, график байгуулж ч үзсэн ч болохгүй байна.',
      reward: 3000, status: 'open', claimedBy: null, claimedAt: null, postedAt: Date.now() - 1800000
    },
    {
      id: 'demo_2', studentId: 'Номин', studentName: 'Номин',
      subject: 'Геометр', title: 'Теорем Пифагорыг нотлох',
      description: 'Теорем Пифагорыг геометрийн аргаар нотлох шаардлагатай байна. Зурагтай дэлгэрэнгүй тайлбар хэрэгтэй байна.',
      reward: 5000, status: 'open', claimedBy: null, claimedAt: null, postedAt: Date.now() - 3600000
    },
    {
      id: 'demo_3', studentId: 'Болдбаатар', studentName: 'Болдбаатар',
      subject: 'Тригонометр', title: 'sin(α+β) томъёоны гаралт',
      description: 'Нэмэх томъёо sin(α+β) = sinα·cosβ + cosα·sinβ яагаад ийм болдгийг ойлгохгүй байна. Нотолгоог алхам алхмаар тайлбарлаж өгнө үү.',
      reward: 4000, status: 'open', claimedBy: null, claimedAt: null, postedAt: Date.now() - 7200000
    },
    {
      id: 'demo_4', studentId: 'Сарнай', studentName: 'Сарнай',
      subject: 'C++ програмчлал', title: 'Рекурс функц ойлгохгүй байна',
      description: 'Факториал тооцоолох рекурс функц бичихийг хичээж байна. Яагаад давтан дуудагддагийг ойлгохгүй байна. Жишээгээр тайлбарлана уу.',
      reward: 6000, status: 'open', claimedBy: null, claimedAt: null, postedAt: Date.now() - 10800000
    },
  ];
  saveTasks(demo);
  localStorage.setItem('task_market_seeded', '1');
})();

/* ── Subject filter ── */
let currentSubject = 'all';

function filterBySubject(s, btn) {
  currentSubject = s;
  document.querySelectorAll('#subjectFilter .tm-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMarket();
}

function buildSubjectFilters() {
  const subjects = [...new Set(getTasks().map(t => t.subject))].sort();
  const wrap = document.getElementById('subjectFilter');
  // Remove old subject buttons (keep first "Бүгд" button)
  wrap.querySelectorAll('.tm-pill:not(:first-child)').forEach(b => b.remove());
  subjects.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'tm-pill';
    btn.textContent = s;
    btn.onclick = () => filterBySubject(s, btn);
    wrap.appendChild(btn);
  });
}

/* ── Render market ── */
function renderMarket() {
  const me   = getMyName();
  const all  = getTasks();

  // Update subject filters
  buildSubjectFilters();
  // Re-apply active class after rebuild
  document.querySelectorAll('#subjectFilter .tm-pill').forEach(btn => {
    const isAll = btn.textContent === 'Бүгд';
    if ((currentSubject === 'all' && isAll) ||
        btn.textContent === currentSubject) {
      btn.classList.add('active');
    }
  });

  // Stats
  const openTotal = all.filter(t => t.status === 'open').length;
  const myClaimed = all.filter(t => t.claimedBy === me);
  document.getElementById('openCount').textContent      = openTotal;
  document.getElementById('myClaimedCount').textContent = myClaimed.length;

  // Filtered list
  let displayed = currentSubject === 'all' ? all : all.filter(t => t.subject === currentSubject);
  // Sort: open first, then by recency
  displayed = displayed.slice().sort((a, b) => {
    if (a.status === b.status) return b.postedAt - a.postedAt;
    return a.status === 'open' ? -1 : 1;
  });

  // Market grid
  const grid = document.getElementById('marketGrid');
  if (!displayed.length) {
    grid.innerHTML = `<div class="tm-empty"><i class="fas fa-inbox"></i><p>Одоогоор нийтэлсэн даалгавар байхгүй байна</p></div>`;
  } else {
    grid.innerHTML = displayed.map(t => buildMarketCard(t, me)).join('');
  }

  // My claimed grid
  const myGrid = document.getElementById('myClaimedGrid');
  if (!myClaimed.length) {
    myGrid.innerHTML = `<div class="tm-empty"><i class="fas fa-hand-pointer" style="font-size:28px"></i><p>Та одоогоор даалгавар аваагүй байна</p></div>`;
  } else {
    myGrid.innerHTML = myClaimed
      .slice().sort((a, b) => b.claimedAt - a.claimedAt)
      .map(t => buildClaimedCard(t)).join('');
  }
}

/* ── Card builders ── */
const DIFF_LABEL = { easy:'Хялбар', medium:'Дунд', hard:'Хэцүү' };

function buildMarketCard(t, me) {
  const isClaimed = t.status === 'claimed';
  const isMyOwn   = t.claimedBy === me;
  const diff = t.difficulty || 'easy';
  const imgsHtml = t.images && t.images.length
    ? `<div class="tm-task-images">${t.images.map(img =>
        `<img class="tm-task-img" src="${img.dataUrl}" alt="" onclick="openLightbox('${img.dataUrl}')">`
      ).join('')}</div>` : '';

  let actionHtml;
  if (!isClaimed) {
    actionHtml = `<button class="tm-claim-btn" onclick="claimTask('${t.id}')">
      <i class="fas fa-hand-pointer"></i> Авах
    </button>`;
  } else if (isMyOwn) {
    actionHtml = `<span class="tm-mine-badge"><i class="fas fa-check-circle"></i>Та авсан</span>`;
  } else {
    actionHtml = `<span class="tm-claimed-badge"><i class="fas fa-lock"></i>${escHtml(t.claimedBy)} авсан</span>`;
  }

  return `
    <div class="tm-task-card market-card ${isClaimed ? 'claimed' : 'open'}">
      <div class="tm-task-card-top">
        <span class="tm-subject-badge">${escHtml(t.subject)}</span>
        <div style="display:flex;gap:5px;align-items:center">
          <span class="tm-diff-badge ${diff}">${DIFF_LABEL[diff]}</span>
          <div class="tm-reward-badge"><i class="fas fa-coins"></i>₮${t.reward.toLocaleString()}</div>
        </div>
      </div>
      <div class="tm-task-title">${escHtml(t.title)}</div>
      <div class="tm-task-desc">${escHtml(t.description)}</div>
      ${imgsHtml}
      <div class="tm-task-footer">
        <div class="tm-task-meta">
          <span><i class="fas fa-user-graduate"></i>${escHtml(t.studentName)}</span>
          <span><i class="fas fa-clock"></i>${timeAgo(t.postedAt)}</span>
        </div>
        ${actionHtml}
      </div>
    </div>`;
}

function openLightbox(src) {
  let lb = document.getElementById('tmLightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'tmLightbox'; lb.className = 'tm-lightbox';
    lb.innerHTML = `<button class="tm-lightbox-close" onclick="closeLightbox()">✕</button><img id="tmLbImg">`;
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.body.appendChild(lb);
  }
  document.getElementById('tmLbImg').src = src;
  lb.classList.add('open');
}
function closeLightbox() {
  const lb = document.getElementById('tmLightbox');
  if (lb) lb.classList.remove('open');
}

function buildClaimedCard(t) {
  return `
    <div class="tm-task-card claimed">
      <div class="tm-task-card-top">
        <span class="tm-subject-badge">${escHtml(t.subject)}</span>
        <div class="tm-reward-badge earned">
          <i class="fas fa-coins"></i>₮${t.reward.toLocaleString()}
        </div>
      </div>
      <div class="tm-task-title">${escHtml(t.title)}</div>
      <div class="tm-task-desc">${escHtml(t.description)}</div>
      <div class="tm-task-footer">
        <div class="tm-task-meta">
          <span><i class="fas fa-user-graduate"></i>${escHtml(t.studentName)}</span>
          <span><i class="fas fa-clock"></i>${timeAgo(t.claimedAt)}</span>
        </div>
        <span class="tm-mine-badge"><i class="fas fa-check-circle"></i>Миний даалгавар</span>
      </div>
    </div>`;
}

/* ── Claim a task ── */
function claimTask(id) {
  const me    = getMyName();
  const tasks = getTasks();
  const task  = tasks.find(t => t.id === id);

  if (!task) { showToast('Даалгавар олдсонгүй', 'error'); return; }
  if (task.status !== 'open') {
    showToast('Энэ даалгаврыг өөр багш аваачсан байна', 'error');
    renderMarket();
    return;
  }

  task.status    = 'claimed';
  task.claimedBy = me;
  task.claimedAt = Date.now();
  saveTasks(tasks);
  renderMarket();
  showToast('Даалгавар авлаа! Сурагчид хариу өгнө үү 👍', 'success');
}

/* ── Utilities ── */
function timeAgo(ts) {
  if (!ts) return '—';
  const d = Date.now() - ts;
  if (d < 60000)    return 'Дөнгөж';
  if (d < 3600000)  return Math.floor(d / 60000) + ' минутын өмнө';
  if (d < 86400000) return Math.floor(d / 3600000) + ' цагийн өмнө';
  return Math.floor(d / 86400000) + ' өдрийн өмнө';
}

function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function showToast(msg, type) {
  let el = document.getElementById('tmToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'tmToast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className   = 'tm-toast tm-toast-' + type + ' show';
  setTimeout(() => el.classList.remove('show'), 3200);
}

/* ── Poll for new tasks every 5s (simulate real-time) ── */
setInterval(renderMarket, 5000);

/* ── Init ── */
renderMarket();
