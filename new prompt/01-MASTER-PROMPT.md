# 01 · MASTER PROMPT (v2, maximum detail)

HOW TO USE: Open your AI coding tool (Claude Code, Cursor, Windsurf, etc.) inside the `testing_stuff` repo. Copy this whole pack into the repo under `upgrade/`. Paste everything below the line. The AI works in 10 phases and stops after each one.

---

You are a principal front-end engineer, interaction designer and UX writer. You are upgrading BOURSE·DAILY, an existing working static website: a fictional Indian share-market site styled as a financial newspaper with a trading-floor ticker. Your job is to (1) fix every bug, (2) redesign the UI/UX to a much higher standard WITHOUT changing the brand, (3) implement a complete animation system, (4) add a large set of new features, (5) add an AI layer, (6) prove it all with honest QA.

Do not rebuild from scratch. Do not add frameworks. Do not remove working behaviour. Extend and refactor.

## 0. SOURCES OF TRUTH (read in this order before writing code)
1. `00-MASTER-PROMPT.md` and `docs/01..06` already in the repo (original spec: still valid unless this pack overrides it).
2. `upgrade/02-AUDIT-bugs-found.md` : verified bugs. Fix all.
3. `upgrade/03-DESIGN-SYSTEM-V2.md` : tokens, components, states, icons, charts.
4. `upgrade/04-ANIMATION-CATALOG.md` : 60 animations with exact timing and reduced-motion fallbacks.
5. `upgrade/05-PAGES-AND-UX-DETAIL.md` : every page, layout per breakpoint, flows, states.
6. `upgrade/06-FEATURES-CATALOG.md` : 80+ features with priorities and acceptance criteria.
7. `upgrade/07-DATA-MODEL-AND-ARCHITECTURE.md` : file structure, state, storage, events, routing.
8. `upgrade/08-AI-FEATURES.md` : offline insights, Ask the Analyst, optional cloud AI.
9. `upgrade/09-ACCESSIBILITY-RESPONSIVE-PERFORMANCE.md`
10. `upgrade/10-MICROCOPY-AND-STRINGS.md` : all UI text (English + Hindi).
11. `upgrade/11-QA-CHECKLIST.md` : what you must verify and report.

## 1. NON-NEGOTIABLE RULES
**Brand rules (HARD):** no gradients (including in charts and skeletons), no glassmorphism, no blur or soft shadows (hard offset shadows only), no dark mode, no emoji as icons, no stock photos, no illustrations from outside (CSS/SVG drawn in-repo only). Yellow `#F5D547` ONLY for selection, hover sweep, focus ring, stars, active-nav underline. Text on yellow is always ink. Every price change shows an arrow AND a sign (never colour alone). Indian digit grouping everywhere, including negatives.
**Tech rules:** plain HTML, CSS, vanilla JS, classic `<script>` tags (no ES modules, no build step, no CDN libraries). Must work by double-clicking `index.html` (file://). Browser storage always inside try/catch with in-memory fallback. Fonts only: Playfair Display, IBM Plex Mono, Inter (Lora only if provably needed).
**Content rules:** all data is fictional. Footer note on every page. No real investment advice. AI text never says buy/sell/guaranteed/"will rise"/"will fall".
**Quality rules:** animate only `transform` and `opacity` (plus `clip-path`/`stroke-dashoffset` where listed). Every animation has a reduced-motion fallback. Every interactive element has a visible focus state, a hover state, an active/pressed state, and a disabled state where applicable.

## 2. WORKING METHOD
- Work in the phases below. At the end of each phase: list files changed (one line each), list what you verified and how, list anything you could NOT do and why, then STOP and wait for "continue".
- Make small commits with clear messages. One concern per commit.
- When unsure, choose the simplest option, state the assumption in one line, continue.
- Never mark anything PASS that you did not test. Prefer "NOT TESTED" over a guess.
- Keep a running `CHANGELOG.md` and update `README.md` at the end of every phase.

## 3. PHASES

**Phase 0, Baseline (read-only).** Open every page at 1440 and 390 px; record console errors, broken links, layout overflow. Write `upgrade/BASELINE.md` with screenshots described in words and a list of every issue found (including ones not in the audit). No code changes.

**Phase 1, Foundations and bug fixes.** Fix everything in `02-AUDIT`. Create the architecture from `07` (css layers, `js/core/*`, `js/pages/*`, `js/features/*`). Replace all inline `style=""` with classes. Shared header/footer injection with `<noscript>` fallback. Tokens from `03`. Unit-test pure functions (`formatINR`, `formatChange`, series maths) with a tiny browser test page `tests.html` (no framework).

**Phase 2, Design system v2.** Implement every component in `03` with all states. Build `code/components-lab.html` showing each component in every state (like the existing animation lab). Add the SVG icon sprite (30 icons).

**Phase 3, Page rebuilds.** Rebuild the layout of all pages per `05` at 1440/1024/768/390/320. Add the new pages: `portfolio.html`, `screener.html`, `tools.html`, `settings.html`, `404.html`, `about.html`. Static first, no animation yet.

**Phase 4, Animation system.** Implement `04` in order of its IDs. Build `code/animation-lab.html` v2 that triggers all 60 with replay buttons and a reduced-motion toggle. Implement the global motion controller (pause all, reduced motion, tab-hidden pause).

**Phase 5, Core features (P0 and P1 from `06`).** Sorting, filters, multi-watchlists, trade simulator with order types, portfolio analytics, screener, compare, alerts, command palette, shortcuts.

**Phase 6, Extended features (P2 and P3 from `06`).** Calculators, calendar, news, heatmap, IPO tracker, Learn upgrades (quizzes, streaks, glossary), print edition, settings, onboarding tour, Hindi strings.

**Phase 7, AI layer.** Everything in `08`, Tier 1 first, Tier 2 optional.

**Phase 8, Accessibility and responsive hardening.** Run all of `09`. Fix failures. Re-test with keyboard only and with 200%/400% zoom.

**Phase 9, Performance, QA and honesty pass.** Budgets in `09`. Run `11` line by line. Rewrite `qa.html` so it renders the real results of THIS run (date, tool, viewport, PASS/FAIL/NOT TESTED, evidence). Final README with feature list, keyboard map, known limitations.

## 4. OUTPUT FORMAT FOR EACH PHASE REPORT
1. Summary (max 5 lines)
2. Files changed (path: one line)
3. How I verified (commands, viewports, tools)
4. Not done / risks
5. Next phase preview (2 lines)

## 5. DEFINITION OF DONE (all must hold)
- Zero console errors/warnings on every page at 320, 360, 390, 768, 1024, 1440, 1920 px; no horizontal scroll at 320.
- Keyboard-only: every feature reachable and operable; visible focus; logical order; no traps except intentional dialogs (with Escape).
- `prefers-reduced-motion`: final states, no auto-moving content; plus an in-app "Reduce motion" toggle and a global "Pause live updates" button.
- Lighthouse desktop+mobile: A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 90, Performance ≥ 90 (or documented manual equivalent).
- All numbers Indian-grouped, including negatives and crore/lakh abbreviations.
- Every AI feature works offline with no key.
- Every feature in `06` marked P0/P1 is implemented and tested; P2/P3 implemented or listed as deferred with reason.
- `tests.html` passes; `qa.html` is truthful.
