/* ===========================================================
   Main: nav scroll state, mobile menu, active link tracking,
   scroll-reveal sections, hero glitch/typewriter init.
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- footer year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- nav scrolled state ----
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- active link on scroll ----
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-link');
  const linkFor = id => document.querySelector(`.nav-link[href="#${id}"]`);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkFor(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => sectionObserver.observe(s));

  // ---- scroll reveal for cards / groups ----
  const revealTargets = document.querySelectorAll(
    '.about-card, .about-text, .stack-group, .cert-card, .timeline-item, .project-card, .contact-card, .cert-block'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));

  // ---- glitch-in section titles when scrolled into view ----
  const glitchTargets = document.querySelectorAll('.glitch-target');
  const glitchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        glitchReveal(el, el.dataset.text || el.textContent);
        glitchObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  glitchTargets.forEach(el => glitchObserver.observe(el));

  // ---- hero entrance: name glitch + role typewriter ----
  const heroName = document.getElementById('heroName');
  if (heroName) glitchReveal(heroName, heroName.dataset.text, { duration: 1100, stepTime: 28 });

  const roleEl = document.getElementById('roleTypewriter');
  if (roleEl) {
    new Typewriter(roleEl, [
      'Computer Engineering Student',
      'Web Developer',
      'Programmer'
    ]);
  }

  // ---- project card cursor-tracked glow ----
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

});
