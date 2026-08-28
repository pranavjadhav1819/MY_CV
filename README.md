# Pranav Jadhav — Portfolio / CV

Personal portfolio site for Pranav Jadhav, a Computer Engineering student at GCOEARA
(affiliated with SPPU), Pune. Built as a single dark/glass-themed page with an animated
particle background, a cursor-reactive glow on the card surfaces, a dark/light mode
switcher, and a small terminal-style chatbot that answers visitor questions about Pranav.

## Structure

```
index.html      — page markup
css/style.css   — all styling (glass/dark theme, animations, responsive layout)
js/main.js      — theme toggle, background animation, cursor glow, chatbot logic
assets/         — Pranav_Jadhav_CV.pdf (résumé, kept as-is)
```

## Sections

- Hero — intro, taglines, résumé download, social links
- About — bio, focus areas
- Roadmap — self-directed AI/ML learning path
- Projects — IPGK, Yojana Sahayak, Habit Tracker, SplitExpenses, GCOEARA Notes, Day Plan
- Skills — languages, frontend, backend & data, tools
- GitHub — profile stats
- Contact — email, socials, résumé download
- A floating "ask about Pranav" chatbot answering visitor questions from a small
  built-in knowledge base (no external API — works as a static site)

## Running locally

No build step — it's plain HTML/CSS/JS.

```
git clone https://github.com/pranavjadhav1819/MY_CV.git
cd MY_CV
open index.html   # or just double-click it / use a local server like `npx serve`
```

## Notes

- Dark/light mode currently resets on reload (in-memory only). To persist it across
  visits, add `localStorage.setItem('theme', t)` inside `applyTheme()` in `js/main.js`
  and read it back on load.
- Contact: jadhav.pranav.1819@gmail.com
