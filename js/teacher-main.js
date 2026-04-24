  // Show teacher name
  const name = sessionStorage.getItem('user_firstname') || sessionStorage.getItem('user_name') || 'Багш';
  document.getElementById('teacherNameDisplay').textContent = name;

  function openModal(id) {
    document.getElementById(id).classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove('show');
    document.body.style.overflow = '';
  }
  function filterAssign(status, btn) {
    document.querySelectorAll('.assign-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.assign-row').forEach(row => {
      row.style.display = (status === 'all' || row.dataset.status === status) ? '' : 'none';
    });
  }
