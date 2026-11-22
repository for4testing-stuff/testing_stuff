# Master prompt (paste into the AI that builds the website)

Attach: this whole folder (or at least reference/, docs/ and code/). Then paste everything below the line.

---

Build "BOURSE·DAILY", a fictional Indian share-market website, as a real multi-page, fully animated site.

SOURCES OF TRUTH (read in this order)
1. reference/Bourse_Daily_Design_Reference.html : pixel target for Home, Stock detail, Watchlist & Portfolio. Copy its CSS values exactly; do not redesign.
2. docs/01-design-system.md : colours (with verified contrast), type, spacing, components.
3. docs/02-pages-and-ux.md : pages, flows, states.
4. docs/03-animation-spec.md : all 17 animations with durations, easing, triggers.
5. docs/04-microinteractions-and-strings.md : small interactions and text animation.
6. docs/05-responsive-accessibility-performance.md : breakpoints, a11y, performance, file:// rules.
6b. docs/06-build-order-and-qa.md : build order and QA checklist.
7. code/ : tested working animation library (animations.css, animations.js, charts.js) and code/animation-lab.html demonstrating every effect. REUSE this code, do not rewrite it.

TECH
Plain HTML, CSS, vanilla JS using classic <script> tags (no modules, no frameworks, no chart libraries) so it opens by double-clicking index.html. Files: index.html, stock.html, watchlist.html, learn.html, css/styles.css (+ animations.css), js/data.js, charts.js, animations.js, app.js. Fonts via Google Fonts: Playfair Display, IBM Plex Mono, Inter. Sample/fictional data only, footer note on every page.

HARD RULES
No gradients, glassmorphism, blur shadows, dark mode, emoji icons, stock photos. Hard offset shadows only. Yellow (#F5D547) only for selection/hover/focus/stars. Text on yellow is always ink. Every price change shows an arrow and a sign.

WORK IN PHASES (stop and show me after each)
Phase 1: the 4 static pages, pixel-matched at 1440, then responsive at 1024/768/390.
Phase 2: animations 1 to 8 from docs/03 plus string effects from docs/04.
Phase 3: animations 9 to 17, search, modal, watchlist/holdings with localStorage in try/catch, page transitions.
Phase 4: accessibility + reduced-motion pass, then performance pass. Report the QA checklist results.

DEFINITION OF DONE
No console errors; no horizontal scroll at 320px; keyboard-only use works; prefers-reduced-motion shows final states; live prices have a pause button; all numbers use Indian grouping.
