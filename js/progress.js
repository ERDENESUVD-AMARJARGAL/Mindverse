document.addEventListener('DOMContentLoaded', () => {
  const scores  = [84, 71, 65, 72];
  const avg     = Math.round(scores.reduce((a,b)=>a+b,0) / scores.length);
  const pctEl   = document.getElementById('avgPct');
  const nameEl  = document.getElementById('heroName');
  if (pctEl) pctEl.textContent = avg + '%';

  const fn = sessionStorage.getItem('user_firstname') || '';
  const ln = sessionStorage.getItem('user_lastname')  || '';
  const name = fn || ln;
  if (nameEl && name) nameEl.textContent = name + ' — академик явц';

  // Animate ring stroke offset
  const ring = document.querySelector('.grade-ring-wrap circle:last-child');
  if (ring) {
    const circ = 2 * Math.PI * 50;
    ring.style.strokeDasharray  = circ;
    ring.style.strokeDashoffset = circ * (1 - avg / 100);
  }

  // Animate week bars
  document.querySelectorAll('.week-bar').forEach(bar => {
    const h = bar.style.height;
    bar.style.height = '0%';
    setTimeout(() => { bar.style.height = h; }, 200);
  });
});
