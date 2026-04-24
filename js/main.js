document.addEventListener('DOMContentLoaded', () => {
  const fn = sessionStorage.getItem('user_firstname') || '';
  const ln = sessionStorage.getItem('user_lastname')  || '';
  const gr = sessionStorage.getItem('user_grade')     || '';
  const sc = sessionStorage.getItem('user_school')    || '';
  const nameEl = document.getElementById('studentName');
  const metaEl = document.getElementById('studentMeta');
  const name = fn || ln;
  if (nameEl && name) nameEl.textContent = name;
  if (metaEl && (gr || sc)) {
    const parts = [gr, sc].filter(Boolean);
    metaEl.textContent = parts.join(' · ') + ' · Таны хичээлийн ахиц, даалгавар, шалгалт бүгд энд';
  }
});
