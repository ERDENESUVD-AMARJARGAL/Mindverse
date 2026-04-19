// Apply dark mode before paint
if (localStorage.getItem('dark_mode') === '1') document.body.classList.add('dark');

// ── Steins;Gate — Circuit Network background ──
;(function () {
  if (document.getElementById('starCanvas')) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'starCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none';

  function inject() {
    if (!document.body) { setTimeout(inject, 8); return; }
    document.body.insertBefore(canvas, document.body.firstChild);
    start();
  }

  let W, H, tick = 0, ctx;

  const GRID      = 38;    /* PCB snap grid px          */
  const TRACE_N   = 28;    /* number of circuit traces  */
  const PACKET_N  = 9;     /* max live data packets     */

  const TRACES  = [];      /* [{pts, cum, total, cyan}] */
  const PACKETS = [];      /* [{trace, t, spd, dir}]    */

  /* ── Snap value to nearest grid line ── */
  function snap(v) { return Math.round(v / GRID) * GRID; }

  /* ── Generate one PCB-style horizontal/vertical path ── */
  function genPath() {
    const pts = [];
    let x = snap(Math.random() * W);
    let y = snap(Math.random() * H);
    pts.push({ x, y });
    const steps = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < steps; i++) {
      if (Math.random() < .5) {
        x = snap(Math.random() * W);
      } else {
        y = snap(Math.random() * H);
      }
      pts.push({ x, y });
    }
    /* build cumulative length array for interpolation */
    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i-1].x;
      const dy = pts[i].y - pts[i-1].y;
      cum.push(cum[i-1] + Math.sqrt(dx*dx + dy*dy));
    }
    return { pts, cum, total: cum[cum.length - 1], cyan: Math.random() < .82 };
  }

  /* ── Interpolate position along path at fraction t [0,1] ── */
  function getPos(tr, t) {
    const dist = t * tr.total;
    let lo = 0, hi = tr.cum.length - 2;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tr.cum[mid + 1] < dist) lo = mid + 1; else hi = mid;
    }
    const seg   = lo;
    const segD  = tr.cum[seg + 1] - tr.cum[seg];
    const frac  = segD ? (dist - tr.cum[seg]) / segD : 0;
    const A     = tr.pts[seg], B = tr.pts[seg + 1];
    return {
      x:  A.x + (B.x - A.x) * frac,
      y:  A.y + (B.y - A.y) * frac,
      dx: B.x - A.x,
      dy: B.y - A.y
    };
  }

  /* ── Build / rebuild traces ── */
  function buildTraces() {
    TRACES.length = 0;
    PACKETS.length = 0;
    for (let i = 0; i < TRACE_N; i++) TRACES.push(genPath());
  }

  /* ── Spawn a new data packet ── */
  function maybeSpawn() {
    if (PACKETS.length >= PACKET_N || Math.random() > .018) return;
    const tr  = TRACES[Math.floor(Math.random() * TRACES.length)];
    if (tr.total < 60) return;
    const dir = Math.random() < .5 ? 1 : -1;
    PACKETS.push({ tr, t: dir === 1 ? 0 : 1, spd: (.0025 + Math.random() * .003) * dir });
  }

  /* ── Draw oscilloscope waves ── */
  function drawOscilloscope() {
    const waveW = W * .32, amp = 10, freq = .018;

    /* green wave — bottom */
    ctx.beginPath();
    const yB = H * .88;
    for (let x = 0; x <= waveW; x++) {
      const y = yB + Math.sin((x + tick * .55) * freq) * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(0,210,90,.22)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    /* amber wave — top */
    ctx.beginPath();
    const yT = H * .12;
    for (let x = W - waveW; x <= W; x++) {
      const y = yT + Math.sin((x - tick * .40) * freq * 1.3) * amp * .75;
      x === Math.ceil(W - waveW) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(255,180,0,.18)';
    ctx.lineWidth = 1.0;
    ctx.stroke();
  }

  /* ── Draw corner HUD brackets ── */
  function drawHUD() {
    const S = 30, T = 1.2;
    ctx.strokeStyle = 'rgba(0,170,230,.22)';
    ctx.lineWidth   = T;
    [
      [0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]
    ].forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x + sx * S, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + sy * S);
      ctx.stroke();
    });
  }

  /* ── CRT scanline overlay ── */
  function drawScanlines() {
    ctx.fillStyle = 'rgba(0,0,15,.028)';
    for (let y = 0; y < H; y += 4) {
      ctx.fillRect(0, y, W, 2);
    }
  }

  /* ── Main render loop ── */
  function frame() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    /* ─ Deep brand-blue background ─ */
    const bg = ctx.createRadialGradient(W*.5, H*.38, 0, W*.5, H*.55, Math.max(W,H)*.95);
    bg.addColorStop(0,   '#071628');
    bg.addColorStop(.45, '#060f1f');
    bg.addColorStop(1,   '#040c18');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    /* ─ Atmospheric glow layers ─ */
    [
      [W*.65, H*.20, W*.52, 'rgba(7,67,125,.26)'],
      [W*.18, H*.70, W*.36, 'rgba(14,80,155,.14)'],
      [W*.50, H*1.0, W*.70, 'rgba(7,67,125,.18)']
    ].forEach(([cx, cy, r, c]) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, c); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });

    /* ─ Draw PCB circuit traces ─ */
    for (const tr of TRACES) {
      const color = tr.cyan
        ? 'rgba(0,160,220,.13)'
        : 'rgba(0,200,90,.10)';
      ctx.strokeStyle = color;
      ctx.lineWidth   = 1.0;
      ctx.beginPath();
      ctx.moveTo(tr.pts[0].x, tr.pts[0].y);
      for (let i = 1; i < tr.pts.length; i++) ctx.lineTo(tr.pts[i].x, tr.pts[i].y);
      ctx.stroke();

      /* via pads at junctions */
      for (const pt of tr.pts) {
        ctx.globalAlpha = .22;
        ctx.fillStyle   = tr.cyan ? '#00a8e0' : '#00cc60';
        ctx.beginPath(); ctx.arc(pt.x, pt.y, 2.4, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    /* ─ Packets ─ */
    maybeSpawn();
    for (let i = PACKETS.length - 1; i >= 0; i--) {
      const p = PACKETS[i];
      p.t += p.spd;
      if (p.t > 1 || p.t < 0) { PACKETS.splice(i, 1); continue; }

      const pos  = getPos(p.tr, p.t);
      const fade = Math.min(p.t * 8, 1) * Math.min((1 - p.t) * 8, 1);
      const cyan = p.tr.cyan;

      /* comet tail — 28px behind direction of travel */
      const tLen = 28;
      const tMag = Math.sqrt(pos.dx*pos.dx + pos.dy*pos.dy) || 1;
      const tx   = pos.x - (pos.dx / tMag) * tLen * (p.spd > 0 ? 1 : -1);
      const ty   = pos.y - (pos.dy / tMag) * tLen * (p.spd > 0 ? 1 : -1);
      const tail = ctx.createLinearGradient(tx, ty, pos.x, pos.y);
      tail.addColorStop(0, 'transparent');
      tail.addColorStop(1, cyan
        ? `rgba(0,200,255,${(.55 * fade).toFixed(3)})`
        : `rgba(0,255,120,${(.50 * fade).toFixed(3)})`);
      ctx.strokeStyle = tail;
      ctx.lineWidth   = 2.0;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(pos.x, pos.y); ctx.stroke();

      /* glow halo */
      const gl = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10);
      gl.addColorStop(0,   cyan
        ? `rgba(0,200,255,${(.50 * fade).toFixed(3)})`
        : `rgba(0,255,130,${(.45 * fade).toFixed(3)})`);
      gl.addColorStop(.5,  cyan
        ? `rgba(0,100,200,${(.18 * fade).toFixed(3)})`
        : `rgba(0,180,80,${(.15 * fade).toFixed(3)})`);
      gl.addColorStop(1,   'transparent');
      ctx.fillStyle = gl;
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 10, 0, Math.PI*2); ctx.fill();

      /* core dot */
      ctx.globalAlpha = .95 * fade;
      ctx.fillStyle   = cyan ? '#a8eeff' : '#80ffb8';
      ctx.beginPath(); ctx.arc(pos.x, pos.y, 2.6, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    drawOscilloscope();
    drawHUD();
    drawScanlines();

    requestAnimationFrame(frame);
  }

  function start() {
    ctx = canvas.getContext('2d');
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildTraces();
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildTraces();
    });
    frame();
  }

  inject();
})();

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  fetch('../components/sidebar.html')
    .then(res => {
      if (!res.ok) throw new Error('Файл олдсонгүй: ' + res.status);
      return res.text();
    })
    .then(html => {
      // innerHTML-д script ажилладаггүй тул тусдаа оруулна
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      // script тагуудыг устгаж, DOM-д оруулна
      wrapper.querySelectorAll('script').forEach(s => s.remove());
      container.appendChild(wrapper.firstElementChild);
      // hamburger, overlay шууд append
      while (wrapper.firstElementChild) container.appendChild(wrapper.firstElementChild);

      // ── User info (inline script-ийн оронд энд ажиллуулна) ──
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
      if (roleEl) {
        if (role === 'teacher') {
          roleEl.textContent = '🎓 Багш';
          roleEl.style.color = '#6ee7b7';
        } else {
          const label = grade ? grade + (school ? ' · ' + school : '') : '📚 Сурагч';
          roleEl.textContent = label;
          roleEl.style.color = '#93c5fd';
        }
      }
      if (schoolEl && school) schoolEl.textContent = school;

      // Show teacher-only nav items
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
