/* ── Avatar helpers ── */
function getAvatarKey() {
  return 'avatar_' + (sessionStorage.getItem('user_name') || 'user');
}
function loadAvatar() {
  const saved = localStorage.getItem(getAvatarKey());
  const img = document.getElementById('avatarImg');
  if (saved && img) img.src = saved;
}
function setupAvatarChange() {
  const btn   = document.getElementById('avatarEditBtn');
  const input = document.getElementById('avatarInput');
  const img   = document.getElementById('avatarImg');
  if (!btn || !input) return;
  btn.addEventListener('click', () => input.click());
  img.addEventListener('click', () => input.click());
  img.style.cursor = 'pointer';
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Файлын хэмжээ 5MB-аас хэтрэхгүй байна'); return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const data = e.target.result;
      img.src = data;
      localStorage.setItem(getAvatarKey(), data);
      // Update sidebar avatar too
      const sbImg = document.getElementById('sbAvatarImg');
      if (sbImg) sbImg.src = data;
      // Show success feedback
      btn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => { btn.innerHTML = '<i class="fas fa-camera"></i>'; }, 2000);
    };
    reader.readAsDataURL(file);
  });
}

// ── Fill user info from sessionStorage ──
(function () {
  const lastname  = sessionStorage.getItem('user_lastname')  || '';
  const firstname = sessionStorage.getItem('user_firstname') || '';
  const name      = sessionStorage.getItem('user_name')      || 'Сурагч';
  const email     = sessionStorage.getItem('user_email')     || '—';
  const role      = sessionStorage.getItem('user_role');
  document.getElementById('profileName').textContent      = name;
  document.getElementById('profileLastName').textContent  = lastname  || '—';
  document.getElementById('profileFirstName').textContent = firstname || '—';
  document.getElementById('profileEmail').textContent     = email;
  document.getElementById('profileRole').textContent      =
    role === 'teacher' ? 'Багш' : 'Сурагч';
})();

// ── Course progress from localStorage ──
const courses = [
  "Анхан шатны Алгебр", "Геометрийн үндэс", "C++ програмчлалын эхлэл",
  "UI/UX дизайн", "Өгөгдлийн шинжилгээ", "Тригонометрийн үндэс",
  "Комбинаторикийн эхлэл", "Арифметик — Анхан шат", "Тооны онолын оршил"
];

const progList = document.getElementById('progressList');
courses.forEach(title => {
  const pct = parseInt(localStorage.getItem('progress_' + title) || '0');
  progList.innerHTML += `
    <div class="prog-item">
      <div class="prog-header"><span>${title}</span><span>${pct}%</span></div>
      <div class="prog-track"><div class="prog-fill" style="width:${pct}%"></div></div>
    </div>`;
});

// ── Exam results from localStorage ──
const examNames = [
  "Алгебрийн шалгалт","Геометрийн шалгалт","Тригонометрийн шалгалт",
  "Арифметикийн шалгалт","Комбинаторикийн шалгалт","Тооны онолын шалгалт"
];

const examResults = document.getElementById('examResults');
let taken = 0, total = 0;

examNames.forEach((name, i) => {
  const score = localStorage.getItem('exam_score_' + i);
  if (score === null) return;
  taken++;
  total += parseInt(score);
  const cls  = score >= 80 ? 'score-high' : score >= 60 ? 'score-mid' : 'score-low';
  examResults.innerHTML += `
    <div class="exam-row">
      <div>
        <div class="exam-row-title">${name}</div>
        <div class="exam-row-meta">Дуусгасан</div>
      </div>
      <span class="score-pill ${cls}">${score}%</span>
    </div>`;
});

if (taken === 0) {
  examResults.innerHTML = '<p style="font-size:13px;color:var(--muted)">Одоохондоо шалгалт өгөөгүй байна.</p>';
}

document.getElementById('statExams').textContent = taken;
document.getElementById('statAvg').textContent   = taken > 0 ? Math.round(total / taken) + '%' : '—';

// badge unlock
if (taken >= 5) document.getElementById('badge5exams').classList.remove('locked');

loadAvatar();
setupAvatarChange();
