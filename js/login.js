if (localStorage.getItem('dark_mode') === '1') document.body.classList.add('dark');

// ── Role switcher ──
function selectRole(role) {
  document.getElementById('roleInput').value = role;
  document.getElementById('btn-student').classList.toggle('active', role === 'student');
  document.getElementById('btn-teacher').classList.toggle('active', role === 'teacher');

  const btn    = document.getElementById('loginBtn');
  const text   = document.getElementById('loginBtnText');
  const fields = document.getElementById('studentFields');

  if (role === 'teacher') {
    btn.classList.add('teacher-mode');
    text.textContent = 'Багшаар нэвтрэх';
    fields.style.display = 'none';
    document.getElementById('schoolInput').removeAttribute('required');
    document.getElementById('gradeInput').removeAttribute('required');
  } else {
    btn.classList.remove('teacher-mode');
    text.textContent = 'Сурагчаар нэвтрэх';
    fields.style.display = '';
    document.getElementById('schoolInput').setAttribute('required', '');
    document.getElementById('gradeInput').setAttribute('required', '');
  }
}

// ── Password toggle ──
function togglePw() {
  const inp  = document.getElementById('password');
  const icon = document.getElementById('pwEyeIcon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

// ── Login submit ──
document.getElementById('loginBtn').addEventListener('click', function(e) {
  e.preventDefault();

  const lastname  = document.getElementById('lastnameInput').value.trim();
  const firstname = document.getElementById('firstnameInput').value.trim();
  const email     = document.getElementById('emailInput').value.trim();
  const password  = document.getElementById('password').value;
  const role      = document.getElementById('roleInput').value;
  const errEl     = document.getElementById('loginError');

  errEl.textContent = '';

  if (!lastname)  { errEl.textContent = 'Овогоо оруулна уу!'; return; }
  if (!firstname) { errEl.textContent = 'Нэрээ оруулна уу!'; return; }

  if (role === 'student') {
    const school = document.getElementById('schoolInput').value.trim();
    const grade  = document.getElementById('gradeInput').value;
    if (!school) { errEl.textContent = 'Сургуулийн нэрээ оруулна уу!'; return; }
    if (!grade)  { errEl.textContent = 'Ангиа сонгоно уу!'; return; }
    sessionStorage.setItem('user_school', school);
    sessionStorage.setItem('user_grade',  grade);
  }

  if (!email || !email.includes('@')) { errEl.textContent = 'Зөв имэйл хаяг оруулна уу!'; return; }
  if (!password)  { errEl.textContent = 'Нууц үгээ оруулна уу!'; return; }

  // Persist user info
  sessionStorage.setItem('user_lastname',  lastname);
  sessionStorage.setItem('user_firstname', firstname);
  sessionStorage.setItem('user_name',  firstname + ' ' + lastname);
  sessionStorage.setItem('user_email', email);
  sessionStorage.setItem('user_role',  role);

  // Show brief loading state
  this.disabled = true;
  this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Нэвтэрч байна...';

  setTimeout(() => {
    window.location.href = role === 'teacher' ? 'teacher-main.html' : 'main.html';
  }, 600);
});
