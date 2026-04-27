function selectRole(role) {
  document.getElementById('role-input').value = role;
  const display = document.getElementById('role-display');
  if (display) display.textContent = role === 'teacher' ? 'Багшаар' : 'Сурагчаар';
  document.getElementById('btn-student').classList.toggle('active', role === 'student');
  document.getElementById('btn-teacher').classList.toggle('active', role === 'teacher');

  const btn = document.getElementById('signup-btn');
  if (btn) {
    btn.style.background = role === 'teacher'
      ? 'linear-gradient(135deg,#065f46,#047857)'
      : 'linear-gradient(135deg,#0a57a0,#05315e)';
  }
}

document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const lastname  = document.getElementById('lastnameInput').value.trim();
  const firstname = document.getElementById('firstnameInput').value.trim();
  const email     = document.getElementById('emailInput').value.trim();
  const password  = document.getElementById('passwordInput').value;
  const confirm   = document.getElementById('confirmInput').value;
  const role      = document.getElementById('role-input').value;
  const terms     = document.getElementById('termsCheck').checked;
  const errEl     = document.getElementById('signupError');

  errEl.textContent = '';

  if (!lastname)  { errEl.textContent = 'Овогоо оруулна уу!'; return; }
  if (!firstname) { errEl.textContent = 'Нэрээ оруулна уу!'; return; }
  if (!email.includes('@')) { errEl.textContent = 'Зөв имэйл хаяг оруулна уу!'; return; }
  if (password.length < 6)  { errEl.textContent = 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой!'; return; }
  if (password !== confirm)  { errEl.textContent = 'Нууц үг таарахгүй байна!'; return; }
  if (!terms) { errEl.textContent = 'Үйлчилгээний нөхцөлийг зөвшөөрнө үү!'; return; }

  sessionStorage.setItem('user_lastname',  lastname);
  sessionStorage.setItem('user_firstname', firstname);
  sessionStorage.setItem('user_name',  firstname + ' ' + lastname);
  sessionStorage.setItem('user_email', email);
  sessionStorage.setItem('user_role',  role);

  const btn = document.getElementById('signup-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Бүртгүүлж байна...';

  setTimeout(() => {
    window.location.href = 'main.html';
  }, 700);
});
