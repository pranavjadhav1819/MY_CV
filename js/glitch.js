/* ===========================================================
   Text effects:
   - GlitchText: scrambles random glyphs into a final string,
     used for the hero name and section headings.
   - Typewriter: types/deletes a loop of role strings.
   Respects prefers-reduced-motion (shows final text instantly).
   =========================================================== */

const GLYPHS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*<>/\\';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function glitchReveal(el, finalText, opts = {}) {
  const duration = opts.duration || 900;
  const stepTime = opts.stepTime || 32;

  if (prefersReducedMotion()) {
    el.textContent = finalText;
    return;
  }

  const steps = Math.floor(duration / stepTime);
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    const revealCount = Math.floor((frame / steps) * finalText.length);
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      const ch = finalText[i];
      if (ch === ' ') { out += ' '; continue; }
      if (i < revealCount) {
        out += ch;
      } else {
        out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
    }
    el.textContent = out;

    if (frame >= steps) {
      el.textContent = finalText;
      clearInterval(timer);
    }
  }, stepTime);
}

class Typewriter {
  constructor(el, words, opts = {}) {
    this.el = el;
    this.words = words;
    this.typeSpeed = opts.typeSpeed || 65;
    this.deleteSpeed = opts.deleteSpeed || 35;
    this.pause = opts.pause || 1400;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.deleting = false;

    if (prefersReducedMotion()) {
      this.el.textContent = words[0];
      return;
    }
    this.tick();
  }

  tick() {
    const word = this.words[this.wordIndex];

    if (this.deleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.el.textContent = word.slice(0, this.charIndex);

    let delay = this.deleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.deleting && this.charIndex === word.length) {
      this.deleting = true;
      delay = this.pause;
    } else if (this.deleting && this.charIndex === 0) {
      this.deleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      delay = 250;
    }

    setTimeout(() => this.tick(), delay);
  }
}
