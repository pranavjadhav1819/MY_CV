# Pranav Jadhav — Portfolio

A dark, cinematic personal portfolio with a glitch-text hero, an animated
circuit/signal particle network background, scroll-triggered reveals, and a
fully responsive layout. Plain HTML/CSS/JS — no build step, no framework,
no dependencies to install.

## File structure

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── particles.js   → ambient canvas particle network
│   ├── glitch.js       → text scramble + typewriter effects
│   └── main.js          → nav, scroll reveals, init
├── assets/
│   └── Pranav_Jadhav_CV.pdf   → downloadable resume
└── README.md
```

## Run it locally

No build tools needed. Either:
- Open `index.html` directly in a browser, or
- Serve it locally so paths resolve cleanly:
  ```bash
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`

## Deploy on GitHub Pages

1. Create a new GitHub repo (e.g. `pranav-portfolio`).
2. Push these files to the repo root (`index.html` must be at the root, not in a subfolder).
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/pranav-portfolio.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source → Deploy from branch → main → / (root)**.
4. Your site will be live at `https://<your-username>.github.io/pranav-portfolio/`.

If you want it at `https://<your-username>.github.io` directly (no subpath),
name the repo exactly `<your-username>.github.io`.

## Things to personalize before you publish

- **Project links** — in `index.html`, search for `Projects` and replace the
  placeholder `href="#"` links with your real live demo / GitHub repo URLs.
- **GitHub & Instagram icons** — in the footer (`Connect`), the GitHub link
  points to `https://github.com/`. Update it to your profile.
- **Resume PDF** — `assets/Pranav_Jadhav_CV.pdf` was generated from the
  details you gave me. Swap in your own file any time (keep the same
  filename, or update the two `href` references in `index.html`).
- **Project glyphs** — each project card has a small `</>` / `DB` / `AI`
  mark; swap these or replace with screenshots/thumbnails once your projects
  have visuals worth showing.

## Notes on the build

- **Animation** lives in `particles.js` (canvas network, no libraries) and
  `glitch.js` (scramble-reveal + typewriter). Both respect
  `prefers-reduced-motion` and turn themselves off for users who request it.
- **Performance**: particle count scales with viewport size and is capped;
  the canvas pauses when the tab isn't visible.
- **Accessibility**: skip-to-content link, visible focus states, semantic
  landmarks, and reduced-motion support are built in.
- The "Skills" list from your notes was merged into **Tech Stack** as
  grouped tags (Languages / Web Development / Databases & Tools) instead of
  a separate, overlapping section — same information, less repetition.
