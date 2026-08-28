/* ============ THEME ============ */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const iconMoon = document.getElementById('iconMoon');
const iconSun = document.getElementById('iconSun');
let currentTheme = 'dark'; // in-memory only — see note below

function applyTheme(t){
  currentTheme = t;
  root.setAttribute('data-theme', t);
  iconMoon.style.display = t === 'dark' ? 'block' : 'none';
  iconSun.style.display = t === 'light' ? 'block' : 'none';
}
// Default to system preference if available, else dark
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
  applyTheme('dark'); // brief calls for dark-first design; user can switch
} else {
  applyTheme('dark');
}
themeToggle.addEventListener('click', () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark'));
/* Note: theme choice is kept in memory for this session only (no localStorage,
   per this environment's restrictions). When you deploy this file to GitHub
   Pages / Render / Netlify, you can persist it by adding:
   localStorage.setItem('theme', t) in applyTheme(), and reading it on load. */

/* ============ NAV ============ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
function closeNav(){ navLinks.classList.remove('open'); }

/* ============ TYPEWRITER ============ */
const lines = [
  "The best way to predict the future is to build it.",
  "Learning to teach machines how to think — one algorithm at a time."
];
const twEl = document.getElementById('typewriter-line');
let li = 0, ci = 0, deleting = false;
function typeLoop(){
  const full = lines[li];
  if (!deleting){
    ci++;
    twEl.innerHTML = full.slice(0, ci) + '<span class="cursor-blink"></span>';
    if (ci === full.length){ deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    ci--;
    twEl.innerHTML = full.slice(0, ci) + '<span class="cursor-blink"></span>';
    if (ci === 0){ deleting = false; li = (li + 1) % lines.length; }
  }
  setTimeout(typeLoop, deleting ? 25 : 45);
}
typeLoop();

/* ============ BOOT TERMINAL ============ */
const bootLines = [
  { p: 'whoami' }, { o: 'Pranav Jadhav' },
  { p: 'cat role.txt' }, { o: 'Computer Engineering student · GCOEARA, Pune' },
  { p: 'cat focus.txt' }, { o: 'C/C++ · DSA · Python → AI/ML' },
  { p: './build_status' }, { ok: '✓ shipping small, working things' }
];
const bootEl = document.getElementById('bootTerminal');
let bi = 0;
function renderBootLine(){
  if (bi >= bootLines.length) return;
  const item = bootLines[bi];
  const div = document.createElement('div');
  div.className = 'line';
  if (item.p){ div.innerHTML = '<span class="prompt">➜ ~ </span>' + item.p; }
  else if (item.ok){ div.innerHTML = '<span class="ok">' + item.ok + '</span>'; }
  else { div.innerHTML = '<span class="out">' + item.o + '</span>'; }
  bootEl.appendChild(div);
  bi++;
  setTimeout(renderBootLine, item.p ? 500 : 650);
}
setTimeout(renderBootLine, 500);

/* ============ MARQUEE ============ */
const techWords = ['C','C++','Java','Python','JavaScript','React','Node.js','Express','MongoDB','PostgreSQL','Git','GitHub','NumPy','PyTorch','DSA'];
const marqueeTrack = document.getElementById('marqueeTrack');
const marqueeHTML = techWords.map(w => `<span><b>${w}</b></span>`).join('<span>·</span>');
marqueeTrack.innerHTML = marqueeHTML + marqueeHTML; // duplicate for seamless loop

/* ============ SCROLL REVEAL ============ */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* ============ BACKGROUND — DRIFTING PARTICLE FIELD ============ */
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let W, H, particles = [];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PARTICLE_COUNT = 70;

function cssVar(name, fallback){
  const v = getComputedStyle(root).getPropertyValue(name).trim();
  return v || fallback;
}
function accentColor(){ return cssVar('--signal', '#6E8BFF'); }
function emberColor(){ return cssVar('--ember', '#F2A94E'); }
function pulseColor(){ return cssVar('--pulse', '#6EE7B7'); }

function initParticles(){
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++){
    const r = Math.random() * 1.6 + 0.6;
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r,
      glow: r * (Math.random() * 5 + 5),
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      hue: Math.random() < 0.5 ? 'signal' : (Math.random() < 0.66 ? 'ember' : 'pulse'),
      alpha: Math.random() * 0.45 + 0.15
    });
  }
}

function resizeBg(){
  W = bgCanvas.width = window.innerWidth;
  H = bgCanvas.height = window.innerHeight;
  initParticles();
}
resizeBg();
window.addEventListener('resize', resizeBg);

function drawBg(){
  bgCtx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
    if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;

    const color = p.hue === 'signal' ? accentColor() : (p.hue === 'ember' ? emberColor() : pulseColor());
    const grad = bgCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glow);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');
    bgCtx.globalAlpha = p.alpha;
    bgCtx.fillStyle = grad;
    bgCtx.beginPath(); bgCtx.arc(p.x, p.y, p.glow, 0, Math.PI * 2); bgCtx.fill();
  });
  bgCtx.globalAlpha = 1;
  if (!reduceMotion) requestAnimationFrame(drawBg);
}
drawBg();

/* ============ CURSOR TRAIL ============ */
const curCanvas = document.getElementById('cursor-canvas');
const curCtx = curCanvas.getContext('2d');
let trail = [];

function resizeCur(){ curCanvas.width = window.innerWidth; curCanvas.height = window.innerHeight; }
resizeCur();
window.addEventListener('resize', resizeCur);

if (!reduceMotion){
  const glowSelector = '.term-card, .focus-card, .proj-card, .skill-group, .gh-card, .contact-card, #chat-panel';
  let spotEl = null;

  function updateSpot(x, y, target){
    const card = target && target.closest && target.closest(glowSelector);
    if (card){
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (x - rect.left) + 'px');
      card.style.setProperty('--my', (y - rect.top) + 'px');
      if (spotEl !== card){
        if (spotEl) spotEl.classList.remove('spot-active');
        card.classList.add('spot-active');
        spotEl = card;
      }
    } else if (spotEl){
      spotEl.classList.remove('spot-active');
      spotEl = null;
    }
  }

  function addTrailPoint(x, y, target){
    updateSpot(x, y, target);
    trail.push({ x, y, life: 1 });
    if (trail.length > 22) trail.shift();
  }
  window.addEventListener('mousemove', (e) => addTrailPoint(e.clientX, e.clientY, e.target));
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (!t) return;
    addTrailPoint(t.clientX, t.clientY, document.elementFromPoint(t.clientX, t.clientY));
  }, { passive: true });

  function drawTrail(){
    curCtx.clearRect(0, 0, curCanvas.width, curCanvas.height);
    const color = accentColor();
    trail.forEach((p, i) => {
      p.life -= 0.045;
      const r = (i / trail.length) * 4 + 1;
      curCtx.save();
      curCtx.shadowBlur = 10;
      curCtx.shadowColor = color;
      curCtx.beginPath();
      curCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
      curCtx.fillStyle = color;
      curCtx.globalAlpha = Math.max(p.life, 0);
      curCtx.fill();
      curCtx.restore();
    });
    curCtx.globalAlpha = 1;
    trail = trail.filter(p => p.life > 0);
    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}

/* ============ CHATBOT ============ */
const KB = {
  name: 'Pranav Jadhav',
  college: 'GCOEARA — Government College of Engineering and Research, Avasari Khurd, Pune',
  university: 'Savitribai Phule Pune University (SPPU)',
  degree: "B.E. in Computer Engineering (third-year)",
  location: 'Pune, Maharashtra, India',
  mission: 'Build technology that solves real problems.',
  email: 'jadhav.pranav.1819@gmail.com',
  github: 'https://github.com/pranavjadhav1819',
  linkedin: 'https://www.linkedin.com/in/pranav-jadhav-31006b373/',
  instagram: 'https://www.instagram.com/pranavv._.18/?hl=en',
  resume: 'https://github.com/pranavjadhav1819/MY_CV/raw/main/assets/Pranav_Jadhav_CV.pdf',
  projects: [
    { name: 'IPGK — India Public Knowledge Graph', url: 'https://github.com/pranavjadhav1819/IPGK-India-Public-Knowledge-Graph-', blurb: 'a long-term vision for an open data infrastructure layer for India' },
    { name: 'Yojana Sahayak', url: null, blurb: 'a voice-first assistant for discovering Indian government welfare schemes, in Hindi and Marathi' },
    { name: 'Habit Tracker (Ledger)', url: 'https://github.com/pranavjadhav1819/Habit-Tracker', blurb: 'a habit-tracking web app, currently being deployed' },
    { name: 'SplitExpenses', url: 'https://github.com/pranavjadhav1819/Splitexpenses', blurb: 'a group expense-splitting app with a debt-simplification algorithm' },
    { name: 'GCOEARA Notes', url: 'https://github.com/pranavjadhav1819/GCOEARA_NOTES', blurb: 'a study-resource platform for his own college' },
    { name: 'Day Plan', url: 'https://github.com/pranavjadhav1819/day-plan', blurb: 'a simple daily-planning web app' }
  ]
};

function botReply(raw){
  const q = raw.toLowerCase();
  const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;

  if (/\b(hi|hello|hey|yo)\b/.test(q)){
    return "Hey! I'm a small bot standing in for Pranav — ask me about his education, skills, projects, or how to reach him.";
  }
  if (/(name|who.*(you|is pranav))/.test(q)){
    return `He's ${KB.name}, a ${KB.degree} student.`;
  }
  if (/(college|university|study|education|degree|gcoeara|sppu)/.test(q)){
    return `Pranav is studying at ${KB.college}, affiliated with ${KB.university}, pursuing his ${KB.degree}. He's based in ${KB.location}.`;
  }
  if (/(skill|tech|stack|language|know|proficien)/.test(q)){
    return "He works with C, C++, Java, Python and JavaScript, builds full-stack apps with React/Node/Express and MongoDB/MySQL/PostgreSQL, and is currently picking up NumPy and PyTorch for AI/ML.";
  }
  if (/(project|built|build|work.*(done|shown)|habit|tally|split|ipgk|yojana|gcoeara notes|day plan)/.test(q)){
    const list = KB.projects.map(p => p.url ? `<b>${p.name}</b> — ${p.blurb} (${link(p.url, 'GitHub')})` : `<b>${p.name}</b> — ${p.blurb}`).join('<br>');
    return `Here's what he's built:<br>${list}`;
  }
  if (/(mission|goal|why|philosoph)/.test(q)){
    return `His stated mission: "${KB.mission}" — with the long-term goal of working as a Software Engineer, Full-Stack Developer, or AI/ML Engineer.`;
  }
  if (/(ai|ml|machine learning|roadmap|learning|deep learning|knowledge graph)/.test(q)){
    return "He's on a self-directed AI/ML roadmap — math + Python tooling, then classical ML, then deep learning with PyTorch — aiming to ship a NumPy neural net, an MNIST classifier, and a small transformer along the way. He's also drawn to knowledge graphs and retrieval systems, which is where IPGK comes from.";
  }
  if (/(resume|cv)/.test(q)){
    return `You can grab it here: ${link(KB.resume, 'Download résumé ↗')}`;
  }
  if (/(contact|email|reach|hire|internship)/.test(q)){
    return `Best way is email: ${link('mailto:' + KB.email, KB.email)}. He's open to software, AI/ML and full-stack internships.`;
  }
  if (/(github|repo|repository|open source)/.test(q)){
    return `Here you go: ${link(KB.github, KB.github.replace('https://',''))}`;
  }
  if (/(linkedin)/.test(q)){
    return `Here: ${link(KB.linkedin, 'LinkedIn profile ↗')}`;
  }
  if (/(insta|instagram)/.test(q)){
    return `Here: ${link(KB.instagram, 'Instagram ↗')}`;
  }
  if (/(thank|thanks|cool|nice|great)/.test(q)){
    return "Anytime! Anything else you'd like to know about Pranav?";
  }
  return "I don't have a good answer for that yet — but you can reach Pranav directly at " + link('mailto:' + KB.email, KB.email) + " and ask him.";
}

const chatFab = document.getElementById('chat-fab');
const chatPanel = document.getElementById('chat-panel');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatClose = document.getElementById('chatClose');
const chatChips = document.getElementById('chatChips');

function addMsg(text, who){
  const div = document.createElement('div');
  div.className = 'msg ' + who;
  div.innerHTML = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

let chatOpened = false;
function openChat(){
  chatPanel.classList.add('open');
  if (!chatOpened){
    addMsg("Hey, I'm a quick bot trained on Pranav's details. Ask about his skills, projects, education, or how to reach him.", 'bot');
    chatOpened = true;
  }
}
chatFab.addEventListener('click', openChat);
chatClose.addEventListener('click', () => chatPanel.classList.remove('open'));

const quickChips = ['Skills', 'Projects', 'Education', 'Contact', 'Resume'];
quickChips.forEach(c => {
  const b = document.createElement('button');
  b.className = 'chip-btn'; b.textContent = c;
  b.addEventListener('click', () => sendMsg(c));
  chatChips.appendChild(b);
});

function sendMsg(text){
  if (!text.trim()) return;
  addMsg(text, 'user');
  chatInput.value = '';
  setTimeout(() => addMsg(botReply(text), 'bot'), 380);
}
chatSend.addEventListener('click', () => sendMsg(chatInput.value));
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMsg(chatInput.value); });
