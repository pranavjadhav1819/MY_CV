/* ===========================================================
   Ambient "signal network" background.
   Lightweight canvas particle graph: nodes connected by thin
   traces, with occasional pulses travelling along edges —
   a nod to circuits (embedded/IoT) and neural nets (AI/ML).
   No external dependencies, mobile-safe, pauses when hidden.
   =========================================================== */

(function () {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // CSS already hides the canvas in this case

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let nodes = [];
  let pulses = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let rafId = null;
  let running = true;

  const CYAN = '76,230,255';
  const AMBER = '255,180,84';

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = document.documentElement.scrollHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
  }

  function buildNodes() {
    // density scales with viewport area, capped for perf
    const area = width * Math.min(height, window.innerHeight * 1.6);
    const count = Math.min(70, Math.max(28, Math.round(area / 26000)));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * Math.min(height, window.innerHeight * 1.6),
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.4 + 0.6
      });
    }
  }

  function maybeSpawnPulse() {
    if (Math.random() > 0.985 && nodes.length > 4) {
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      // find a reasonably close neighbour to travel toward
      let best = null, bestD = Infinity;
      for (const n of nodes) {
        if (n === a) continue;
        const d = (n.x - a.x) ** 2 + (n.y - a.y) ** 2;
        if (d < bestD && d > 400) { bestD = d; best = n; }
      }
      if (best) {
        pulses.push({ a, b: best, t: 0, color: Math.random() > 0.5 ? CYAN : AMBER });
      }
    }
  }

  function step() {
    const viewBottom = window.scrollY + window.innerHeight + 200;
    ctx.clearRect(0, 0, width, height);

    // update + draw nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      if (mouse.active) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const f = (130 - dist) / 130 * 0.6;
          n.x += (dx / (dist || 1)) * f;
          n.y += (dy / (dist || 1)) * f;
        }
      }
    }

    // draw edges (only within/near current viewport for perf)
    const top = window.scrollY - 200;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (a.y < top || a.y > viewBottom) continue;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.strokeStyle = `rgba(${CYAN},${(1 - d / 150) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // draw nodes
    for (const n of nodes) {
      if (n.y < top || n.y > viewBottom) continue;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${CYAN},0.55)`;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // pulses travelling along an edge
    maybeSpawnPulse();
    pulses = pulses.filter(p => p.t <= 1);
    for (const p of pulses) {
      p.t += 0.012;
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.strokeStyle = `rgba(${p.color},0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.a.x, p.a.y);
      ctx.lineTo(p.b.x, p.b.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.color},0.9)`;
      ctx.shadowColor = `rgba(${p.color},0.9)`;
      ctx.shadowBlur = 8;
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (running) rafId = requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => {
    clearTimeout(window.__netResizeT);
    window.__netResizeT = setTimeout(resize, 150);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => { mouse.active = false; });

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !rafId) step();
    else if (!running && rafId) { cancelAnimationFrame(rafId); rafId = null; }
  });

  resize();
  step();
})();
