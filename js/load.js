document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  fetch('./components/sidebar.html')
    .then(res => {
      if (!res.ok) throw new Error('Файл олдсонгүй: ' + res.status);
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;

      // ── Active link автоматаар тодорхойлох ──
      const currentPage = window.location.pathname.split('/').pop() || 'main.html';

      document.querySelectorAll('.sidebar nav ul li').forEach(li => {
        li.classList.remove('active');
        const a = li.querySelector('a');
        if (!a) return;
        const hrefPage = a.getAttribute('href').split('/').pop();
        if (hrefPage === currentPage) {
          li.classList.add('active');
        }
      });

      // ── Toggle ──
      const sidebar    = document.getElementById('sidebar');
      const toggleBtn  = document.getElementById('toggleBtn');
      const toggleIcon = document.getElementById('toggleIcon');

      if (!sidebar || !toggleBtn) {
        console.error('Sidebar элементүүд олдсонгүй');
        return;
      }

      toggleBtn.addEventListener('click', () => {
        const collapsed = sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sb-collapsed', collapsed);
        toggleIcon.className = collapsed
          ? 'fas fa-chevron-right'
          : 'fas fa-chevron-left';
      });
    })
    .catch(err => console.error('Sidebar алдаа:', err));
});