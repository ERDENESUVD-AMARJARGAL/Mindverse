/* ══════════════════════════════════════
   Task Market — Student Logic
══════════════════════════════════════ */

/* ── LocalStorage helpers ── */
function getTasks() {
  return JSON.parse(localStorage.getItem('task_market') || '[]');
}
function saveTasks(tasks) {
  localStorage.setItem('task_market', JSON.stringify(tasks));
}
function getBalance() {
  return Number(localStorage.getItem('wallet_' + getMyId()) || 0);
}
function setBalance(val) {
  localStorage.setItem('wallet_' + getMyId(), Math.max(0, val));
}
function getMyId() {
  return sessionStorage.getItem('user_firstname') ||
         sessionStorage.getItem('user_name') || 'Сурагч';
}

/* ── Seed demo tasks (first run) ── */
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

/* ── Wallet render ── */
function renderWallet() {
  const bal  = getBalance();
  const myId = getMyId();
  const all  = getTasks().filter(t => t.studentId === myId);
  document.getElementById('walletBalance').textContent = '₮' + bal.toLocaleString();
  document.getElementById('walletPosted').textContent  = all.length;
  document.getElementById('walletClaimed').textContent = all.filter(t => t.status === 'claimed').length;
  const spent = all.reduce((s, t) => s + t.reward, 0);
  document.getElementById('walletSpent').textContent   = '₮' + spent.toLocaleString();
  const hint = document.getElementById('balanceHint');
  if (hint) hint.textContent = '(Үлдэгдэл: ₮' + bal.toLocaleString() + ')';
}

/* ── Charge modal ── */
function openChargeModal() {
  document.getElementById('chargeOverlay').classList.add('open');
}
function closeChargeModal() {
  document.getElementById('chargeOverlay').classList.remove('open');
  document.getElementById('chargeAmount').value = '';
  document.querySelectorAll('.tm-qa-btn').forEach(b => b.classList.remove('active'));
}
function setChargeAmount(val, btn) {
  document.getElementById('chargeAmount').value = val;
  document.querySelectorAll('.tm-qa-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}
function doCharge() {
  const raw = document.getElementById('chargeAmount').value;
  const amt = parseInt(raw);
  if (!amt || amt < 1000) { showToast('1,000₮-өөс их дүн оруулна уу', 'error'); return; }
  setBalance(getBalance() + amt);
  closeChargeModal();
  renderWallet();
  showToast('₮' + amt.toLocaleString() + ' амжилттай нэмэгдлээ!', 'success');
}

/* ── Difficulty selector ── */
let _postDiff = 'easy';
function selectDiff(btn) {
  _postDiff = btn.dataset.diff;
  document.querySelectorAll('.tm-diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ── Description counter ── */
function updateDescCounter() {
  const ta  = document.getElementById('postDesc');
  const el  = document.getElementById('descCounter');
  if (ta && el) el.textContent = ta.value.length + '/800';
}

/* ── Image attachment ── */
let _postImages = []; // array of {name, dataUrl}

function handleImgSelect(input) {
  Array.from(input.files).forEach(readImgFile);
  input.value = '';
}
function handleImgDrop(e) {
  e.preventDefault();
  document.getElementById('imgDropZone').classList.remove('drag-over');
  Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')).forEach(readImgFile);
}
function readImgFile(file) {
  if (_postImages.length >= 4) { showToast('Хамгийн ихдээ 4 зураг оруулна уу', 'error'); return; }
  if (file.size > 5 * 1024 * 1024) { showToast(file.name + ' — 5MB хэтэрсэн', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    _postImages.push({ name: file.name, dataUrl: e.target.result });
    renderImgPreview();
  };
  reader.readAsDataURL(file);
}
function renderImgPreview() {
  const box = document.getElementById('imgPreview');
  if (!box) return;
  box.innerHTML = _postImages.map((img, i) => `
    <div class="tm-img-thumb">
      <img src="${img.dataUrl}" alt="${escHtml(img.name)}">
      <button class="tm-img-thumb-del" onclick="removeImg(${i})">✕</button>
    </div>`).join('');
}
function removeImg(i) {
  _postImages.splice(i, 1);
  renderImgPreview();
}

/* ── Post task modal ── */
function openPostModal() {
  document.getElementById('postOverlay').classList.add('open');
  document.getElementById('postError').style.display = 'none';
  renderWallet();
}
function closePostModal() {
  document.getElementById('postOverlay').classList.remove('open');
  document.getElementById('postError').style.display = 'none';
  _postImages = [];
  _postDiff   = 'easy';
  ['postSubject','postTitle','postDesc','postReward'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.querySelectorAll('.tm-diff-btn').forEach((b,i) => b.classList.toggle('active', i===0));
  const prev = document.getElementById('imgPreview');
  if (prev) prev.innerHTML = '';
  const cnt = document.getElementById('descCounter');
  if (cnt) cnt.textContent = '0/800';
}
function submitTask() {
  const subject = document.getElementById('postSubject').value;
  const title   = document.getElementById('postTitle').value.trim();
  const desc    = document.getElementById('postDesc').value.trim();
  const reward  = parseInt(document.getElementById('postReward').value);
  const errEl   = document.getElementById('postError');

  if (!subject)                { showFieldError(errEl, 'Хичээл сонгоно уу'); return; }
  if (!title)                  { showFieldError(errEl, 'Гарчиг оруулна уу'); return; }
  if (!desc)                   { showFieldError(errEl, 'Бодлогоо тайлбарлана уу'); return; }
  if (!reward || reward < 500) { showFieldError(errEl, 'Урамшуулал ₮500-аас их байна'); return; }
  const bal = getBalance();
  if (reward > bal)            { showFieldError(errEl, 'Дансны үлдэгдэл хүрэлцэхгүй байна (₮' + bal.toLocaleString() + ')'); return; }

  const name = getMyId();
  const task = {
    id: 'task_' + Date.now(),
    studentId: name, studentName: name,
    subject, title, description: desc, reward,
    difficulty: _postDiff,
    images: [..._postImages],
    status: 'open', claimedBy: null, claimedAt: null,
    postedAt: Date.now()
  };

  setBalance(bal - reward);
  const tasks = getTasks();
  tasks.unshift(task);
  saveTasks(tasks);

  closePostModal();
  renderWallet();
  renderMyTasks();
  showToast('Даалгавар амжилттай нийтлэгдлээ!', 'success');
}

function showFieldError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}

/* ── My tasks rendering ── */
let myFilter = 'all';

function filterMyTasks(f, btn) {
  myFilter = f;
  document.querySelectorAll('.tm-tab-pills .tm-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMyTasks();
}

function renderMyTasks() {
  const myId    = getMyId();
  const all     = getTasks().filter(t => t.studentId === myId);
  const list    = myFilter === 'all' ? all : all.filter(t => t.status === myFilter);
  const grid    = document.getElementById('myTasksGrid');

  if (!list.length) {
    grid.innerHTML = `
      <div class="tm-empty">
        <i class="fas fa-inbox"></i>
        <p>${all.length ? 'Энэ ангилалд нийтлэл байхгүй байна' : 'Та одоогоор даалгавар нийтлээгүй байна'}</p>
        <button class="tm-post-btn-sm" onclick="openPostModal()"><i class="fas fa-plus"></i> Нийтлэх</button>
      </div>`;
    return;
  }
  grid.innerHTML = list.map(t => buildStudentCard(t)).join('');
}

const DIFF_LABEL = { easy:'Хялбар', medium:'Дунд', hard:'Хэцүү' };

function buildStudentCard(t) {
  const isClaimed = t.status === 'claimed';
  const diff = t.difficulty || 'easy';
  const imgsHtml = t.images && t.images.length
    ? `<div class="tm-task-images">${t.images.map(img =>
        `<img class="tm-task-img" src="${img.dataUrl}" alt="" onclick="openLightbox('${img.dataUrl}')">`
      ).join('')}</div>` : '';
  return `
    <div class="tm-task-card ${isClaimed ? 'claimed' : 'open'}">
      <div class="tm-task-card-top">
        <span class="tm-subject-badge">${escHtml(t.subject)}</span>
        <div style="display:flex;gap:5px;align-items:center">
          <span class="tm-diff-badge ${diff}">${DIFF_LABEL[diff]}</span>
          <span class="tm-status-badge ${isClaimed ? 'badge-claimed' : 'badge-open'}">
            <i class="fas fa-${isClaimed ? 'lock' : 'circle'}"></i>
            ${isClaimed ? 'Авсан' : 'Нээлттэй'}
          </span>
        </div>
      </div>
      <div class="tm-task-title">${escHtml(t.title)}</div>
      <div class="tm-task-desc">${escHtml(t.description)}</div>
      ${imgsHtml}
      <div class="tm-task-footer">
        <div class="tm-task-meta">
          <span><i class="fas fa-clock"></i>${timeAgo(t.postedAt)}</span>
          ${isClaimed
            ? `<span style="color:#059669;font-weight:600"><i class="fas fa-chalkboard-teacher"></i>${escHtml(t.claimedBy)} авлаа</span>`
            : ''}
        </div>
        <div class="tm-reward-badge ${isClaimed ? 'earned' : ''}">
          <i class="fas fa-coins"></i>₮${t.reward.toLocaleString()}
        </div>
      </div>
    </div>`;
}

/* ── Lightbox ── */
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

/* ── Shared utilities ── */
function timeAgo(ts) {
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
  el.className = 'tm-toast tm-toast-' + type + ' show';
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ── Init ── */
renderWallet();
renderMyTasks();
