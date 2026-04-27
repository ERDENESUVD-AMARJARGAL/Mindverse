if (localStorage.getItem('dark_mode') === '1') document.body.classList.add('dark');

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  fetch('../components/sidebar.html')
    .then(res => {
      if (!res.ok) throw new Error('Файл олдсонгүй: ' + res.status);
      return res.text();
    })
    .then(html => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      wrapper.querySelectorAll('script').forEach(s => s.remove());
      container.appendChild(wrapper.firstElementChild);
      while (wrapper.firstElementChild) container.appendChild(wrapper.firstElementChild);

      // ── User info ──
      const lastname  = sessionStorage.getItem('user_lastname')  || '';
      const firstname = sessionStorage.getItem('user_firstname') || '';
      const fullname  = sessionStorage.getItem('user_name') || (firstname ? firstname + ' ' + lastname : 'Хэрэглэгч');
      const role      = sessionStorage.getItem('user_role') || 'student';
      const school    = sessionStorage.getItem('user_school') || '';
      const grade     = sessionStorage.getItem('user_grade')  || '';

      const nameEl   = document.getElementById('sbUserName');
      const roleEl   = document.getElementById('sbUserRole');
      const avEl     = document.getElementById('sbAvatarLetter');
      const schoolEl = document.getElementById('sbUserSchool');

      if (nameEl) nameEl.textContent = fullname;
      if (avEl)   avEl.textContent   = fullname.charAt(0).toUpperCase();

      // Load saved profile avatar
      const avatarKey  = 'avatar_' + (sessionStorage.getItem('user_name') || 'user');
      const savedAvatar = localStorage.getItem(avatarKey);
      const sbImgEl = document.querySelector('.sb-bp-img');
      if (sbImgEl) {
        sbImgEl.id = 'sbAvatarImg';
        if (savedAvatar) {
          sbImgEl.src = savedAvatar;
          sbImgEl.style.display = '';
          if (avEl) avEl.style.display = 'none';
        }
      }
      if (roleEl) {
        if (role === 'teacher') {
          roleEl.textContent = '🎓 Багш';
        } else {
          const label = grade ? grade + (school ? ' · ' + school : '') : '📚 Сурагч';
          roleEl.textContent = label;
        }
      }
      if (schoolEl && school) schoolEl.textContent = school;

      // Show teacher-only / student-only nav items
      if (role === 'teacher') {
        document.querySelectorAll('.teacher-only').forEach(el => el.style.display = '');
        document.querySelectorAll('.student-only').forEach(el => el.style.display = 'none');
      } else {
        document.querySelectorAll('.teacher-only').forEach(el => el.style.display = 'none');
      }

      // ── Active link ──
      const currentPage = window.location.pathname.split('/').pop() || 'main.html';
      document.querySelectorAll('#sidebar nav ul li').forEach(li => {
        li.classList.remove('active');
        const a = li.querySelector('a');
        if (!a) return;
        if (a.getAttribute('href').split('/').pop() === currentPage) li.classList.add('active');
      });

      // ── Sidebar toggle ──
      const sidebar   = document.getElementById('sidebar');
      const toggleBtn = document.getElementById('toggleBtn');
      const toggleIcon= document.getElementById('toggleIcon');
      const hamburger = document.getElementById('sbHamburger');
      const overlay   = document.getElementById('sbOverlay');
      const logoutBtn = document.getElementById('logoutBtn');

      if (!sidebar || !toggleBtn) return;

      toggleBtn.addEventListener('click', () => {
        const collapsed = sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sb-collapsed', collapsed);
        toggleIcon.className = collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
      });

      if (hamburger) {
        hamburger.addEventListener('click', () => {
          sidebar.classList.add('mobile-open');
          if (overlay) overlay.classList.add('show');
        });
      }
      if (overlay) {
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('mobile-open');
          overlay.classList.remove('show');
        });
      }
      if (logoutBtn) {
        logoutBtn.addEventListener('click', e => {
          e.preventDefault();
          sessionStorage.clear();
          window.location.href = '../html/login.html';
        });
      }
    })
    .catch(err => console.error('Sidebar алдаа:', err));
});
