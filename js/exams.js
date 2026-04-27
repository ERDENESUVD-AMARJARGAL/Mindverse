const exams = [
  {
    title: "Алгебрийн шалгалт",
    category: "Алгебр",
    desc: "Тэгшитгэл, олон гишүүнт болон функцийн мэдлэгийг шалгана.",
    questions: 10, duration: 20, difficulty: "medium",
    image: "../images/algebry.jpg",
    quiz: [
      { q: "x² - 5x + 6 = 0 тэгшитгэлийн шийдүүд?",
        opts: ["x=2, x=3","x=-2, x=-3","x=1, x=6","x=-1, x=-6"], ans: 0 },
      { q: "2x + 4 = 10 бол x = ?",
        opts: ["2","3","4","5"], ans: 1 },
      { q: "f(x) = 3x - 1 бол f(4) = ?",
        opts: ["10","11","12","13"], ans: 1 },
      { q: "(a+b)² = ?",
        opts: ["a²+b²","a²+2ab+b²","a²-2ab+b²","2a²+2b²"], ans: 1 },
      { q: "x - 3 > 7 бол x-ийн багц?",
        opts: ["x > 4","x > 10","x < 10","x < 4"], ans: 1 }
    ]
  },
  {
    title: "Геометрийн шалгалт",
    category: "Геометр",
    desc: "Гурвалжин, тойрог болон талбайн тооцооллын чадварыг шалгана.",
    questions: 10, duration: 25, difficulty: "medium",
    image: "../images/geometry.png",
    quiz: [
      { q: "Гурвалжины өнцгүүдийн нийлбэр хэд вэ?",
        opts: ["90°","180°","270°","360°"], ans: 1 },
      { q: "R=5 тойргийн талбай?",
        opts: ["25π","10π","5π","50π"], ans: 0 },
      { q: "Тэгш өнцөгт гурвалжины 3 болон 4 тал байвал хипотенуз?",
        opts: ["5","6","7","8"], ans: 0 },
      { q: "Тэгш өнцөгт (a×b) талбай?",
        opts: ["a+b","2(a+b)","ab","a²+b²"], ans: 2 },
      { q: "Зэрэгцээ хоёр шулуун таглах шулуун зүссэн үед зэрэгцээ өнцгүүд?",
        opts: ["Тэнцүү","Нэмэлдэх","Нэмлэгдэх","Хоёр дахин"], ans: 0 }
    ]
  },
  {
    title: "Тригонометрийн шалгалт",
    category: "Тригонометр",
    desc: "sin, cos, tan функцийн утга болон тэгшитгэл шийдвэрлэх дадлага.",
    questions: 8, duration: 20, difficulty: "hard",
    image: "../images/trignometry.jpg",
    quiz: [
      { q: "sin(30°) = ?",
        opts: ["0.5","√2/2","√3/2","1"], ans: 0 },
      { q: "cos(0°) = ?",
        opts: ["0","0.5","1","-1"], ans: 2 },
      { q: "tan(45°) = ?",
        opts: ["0","0.5","√3","1"], ans: 3 },
      { q: "sin²θ + cos²θ = ?",
        opts: ["0","1","2","sin(2θ)"], ans: 1 },
      { q: "sin(90°) = ?",
        opts: ["0","0.5","√3/2","1"], ans: 3 }
    ]
  },
  {
    title: "Арифметикийн шалгалт",
    category: "Арифметик",
    desc: "Үндсэн тооны үйлдлүүд, бутархай болон хувийн тооцоог шалгана.",
    questions: 10, duration: 15, difficulty: "easy",
    image: "../images/algebry.jpg",
    quiz: [
      { q: "15 × 8 = ?",
        opts: ["100","110","120","130"], ans: 2 },
      { q: "144 ÷ 12 = ?",
        opts: ["10","11","12","13"], ans: 2 },
      { q: "¾ + ¼ = ?",
        opts: ["½","1","1½","2"], ans: 1 },
      { q: "25% нь 200-ын хэд вэ?",
        opts: ["25","40","50","75"], ans: 2 },
      { q: "2³ = ?",
        opts: ["4","6","8","16"], ans: 2 }
    ]
  },
  {
    title: "Комбинаторикийн шалгалт",
    category: "Комбинаторик",
    desc: "Зөвшөөрөл, хослол болон тооллын аргуудыг шалгана.",
    questions: 8, duration: 20, difficulty: "hard",
    image: "../images/data_analysis.jpg",
    quiz: [
      { q: "5! = ?",
        opts: ["60","100","120","240"], ans: 2 },
      { q: "C(5,2) = ?",
        opts: ["5","10","15","20"], ans: 1 },
      { q: "4 элементийн зөвшөөрлийн тоо?",
        opts: ["16","20","24","36"], ans: 2 },
      { q: "P(6,3) = ?",
        opts: ["20","60","120","720"], ans: 2 },
      { q: "10 хүнээс 3 хүн сонгох хослолын тоо?",
        opts: ["90","100","120","720"], ans: 2 }
    ]
  },
  {
    title: "Тооны онолын шалгалт",
    category: "Тооны онол",
    desc: "Анхны тоо, хуваагдах чанар болон дундаж зэрэглэлийн ойлголтыг шалгана.",
    questions: 8, duration: 20, difficulty: "hard",
    image: "../images/geometry.jpg",
    quiz: [
      { q: "100-аас бага анхны тооны тоо хэд вэ?",
        opts: ["23","24","25","26"], ans: 2 },
      { q: "GCD(12, 18) = ?",
        opts: ["2","3","6","9"], ans: 2 },
      { q: "LCM(4, 6) = ?",
        opts: ["12","18","24","36"], ans: 0 },
      { q: "17 анхны тоо мөн үү?",
        opts: ["Тийм","Үгүй","Тодорхойгүй","Хоосон"], ans: 0 },
      { q: "2⁵ - 1 = ?",
        opts: ["29","31","33","35"], ans: 1 }
    ]
  }
];

const diffLabel = { easy: 'Хялбар', medium: 'Дунд', hard: 'Хэцүү' };
const diffClass = { easy: 'diff-easy', medium: 'diff-medium', hard: 'diff-hard' };

function renderExams() {
  const grid = document.getElementById('examsGrid');
  exams.forEach((ex, idx) => {
    const saved = localStorage.getItem('exam_score_' + idx);
    const card  = document.createElement('div');
    card.className = 'exam-item';
    card.innerHTML = `
      <img src="${ex.image}" alt="${ex.title}">
      <div class="exam-body">
        <span class="exam-tag">${ex.category}</span>
        <h3>${ex.title}</h3>
        <p>${ex.desc}</p>
        <div class="exam-meta">
          <span><i class="fas fa-question-circle"></i> ${ex.questions} асуулт</span>
          <span><i class="fas fa-clock"></i> ${ex.duration} мин</span>
        </div>
        <span class="difficulty ${diffClass[ex.difficulty]}">${diffLabel[ex.difficulty]}</span>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <button class="exam-btn" onclick="startExam(${idx})">
            <i class="fas fa-play"></i> Шалгалт эхлэх
          </button>
          ${saved ? `<span class="score-badge">Оноо: ${saved}%</span>` : ''}
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

/* ── QUIZ LOGIC ── */
let currentExam  = null;
let currentQ     = 0;
let score        = 0;
let answered     = false;

let timerInterval = null;
let timeLeft      = 0;
let totalTime     = 0;

function startTimer(seconds) {
  clearInterval(timerInterval);
  timeLeft  = seconds;
  totalTime = seconds;
  const bar = document.getElementById('examTimerBar');
  if (bar) bar.style.display = 'flex';
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const bar  = document.getElementById('examTimerBar');
  const disp = document.getElementById('timerDisplay');
  const fill = document.getElementById('timerFill');
  if (!disp) return;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  disp.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  if (fill && totalTime > 0) fill.style.width = (timeLeft / totalTime * 100) + '%';
  if (bar) bar.classList.toggle('urgent', timeLeft <= 60 && timeLeft > 0);
}

function startExam(idx) {
  currentExam = exams[idx];
  currentQ    = 0;
  score       = 0;
  answered    = false;
  document.getElementById('modalTitle').textContent = currentExam.title;
  document.getElementById('modalSub').textContent   =
    currentExam.questions + ' асуулт · ' + currentExam.duration + ' минут';
  document.getElementById('btnNext').textContent = 'Дараагийн асуулт';
  document.getElementById('modalOverlay').classList.add('open');
  startTimer(currentExam.duration * 60);
  showQuestion();
}

function showQuestion() {
  const q    = currentExam.quiz[currentQ];
  const area = document.getElementById('quizArea');
  answered   = false;
  area.innerHTML = `
    <div class="question-text">${currentQ + 1}. ${q.q}</div>
    <div class="options" id="optionsBox">
      ${q.opts.map((o, i) => `
        <label id="opt${i}">
          <input type="radio" name="opt" value="${i}" onchange="checkAnswer(${i}, ${q.ans})">
          ${o}
        </label>`).join('')}
    </div>`;
  document.getElementById('btnNext').disabled = true;
}

function checkAnswer(chosen, correct) {
  if (answered) return;
  answered = true;
  document.getElementById('btnNext').disabled = false;
  document.querySelectorAll('#optionsBox input').forEach(r => r.disabled = true);
  document.getElementById('opt' + correct).classList.add('correct');
  if (chosen !== correct) {
    document.getElementById('opt' + chosen).classList.add('wrong');
  } else {
    score++;
  }
}

function nextQuestion() {
  currentQ++;
  if (currentQ < currentExam.quiz.length) {
    const isLast = currentQ === currentExam.quiz.length - 1;
    document.getElementById('btnNext').textContent = isLast ? 'Дуусгах' : 'Дараагийн асуулт';
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  clearInterval(timerInterval);
  const bar = document.getElementById('examTimerBar');
  if (bar) bar.style.display = 'none';
  const pct = Math.round((score / currentExam.quiz.length) * 100);
  const idx  = exams.indexOf(currentExam);
  localStorage.setItem('exam_score_' + idx, pct);
  const msg  = pct >= 80 ? 'Маш сайн!' : pct >= 60 ? 'Сайн!' : 'Дахин хичээгээрэй.';
  document.getElementById('quizArea').innerHTML = `
    <div class="result-box">
      <div class="result-score">${pct}%</div>
      <div class="result-msg">${score} / ${currentExam.quiz.length} зөв — ${msg}</div>
    </div>`;
  document.getElementById('btnNext').style.display = 'none';
}

function closeModal() {
  clearInterval(timerInterval);
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('btnNext').style.display = '';
  document.getElementById('examsGrid').innerHTML = '';
  renderExams();
}

renderExams();
