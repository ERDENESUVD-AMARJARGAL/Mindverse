/* ════════════════════════════════════════
   COURSE PLAYER  —  temp.js
   Reads: courses.json  +  course-content.json
   URL param: ?id=1
   ════════════════════════════════════════ */

let courseInfo    = null;   // from courses.json
let courseContent = null;   // from course-content.json
let currentLesson = null;   // { unitIndex, lessonIndex, data }
let userAnswers   = {};
let checked       = false;

/* ── BOOT ── */
(async function init() {
  const id = new URLSearchParams(window.location.search).get('id') || '1';

  try {
    // Load both JSON files in parallel
    const [coursesRes, contentRes] = await Promise.all([
      fetch('../data/courses.json'),
      fetch('../data/temp.json')
    ]);
    const courses  = await coursesRes.json();
    const contents = await contentRes.json();

    courseInfo    = courses.find(c => String(c.id) === String(id));
    courseContent = contents[String(id)];

    if (!courseInfo || !courseContent) {
      document.getElementById('sidebarUnits').innerHTML =
        '<div class="loading-state" style="color:#ef4444"><i class="bi bi-exclamation-circle"></i> Курс олдсонгүй</div>';
      return;
    }

    fillMeta();
    buildSidebar();
    recalcProgress();

    // Auto-open first lesson
    const first = document.querySelector('.lesson-item');
    if (first) first.click();

  } catch (e) {
    console.error(e);
    document.getElementById('sidebarUnits').innerHTML =
      '<div class="loading-state" style="color:#ef4444"><i class="bi bi-wifi-off"></i> Өгөгдөл ачааллахад алдаа гарлаа</div>';
  }
})();

/* ── META STRIP ── */
function fillMeta() {
  document.getElementById('headerTitle').textContent  = courseInfo.title;
  document.title = courseInfo.title + ' – EduLearn';

  document.getElementById('infoInstructor').textContent = courseInfo.instructor;
  document.getElementById('infoLessons').textContent    = courseInfo.lessons;
  document.getElementById('infoHours').textContent      = courseInfo.hours;
  document.getElementById('infoEnrolled').textContent   = courseInfo.enrolled;
  document.getElementById('infoRating').textContent     = courseInfo.rating;

  const priceEl = document.getElementById('infoPrice');
  priceEl.textContent = courseInfo.price === 0 ? 'Үнэгүй' : '₮' + courseInfo.price.toLocaleString();
  priceEl.style.color = courseInfo.price === 0 ? '#22c55e' : 'inherit';
  priceEl.style.fontWeight = '600';
}

/* ── BUILD SIDEBAR ── */
function buildSidebar() {
  const container = document.getElementById('sidebarUnits');
  container.innerHTML = '';

  courseContent.units.forEach((unit, ui) => {
    const header = document.createElement('div');
    header.className = 'unit-header' + (ui === 0 ? ' active' : '');
    header.innerHTML = `
      <div class="unit-info">
        <small>Хэсэг ${ui + 1}</small>
        <div class="unit-name">${esc(unit.title)}</div>
      </div>
      <i class="bi bi-chevron-down unit-arrow" style="${ui === 0 ? 'transform:rotate(180deg)' : ''}"></i>`;
    header.addEventListener('click', () => toggleUnit(header));

    const block = document.createElement('div');
    block.className = 'lessons' + (ui === 0 ? ' open' : '');

    unit.lessons.forEach((lesson, li) => {
      const item = document.createElement('div');
      item.className = 'lesson-item';
      item.dataset.unit   = ui;
      item.dataset.lesson = li;

      if (isDone(ui, li)) item.classList.add('completed');

      item.innerHTML = `
        <i class="bi ${lessonIcon(lesson.type)}"></i>
        <span class="lesson-item-text">${esc(lesson.title)}</span>
        <i class="bi bi-check-circle-fill lesson-check"></i>`;

      item.addEventListener('click', () => selectLesson(item, ui, li));
      block.appendChild(item);
    });

    container.appendChild(header);
    container.appendChild(block);
  });
}

/* ── SELECT LESSON ── */
function selectLesson(el, ui, li) {
  document.querySelectorAll('.lesson-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');

  const lesson  = courseContent.units[ui].lessons[li];
  currentLesson = { unitIndex: ui, lessonIndex: li, data: lesson };
  userAnswers   = {};
  checked       = false;

  if (lesson.type === 'video') showVideo(lesson);
  else                         showExercise(lesson);
}

/* ── VIDEO ── */
function showVideo(lesson) {
  document.getElementById('videoView').style.display    = 'block';
  document.getElementById('exerciseView').style.display = 'none';

  const video = document.getElementById('courseVideo');
  video.src = lesson.videoUrl || '';
  video.load();

  const tag = document.getElementById('lessonTag');
  tag.textContent = 'Видео хичээл';
  tag.className   = 'lesson-tag';
  document.getElementById('lessonTitle').textContent = lesson.title;
  document.getElementById('lessonDesc').textContent  = lesson.desc;

  // Auto-mark video as done when it ends
  video.onended = () => {
    markDone(currentLesson.unitIndex, currentLesson.lessonIndex);
  };
}

/* ── EXERCISE / QUIZ ── */
function showExercise(lesson) {
  document.getElementById('videoView').style.display    = 'none';
  document.getElementById('exerciseView').style.display = 'block';

  const tag = document.getElementById('exTag');
  if (lesson.type === 'quiz') {
    tag.textContent = 'Тест';
    tag.className   = 'lesson-tag tag-quiz';
  } else {
    tag.textContent = 'Дасгал ажил';
    tag.className   = 'lesson-tag tag-exercise';
  }
  document.getElementById('exTitle').textContent = lesson.title;
  document.getElementById('exDesc').textContent  = lesson.desc;

  const wrap = document.getElementById('questionsWrap');
  wrap.innerHTML = '';
  const letters = ['A','B','C','D'];

  lesson.questions.forEach((q, qi) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
      <div class="q-number">${qi + 1}-р асуулт</div>
      <div class="q-text">${esc(q.q)}</div>
      <div class="options-list">
        ${q.options.map((opt, oi) => `
          <button class="option-btn" data-q="${qi}" data-o="${oi}" onclick="pickOption(${qi},${oi})">
            <span class="option-letter">${letters[oi]}</span>${esc(opt)}
          </button>`).join('')}
      </div>`;
    wrap.appendChild(card);
  });

  const checkBtn = document.getElementById('checkBtn');
  checkBtn.disabled    = true;
  checkBtn.textContent = 'Шалгах';

  document.getElementById('scoreWrap').style.display = 'none';
  document.getElementById('retryBtn')?.remove();
}

/* ── PICK OPTION ── */
function pickOption(qi, oi) {
  if (checked) return;
  userAnswers[qi] = oi;
  document.querySelectorAll(`[data-q="${qi}"]`).forEach(b => b.classList.remove('selected'));
  document.querySelector(`[data-q="${qi}"][data-o="${oi}"]`).classList.add('selected');

  const total = currentLesson.data.questions.length;
  document.getElementById('checkBtn').disabled =
    Object.keys(userAnswers).length < total;
}

/* ── CHECK ── */
function checkAnswers() {
  const lesson = currentLesson.data;
  checked = true;
  let correct = 0;

  lesson.questions.forEach((q, qi) => {
    const chosen = userAnswers[qi];
    document.querySelectorAll(`[data-q="${qi}"]`).forEach(b => b.classList.add('disabled'));
    document.querySelector(`[data-q="${qi}"][data-o="${q.answer}"]`).classList.add('show-correct');
    if (chosen !== undefined) {
      if (chosen === q.answer) {
        document.querySelector(`[data-q="${qi}"][data-o="${chosen}"]`).classList.add('correct');
        correct++;
      } else {
        document.querySelector(`[data-q="${qi}"][data-o="${chosen}"]`).classList.add('wrong');
      }
    }
  });

  const pct    = Math.round((correct / lesson.questions.length) * 100);
  const isGood = pct >= 60;
  const sw     = document.getElementById('scoreWrap');
  sw.style.display = 'block';
  sw.className     = 'score-wrap ' + (isGood ? 'good' : 'bad');
  sw.innerHTML     = isGood
    ? `<i class="bi bi-check-circle-fill"></i> ${correct}/${lesson.questions.length} зөв (${pct}%) — Сайн байна!`
    : `<i class="bi bi-x-circle-fill"></i> ${correct}/${lesson.questions.length} зөв (${pct}%) — Дахин оролдоно уу`;

  document.getElementById('checkBtn').disabled = true;

  if (!document.getElementById('retryBtn')) {
    const rb = document.createElement('button');
    rb.className = 'retry-btn'; rb.id = 'retryBtn';
    rb.textContent = 'Дахин хийх';
    rb.onclick = () => { showExercise(lesson); checked = false; userAnswers = {}; };
    document.querySelector('.exercise-footer').appendChild(rb);
  }

  if (isGood) markDone(currentLesson.unitIndex, currentLesson.lessonIndex);
}

/* ── PROGRESS ── */
function doneKey(ui, li) {
  return `done_${courseInfo.id}_${ui}_${li}`;
}
function isDone(ui, li) {
  return !!localStorage.getItem(doneKey(ui, li));
}
function markDone(ui, li) {
  localStorage.setItem(doneKey(ui, li), '1');
  const item = document.querySelector(`.lesson-item[data-unit="${ui}"][data-lesson="${li}"]`);
  if (item) item.classList.add('completed');
  recalcProgress();
}
function recalcProgress() {
  if (!courseContent) return;
  let total = 0, done = 0;
  courseContent.units.forEach((u, ui) =>
    u.lessons.forEach((_, li) => { total++; if (isDone(ui, li)) done++; })
  );
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('progressFill').style.width  = pct + '%';
  document.getElementById('progressLabel').textContent = pct + '% дууссан';
  // Profile хуудас уншиж чаддаг байхаар 'progress_<title>' key-д хадгална
  localStorage.setItem('progress_' + courseInfo.title, pct);
}

/* ── UNIT TOGGLE ── */
function toggleUnit(header) {
  const block  = header.nextElementSibling;
  const isOpen = block.classList.contains('open');
  block.classList.toggle('open', !isOpen);
  header.classList.toggle('active', !isOpen);
  header.querySelector('.unit-arrow').style.transform = !isOpen ? 'rotate(180deg)' : '';
}

/* ── NOTES (unchanged logic) ── */
let notes = JSON.parse(localStorage.getItem('cp_notes') || '[]');
let notesOpen = false;
function saveNotes() { localStorage.setItem('cp_notes', JSON.stringify(notes)); }
function toggleNotes() {
  notesOpen = !notesOpen;
  document.getElementById('notesList').classList.toggle('open', notesOpen);
  document.getElementById('notesChevron').classList.toggle('open', notesOpen);
  renderNotes();
}
function renderNotes() {
  const list = document.getElementById('notesList');
  list.innerHTML = '';
  if (!notes.length) { list.innerHTML = '<div class="notes-empty">Тэмдэглэл байхгүй байна</div>'; return; }
  notes.forEach((note, i) => {
    const div = document.createElement('div');
    div.className = 'note-item';
    div.innerHTML = `<span class="note-title">${esc(note.title)}</span>
      <button class="note-delete"><i class="bi bi-trash3"></i></button>`;
    div.querySelector('.note-delete').addEventListener('click', e => { e.stopPropagation(); notes.splice(i,1); saveNotes(); renderNotes(); });
    div.addEventListener('click', () => openNote(i));
    list.appendChild(div);
  });
}
function createNote() {
  notes.unshift({ title: 'Шинэ тэмдэглэл', content: '', created: Date.now() });
  saveNotes();
  if (!notesOpen) toggleNotes(); else renderNotes();
  openNote(0);
}
function openNote(i) {
  const note = notes[i];
  for (const p of document.querySelectorAll('.note-popup'))
    if (+p.dataset.index === i) { p.style.zIndex = 10000; return; }
  const popup = document.createElement('div');
  popup.className = 'note-popup'; popup.dataset.index = i;
  const d = new Date(note.created || Date.now());
  const ds = d.toLocaleDateString('mn-MN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
  popup.innerHTML = `
    <div class="note-popup-header" onmousedown="dragStart(event,this.closest('.note-popup'))">
      <input value="${esc(note.title)}" placeholder="Гарчиг...">
      <div class="popup-actions">
        <button class="popup-btn" onclick="this.closest('.note-popup').classList.toggle('large')"><i class="bi bi-arrows-fullscreen"></i></button>
        <button class="popup-btn" onclick="this.closest('.note-popup').remove()"><i class="bi bi-x-lg"></i></button>
      </div>
    </div>
    <div class="note-popup-body"><textarea placeholder="Тэмдэглэл бичих...">${esc(note.content)}</textarea></div>
    <div class="note-popup-footer">${ds}</div>`;
  document.body.appendChild(popup);
  popup.querySelector('input').addEventListener('input', e => { notes[i].title = e.target.value; saveNotes(); renderNotes(); });
  popup.querySelector('textarea').addEventListener('input', e => { notes[i].content = e.target.value; saveNotes(); });
}
function dragStart(e, el) {
  e.preventDefault();
  let sx = e.clientX - el.offsetLeft, sy = e.clientY - el.offsetTop;
  const mv = e => { el.style.cssText += `;left:${e.clientX-sx}px;top:${e.clientY-sy}px;bottom:auto;right:auto;position:fixed`; };
  const up = () => { document.removeEventListener('mousemove',mv); document.removeEventListener('mouseup',up); };
  document.addEventListener('mousemove',mv); document.addEventListener('mouseup',up);
}

/* ── HELPERS ── */
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function lessonIcon(type) {
  return type === 'video' ? 'bi-play-circle-fill' : type === 'quiz' ? 'bi-file-earmark-check' : 'bi-pencil-square';
}